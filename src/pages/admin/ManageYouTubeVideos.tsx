"use client";

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/components/SessionProvider";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Trash, PlusCircle, PlayCircle, Upload, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import ResponsiveImage from "@/components/ResponsiveImage";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAdminPageLogic } from "@/hooks/use-admin-page-logic";
import { getYouTubeVideoId, getYouTubeThumbnailUrl } from "@/utils/videoUtils";
import { formatDisplayDate } from "@/utils/dateUtils"; // Import from dateUtils

interface YouTubeVideo {
  id: string;
  title: string;
  description: string | null;
  thumbnail_url: string | null;
  video_url: string;
  published_at: string;
  created_by: string | null;
  created_at: string;
}

interface ImportedVideo {
  title: string;
  description: string;
  thumbnail_url: string;
  video_url: string;
  published_at: string;
}

const YOUTUBE_CHANNEL_HANDLE = "@procodecg2136";

const ManageYouTubeVideos: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { session, profile, loading: sessionLoading } = useSession();
  const isAdmin = profile?.role === 'admin';
  const queryClient = useQueryClient();

  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [isInitialDataLoaded, setIsInitialDataLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState(false);

  const [isImporting, setIsImporting] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [importedVideosCount, setImportedVideosCount] = useState(0);
  const [skippedVideosCount, setSkippedVideosCount] = useState(0);
  const [importError, setImportError] = useState<string | null>(null);

  const fetchVideos = async () => {
    setIsFetching(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('youtube_videos')
        .select('*')
        .order('published_at', { ascending: false });

      if (error) {
        throw error;
      }
      setVideos(data || []);
    } catch (err: any) {
      console.error("Error fetching YouTube videos:", err);
      setError(t("fetch data error", { error: err.message }));
    } finally {
      setIsFetching(false);
      setIsInitialDataLoaded(true);
    }
  };

  useEffect(() => {
    if (sessionLoading) {
      return;
    }

    if (!session) {
      toast.error(t('login required'));
      navigate('/login');
      return;
    }

    if (!isAdmin) {
      toast.error(t('admin required'));
      navigate('/');
      return;
    }

    fetchVideos();

    const channel = supabase
      .channel('youtube_videos_admin_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'youtube_videos' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['youtubeVideos'] });
          fetchVideos();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };

  }, [session, isAdmin, sessionLoading, navigate, t, queryClient]);

  const handleDelete = async (id: string, thumbnailUrl: string | null) => {
    if (!window.confirm(t("confirm delete youtube video"))) {
      return;
    }
    try {
      if (thumbnailUrl) {
        const filePath = thumbnailUrl.split('/storage/v1/object/public/video_thumbnails/')[1];
        if (filePath) {
          const { error: storageError } = await supabase.storage.from('video_thumbnails').remove([filePath]);
          if (storageError) {
            console.warn("Error deleting thumbnail from storage:", storageError);
            toast.warning(t("storage delete warning", { error: storageError.message }));
          }
        }
      }

      const { error } = await supabase
        .from('youtube_videos')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }
      toast.success(t("deleted successfully"));
    } catch (err: any) {
      console.error("Error deleting video:", err);
      toast.error(t("delete error", { error: err.message }));
    }
  };

  const handleImport = async () => {
    setIsImporting(true);
    setImportStatus(t('importing videos status'));
    setImportedVideosCount(0);
    setSkippedVideosCount(0);
    setImportError(null);
    const importToastId = toast.loading(t('starting youtube import'));

    try {
      const { data, error: edgeFunctionError } = await supabase.functions.invoke('import-youtube-channel', {
        body: { channelHandle: YOUTUBE_CHANNEL_HANDLE },
      });

      if (edgeFunctionError) {
        throw edgeFunctionError;
      }

      if (data && data.error) {
        throw new Error(data.error);
      }

      const fetchedVideos: ImportedVideo[] = data?.videos || [];
      if (fetchedVideos.length === 0) {
        toast.info(t('no new videos found'), { id: importToastId });
        setImportStatus(t('import complete no new videos'));
        setIsImporting(false);
        return;
      }

      let newVideosCount = 0;
      let existingVideosCount = 0;

      for (const video of fetchedVideos) {
        const videoId = getYouTubeVideoId(video.video_url);
        const thumbnailUrl = videoId ? getYouTubeThumbnailUrl(videoId) : null;

        const { data: existingVideo, error: checkError } = await supabase
          .from('youtube_videos')
          .select('id')
          .eq('video_url', video.video_url)
          .single();

        if (checkError && checkError.code !== 'PGRST116') {
          console.warn(`Error checking for existing video ${video.video_url}:`, checkError.message);
        }

        if (existingVideo) {
          existingVideosCount++;
        } else {
          const { error: insertError } = await supabase
            .from('youtube_videos')
            .insert({
              title: video.title,
              description: video.description,
              thumbnail_url: thumbnailUrl,
              video_url: video.video_url,
              published_at: video.published_at,
              created_by: session?.user?.id,
              created_at: new Date().toISOString(),
            });

          if (insertError) {
            console.error(`Error inserting video ${video.title}:`, insertError.message);
          } else {
            newVideosCount++;
          }
        }
      }

      setImportedVideosCount(newVideosCount);
      setSkippedVideosCount(existingVideosCount);
      setImportStatus(t('youtube import summary', { new: newVideosCount, skipped: existingVideosCount }));
      toast.success(t('youtube import complete'), { id: importToastId });
      fetchVideos();

    } catch (err: any) {
      console.error("Error during YouTube import:", err);
      setImportError(t('youtube import failed', { error: err.message }));
      toast.error(t('youtube import failed', { error: err.message }), { id: importToastId });
    } finally {
      setIsImporting(false);
    }
  };

  if (sessionLoading || (!session && !sessionLoading) || (session && !isAdmin)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-foreground">{t('loading status')}</p>
      </div>
    );
  }

  if (!isInitialDataLoaded) {
    return (
      <div className="container mx-auto py-10 px-4">
        <p className="text-center text-muted-foreground">{t('loading status')}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <section className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground capitalize">{t('manage youtube videos')}</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          {t('manage youtube videos subtitle')}
        </p>
      </section>

      <div className="flex justify-end mb-6">
        <Button onClick={handleImport} disabled={isImporting}>
          {isImporting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> {t('importing status')}
            </>
          ) : (
            <>
              <Upload className="h-4 w-4 mr-2" /> {t('import youtube channel')}
            </>
          )}
        </Button>
      </div>

      {importStatus && (
        <div className="mt-6 p-4 rounded-md bg-muted text-muted-foreground text-left mb-6">
          <p className="font-semibold mb-2">{t('import progress')}:</p>
          <p className="flex items-center">
            {isImporting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />}
            {importStatus}
          </p>
          {importedVideosCount > 0 && (
            <p className="mt-1 text-sm">{t('new videos imported', { count: importedVideosCount })}</p>
          )}
          {skippedVideosCount > 0 && (
            <p className="mt-1 text-sm">{t('videos skipped', { count: skippedVideosCount })}</p>
          )}
        </div>
      )}

      {importError && (
        <div className="mt-6 p-4 rounded-md bg-destructive/10 text-destructive text-left mb-6">
          <p className="font-semibold mb-2 flex items-center">
            <XCircle className="mr-2 h-4 w-4" /> {t('import error')}:
          </p>
          <p className="text-sm">{importError}</p>
        </div>
      )}

      {error ? (
        <p className="text-center text-destructive">{error}</p>
      ) : videos.length > 0 ? (
        <Card className="shadow-lg">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('table title')}</TableHead>
                  <TableHead>{t('table thumbnail')}</TableHead>
                  <TableHead>{t('table published at')}</TableHead>
                  <TableHead className="text-right">{t('table actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {videos.map((video) => (
                  <TableRow key={video.id}>
                    <TableCell className="font-medium">{video.title}</TableCell>
                    <TableCell>
                      {video.thumbnail_url ? (
                        <ResponsiveImage 
                          src={video.thumbnail_url} 
                          alt={video.title} 
                          containerClassName="w-16 h-10 rounded" 
                          className="object-cover" 
                        />
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>{formatDisplayDate(video.published_at)}</TableCell>
                    <TableCell className="text-right">
                      <a href={video.video_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 w-9 mr-2">
                        <PlayCircle className="h-4 w-4" />
                      </a>
                      <Link to={`/admin/youtube-videos/${video.id}/edit`}>
                        <Button variant="ghost" size="icon" className="mr-2">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button variant="destructive" size="icon" onClick={() => handleDelete(video.id, video.thumbnail_url)}>
                        <Trash className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <p className="text-center text-muted-foreground mt-8 text-lg">{t('no youtube videos found')}</p>
      )}

      {isFetching && videos.length > 0 && (
        <p className="text-center text-muted-foreground mt-4">{t('updating data')}</p>
      )}

      <div className="text-center mt-12">
        <Link to="/">
          <Button>{t('back to list button')}</Button>
        </Link>
      </div>
    </div>
  );
};

export default ManageYouTubeVideos;