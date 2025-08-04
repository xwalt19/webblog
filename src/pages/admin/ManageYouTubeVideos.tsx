"use client";

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card"; // Removed CardHeader, CardTitle, CardDescription
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/components/SessionProvider";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Trash, PlusCircle, PlayCircle } from "lucide-react"; // Removed Upload icon
import ResponsiveImage from "@/components/ResponsiveImage"; // Import ResponsiveImage
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAdminPageLogic } from "@/hooks/use-admin-page-logic"; // Import the new hook

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
  const { t } = useTranslation(); // Removed i18n as it's not directly used here
  const navigate = useNavigate();
  const { session, profile, loading: sessionLoading } = useSession();
  const isAdmin = profile?.role === 'admin';
  const queryClient = useQueryClient();

  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [isInitialDataLoaded, setIsInitialDataLoaded] = useState(false); // New state for initial load
  const [error, setError] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState(false); // For subsequent fetches

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
      setIsInitialDataLoaded(true); // Mark initial data as loaded after first fetch
    }
  };

  // Combined useEffect for initial load, auth check, and data fetching
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

  }, [session, isAdmin, sessionLoading, navigate, t]); // Dependencies for this effect

  const handleDelete = async (id: string, thumbnailUrl: string | null) => {
    if (!window.confirm(t("confirm delete youtube video"))) {
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
      fetchVideos(); // Refresh the list
    } catch (err: any) {
      console.error("Error deleting video:", err);
      toast.error(t("delete error", { error: err.message }));
    }
  };

  const formatDisplayDate = (isoString: string) => {
    const dateObj = new Date(isoString);
    return dateObj.toLocaleDateString('id-ID', { // Changed to 'id-ID'
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (sessionLoading || (!session && !sessionLoading) || (session && !isAdmin)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-foreground">{t('loading status')}</p>
      </div>
    );
  }

  // If initial data is not loaded yet, show loading for the page content
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
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary">{t('manage youtube videos')}</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          {t('manage youtube videos subtitle')}
        </p>
      </section>

      {/* Removed the import button from here */}
      <div className="flex justify-end mb-6">
        <Link to="/admin/youtube-videos/new">
          <Button>
            <PlusCircle className="h-4 w-4 mr-2" /> {t('add new youtube video')}
          </Button>
        </Link>
      </div>

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

      {/* Optional: show a small spinner if `isFetching` is true for subsequent loads */}
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