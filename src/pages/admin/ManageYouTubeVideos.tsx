"use client";

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/components/SessionProvider";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Trash, PlusCircle, PlayCircle } from "lucide-react";

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

const ManageYouTubeVideos: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { session, profile, loading: sessionLoading } = useSession();
  const isAdmin = profile?.role === 'admin';

  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionLoading) {
      if (!session) {
        toast.error(t('auth.login required'));
        navigate('/login');
      } else if (!isAdmin) {
        toast.error(t('auth.admin access required'));
        navigate('/');
      } else {
        fetchVideos();
      }
    }
  }, [session, isAdmin, sessionLoading, navigate, t]);

  const fetchVideos = async () => {
    setDataLoading(true);
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
      setError(t("manage youtube videos.fetch error", { error: err.message }));
    } finally {
      setDataLoading(false);
    }
  };

  const handleDelete = async (id: string, thumbnailUrl: string | null) => {
    if (!window.confirm(t("manage youtube videos.confirm delete"))) {
      return;
    }
    try {
      // Optionally delete the thumbnail image from storage if it exists
      if (thumbnailUrl) {
        const filePath = thumbnailUrl.split('/storage/v1/object/public/video_thumbnails/')[1];
        if (filePath) {
          const { error: storageError } = await supabase.storage.from('video_thumbnails').remove([filePath]);
          if (storageError) {
            console.warn("Error deleting thumbnail from storage:", storageError);
            toast.warning(t("manage youtube videos.storage delete warning", { error: storageError.message }));
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
      toast.success(t("manage youtube videos.video deleted successfully"));
      fetchVideos(); // Refresh the list
    } catch (err: any) {
      console.error("Error deleting video:", err);
      toast.error(t("manage youtube videos.delete error", { error: err.message }));
    }
  };

  const formatDisplayDate = (isoString: string) => {
    const dateObj = new Date(isoString);
    return dateObj.toLocaleDateString(i18n.language === 'id' ? 'id-ID' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (sessionLoading || (!session && !sessionLoading) || (session && !isAdmin)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-foreground">{t('loading')}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <section className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary">{t('manage youtube videos.title')}</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          {t('manage youtube videos.subtitle')}
        </p>
      </section>

      <div className="flex justify-end mb-6">
        <Link to="/admin/youtube-videos/new">
          <Button>
            <PlusCircle className="h-4 w-4 mr-2" /> {t('manage youtube videos.add new video')}
          </Button>
        </Link>
      </div>

      {dataLoading ? (
        <p className="text-center text-muted-foreground">{t('manage youtube videos.loading videos')}</p>
      ) : error ? (
        <p className="text-center text-destructive">{error}</p>
      ) : videos.length > 0 ? (
        <Card className="shadow-lg">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('manage youtube videos.table title')}</TableHead>
                  <TableHead>{t('manage youtube videos.table thumbnail')}</TableHead>
                  <TableHead>{t('manage youtube videos.table published at')}</TableHead>
                  <TableHead className="text-right">{t('manage youtube videos.table actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {videos.map((video) => (
                  <TableRow key={video.id}>
                    <TableCell className="font-medium">{video.title}</TableCell>
                    <TableCell>
                      {video.thumbnail_url ? (
                        <img src={video.thumbnail_url} alt={video.title} className="w-16 h-10 object-cover rounded" />
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
        <p className="text-center text-muted-foreground mt-8 text-lg">{t('manage youtube videos.no videos')}</p>
      )}

      <div className="text-center mt-12">
        <Link to="/">
          <Button>{t('back to home')}</Button>
        </Link>
      </div>
    </div>
  );
};

export default ManageYouTubeVideos;