"use client";

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/components/SessionProvider";
import { useAdminPageLogic } from "@/hooks/use-admin-page-logic";
import { Youtube, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import ResponsiveImage from "@/components/ResponsiveImage";
import { getYouTubeVideoId, getYouTubeThumbnailUrl } from "@/utils/videoUtils";

interface ImportedVideo {
  title: string;
  description: string;
  thumbnail_url: string;
  video_url: string;
  published_at: string;
}

const YOUTUBE_CHANNEL_HANDLE = "@procodecg2136"; // Hardcoded channel handle

const ImportYouTubeChannel: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { session } = useSession();

  const [isImporting, setIsImporting] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [importedVideosCount, setImportedVideosCount] = useState(0);
  const [skippedVideosCount, setSkippedVideosCount] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const { isLoadingAuth, isAuthenticatedAndAuthorized } = useAdminPageLogic({
    isAdminRequired: true,
  });

  const handleImport = async () => {
    setIsImporting(true);
    setImportStatus(t('importing videos status'));
    setImportedVideosCount(0);
    setSkippedVideosCount(0);
    setError(null);
    const importToastId = toast.loading(t('starting youtube import'));

    try {
      // Step 1: Call Edge Function to fetch videos from YouTube API
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

      // Step 2: Process and insert videos into Supabase DB
      let newVideosCount = 0;
      let existingVideosCount = 0;

      for (const video of fetchedVideos) {
        const videoId = getYouTubeVideoId(video.video_url);
        const thumbnailUrl = videoId ? getYouTubeThumbnailUrl(videoId) : null;

        // Check if video already exists by video_url
        const { data: existingVideo, error: checkError } = await supabase
          .from('youtube_videos')
          .select('id')
          .eq('video_url', video.video_url)
          .single();

        if (checkError && checkError.code !== 'PGRST116') { // PGRST116 means no rows found
          console.warn(`Error checking for existing video ${video.video_url}:`, checkError.message);
          // Continue to next video, but log the warning
        }

        if (existingVideo) {
          existingVideosCount++;
          // Optionally update existing video if details might change
          // const { error: updateError } = await supabase
          //   .from('youtube_videos')
          //   .update({
          //     title: video.title,
          //     description: video.description,
          //     thumbnail_url: thumbnailUrl,
          //     published_at: video.published_at,
          //   })
          //   .eq('id', existingVideo.id);
          // if (updateError) console.error("Error updating existing video:", updateError);
        } else {
          const { error: insertError } = await supabase
            .from('youtube_videos')
            .insert({
              title: video.title,
              description: video.description,
              thumbnail_url: thumbnailUrl,
              video_url: video.video_url,
              published_at: video.published_at,
              created_by: session?.user?.id, // Set created_by to current admin's ID
              created_at: new Date().toISOString(),
            });

          if (insertError) {
            console.error(`Error inserting video ${video.title}:`, insertError.message);
            // Continue to next video, but log the error
          } else {
            newVideosCount++;
          }
        }
      }

      setImportedVideosCount(newVideosCount);
      setSkippedVideosCount(existingVideosCount);
      setImportStatus(t('youtube import summary', { new: newVideosCount, skipped: existingVideosCount }));
      toast.success(t('youtube import complete'), { id: importToastId });

    } catch (err: any) {
      console.error("Error during YouTube import:", err);
      setError(t('youtube import failed', { error: err.message }));
      toast.error(t('youtube import failed', { error: err.message }), { id: importToastId });
    } finally {
      setIsImporting(false);
    }
  };

  if (isLoadingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-foreground">{t('loading status')}</p>
      </div>
    );
  }

  if (!isAuthenticatedAndAuthorized) {
    return null; // The hook handles navigation
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <section className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary">{t('import youtube channel')}</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          {t('import youtube channel subtitle', { channel: YOUTUBE_CHANNEL_HANDLE })}
        </p>
      </section>

      <Card className="max-w-2xl mx-auto p-6 md:p-8 shadow-lg text-center">
        <CardHeader className="pb-6">
          <Youtube className="mx-auto mb-4 text-red-600" size={64} />
          <CardTitle className="text-2xl font-bold mb-2">{t('import videos from channel')}</CardTitle>
          <CardDescription className="text-muted-foreground">
            {t('import videos from channel description', { channel: YOUTUBE_CHANNEL_HANDLE })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={handleImport}
            disabled={isImporting}
            className="w-full text-lg py-6"
          >
            {isImporting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" /> {t('importing status')}
              </>
            ) : (
              <>
                <Youtube className="mr-2 h-5 w-5" /> {t('start import button')}
              </>
            )}
          </Button>

          {importStatus && (
            <div className="mt-6 p-4 rounded-md bg-muted text-muted-foreground text-left">
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

          {error && (
            <div className="mt-6 p-4 rounded-md bg-destructive/10 text-destructive text-left">
              <p className="font-semibold mb-2 flex items-center">
                <XCircle className="mr-2 h-4 w-4" /> {t('import error')}:
              </p>
              <p className="text-sm">{error}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="text-center mt-12">
        <Link to="/admin">
          <Button>{t('back to dashboard')}</Button>
        </Link>
      </div>
    </div>
  );
};

export default ImportYouTubeChannel;