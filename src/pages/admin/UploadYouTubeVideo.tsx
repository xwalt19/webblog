"use client";

import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/components/SessionProvider";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

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

const UploadYouTubeVideo: React.FC = () => {
  const { id: videoId } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { session, profile, loading: sessionLoading } = useSession();
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [publishedAt, setPublishedAt] = useState<Date | undefined>(undefined);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [initialThumbnailUrl, setInitialThumbnailUrl] = useState<string | null>(null);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!sessionLoading) {
      if (!session) {
        toast.error(t('auth.login_required'));
        navigate('/login');
      } else if (profile?.role !== 'admin') {
        toast.error(t('auth.admin_required'));
        navigate('/');
      } else {
        if (videoId) {
          fetchVideoData(videoId);
        } else {
          setDataLoading(false);
        }
      }
    }
  }, [session, profile, sessionLoading, navigate, t, videoId]);

  const fetchVideoData = async (id: string) => {
    setDataLoading(true);
    try {
      const { data, error } = await supabase
        .from('youtube_videos')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        throw error;
      }
      if (data) {
        setTitle(data.title || "");
        setDescription(data.description || "");
        setVideoUrl(data.video_url || "");
        setPublishedAt(data.published_at ? new Date(data.published_at) : undefined);
        setInitialThumbnailUrl(data.thumbnail_url || null);
      }
    } catch (err: any) {
      console.error("Error fetching video data:", err);
      toast.error(t("message.fetch_error", { error: err.message }));
      navigate('/admin/manage-youtube-videos');
    } finally {
      setDataLoading(false);
    }
  };

  const handleThumbnailFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setThumbnailFile(event.target.files[0]);
    } else {
      setThumbnailFile(null);
    }
  };

  const uploadFile = async (file: File, bucket: string, folder: string) => {
    const fileExtension = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExtension}`;
    const filePath = `${folder}/${fileName}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      throw uploadError;
    }

    const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(filePath);
    return publicUrlData.publicUrl;
  };

  const deleteFileFromStorage = async (url: string, bucket: string) => {
    try {
      const path = url.split(`/${bucket}/`)[1];
      if (path) {
        const { error } = await supabase.storage.from(bucket).remove([path]);
        if (error) {
          console.warn(`Failed to delete old file from ${bucket}:`, error.message);
        }
      }
    } catch (e) {
      console.warn("Error parsing file URL for deletion:", e);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setUploading(true);

    if (!title || !videoUrl || !publishedAt) {
      toast.error(t("message.required_fields_missing"));
      setUploading(false);
      return;
    }

    let currentThumbnailUrl = initialThumbnailUrl;

    try {
      // Handle thumbnail upload/update
      if (thumbnailFile) {
        if (initialThumbnailUrl) {
          await deleteFileFromStorage(initialThumbnailUrl, 'video_thumbnails');
        }
        currentThumbnailUrl = await uploadFile(thumbnailFile, 'video_thumbnails', 'youtube_thumbnails');
      } else if (videoId && !initialThumbnailUrl) {
        // If editing and no initial thumbnail but no new file, ensure thumbnail_url is null
        currentThumbnailUrl = null;
      }

      const videoData = {
        title,
        description: description || null,
        video_url: videoUrl,
        published_at: publishedAt.toISOString(),
        thumbnail_url: currentThumbnailUrl,
        ...(videoId ? {} : { created_by: session?.user?.id, created_at: new Date().toISOString() }),
      };

      let error;
      if (videoId) {
        // Update existing video
        const { error: updateError } = await supabase
          .from('youtube_videos')
          .update(videoData)
          .eq('id', videoId);
        error = updateError;
      } else {
        // Insert new video
        const { error: insertError } = await supabase
          .from('youtube_videos')
          .insert([videoData]);
        error = insertError;
      }

      if (error) {
        throw error;
      }

      toast.success(videoId ? t("success.updated") : t("success.added"));
      
      // Reset form or navigate
      if (!videoId) {
        setTitle("");
        setDescription("");
        setVideoUrl("");
        setPublishedAt(undefined);
        setThumbnailFile(null);
        const thumbnailInput = document.getElementById("thumbnail-upload") as HTMLInputElement;
        if (thumbnailInput) thumbnailInput.value = "";
      } else {
        navigate('/admin/manage-youtube-videos'); // Go back to list after edit
      }

    } catch (err: any) {
      console.error("Error saving YouTube video:", err);
      toast.error(t("message.save_failed", { error: err.message }));
    } finally {
      setUploading(false);
    }
  };

  if (sessionLoading || dataLoading || (!session && !sessionLoading) || (session && profile?.role !== 'admin')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-foreground">{t('status.loading')}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <section className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary">
          {videoId ? t('admin.youtube_video.edit_title') : t('admin.youtube_video.add_title')}
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          {videoId ? t('admin.youtube_video.edit_subtitle') : t('admin.youtube_video.add_subtitle')}
        </p>
      </section>

      <Card className="max-w-3xl mx-auto p-6 md:p-8 shadow-lg">
        <CardHeader className="text-center pb-6">
          <CardTitle className="text-2xl font-bold mb-2">
            {videoId ? t('admin.youtube_video.edit_form_title') : t('admin.youtube_video.add_form_title')}
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            {videoId ? t('admin.youtube_video.edit_form_desc') : t('admin.youtube_video.add_form_desc')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="title">{t('label.title')}</Label>
              <Input
                id="title"
                type="text"
                placeholder={t('placeholder.title')}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="description">{t('label.description')}</Label>
              <Textarea
                id="description"
                placeholder={t('placeholder.description')}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1 min-h-[80px]"
              />
            </div>
            <div>
              <Label htmlFor="videoUrl">{t('label.video_url')}</Label>
              <Input
                id="videoUrl"
                type="url"
                placeholder={t('placeholder.video_url')}
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="publishedAt">{t('label.published_at')}</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal mt-1",
                      !publishedAt && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {publishedAt ? format(publishedAt, "PPP") : <span>{t('button.pick_date')}</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={publishedAt}
                    onSelect={setPublishedAt}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <Label htmlFor="thumbnail-upload">{t('label.thumbnail')}</Label>
              <Input
                id="thumbnail-upload"
                type="file"
                accept="image/*"
                onChange={handleThumbnailFileChange}
                className="mt-1"
              />
              {thumbnailFile ? (
                <p className="text-sm text-muted-foreground mt-2">
                  {t('message.selected_thumbnail')}: {thumbnailFile.name}
                </p>
              ) : initialThumbnailUrl && (
                <p className="text-sm text-muted-foreground mt-2">
                  {t('message.current_thumbnail')}: <a href={initialThumbnailUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{initialThumbnailUrl.split('/').pop()}</a>
                </p>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={uploading}>
              {uploading ? t('status.uploading') : (videoId ? t('button.save_changes') : t('button.submit'))}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="text-center mt-12">
        <Link to="/admin/manage-youtube-videos">
          <Button>{t('button.back_to_list')}</Button>
        </Link>
      </div>
    </div>
  );
};

export default UploadYouTubeVideo;