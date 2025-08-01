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

interface TikTokVideo {
  id: string;
  title: string;
  description: string | null;
  thumbnail_url: string | null;
  video_url: string;
  published_at: string;
  created_by: string | null;
  created_at: string;
}

const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

const UploadTikTokVideo: React.FC = () => {
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
        toast.error(t('login required'));
        navigate('/login');
      } else if (profile?.role !== 'admin') {
        toast.error(t('admin required'));
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
        .from('tiktok_videos')
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
      toast.error(t("fetch data error", { error: err.message }));
      navigate('/admin/manage-tiktok-videos');
    } finally {
      setDataLoading(false);
    }
  };

  const handleThumbnailFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (file.size > MAX_IMAGE_SIZE_BYTES) {
        toast.error(t('file size too large', { max: '5MB' }));
        event.target.value = ''; // Clear the input
        setThumbnailFile(null);
        return;
      }
      setThumbnailFile(file);
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
      toast.error(t("required fields missing"));
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
        currentThumbnailUrl = await uploadFile(thumbnailFile, 'video_thumbnails', 'tiktok_thumbnails');
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
          .from('tiktok_videos')
          .update(videoData)
          .eq('id', videoId);
        error = updateError;
      } else {
        // Insert new video
        const { error: insertError } = await supabase
          .from('tiktok_videos')
          .insert([videoData]);
        error = insertError;
      }

      if (error) {
        throw error;
      }

      toast.success(videoId ? t("updated successfully") : t("added successfully"));
      
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
        navigate('/admin/manage-tiktok-videos'); // Go back to list after edit
      }

    } catch (err: any) {
      console.error("Error saving TikTok video:", err);
      toast.error(t("save failed", { error: err.message }));
    } finally {
      setUploading(false);
    }
  };

  if (sessionLoading || dataLoading || (!session && !sessionLoading) || (session && profile?.role !== 'admin')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-foreground">{t('loading status')}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <section className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary">
          {videoId ? t('edit tiktok video') : t('add tiktok video')}
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          {videoId ? t('edit tiktok video subtitle') : t('add tiktok video subtitle')}
        </p>
      </section>

      <Card className="max-w-3xl mx-auto p-6 md:p-8 shadow-lg">
        <CardHeader className="text-center pb-6">
          <CardTitle className="text-2xl font-bold mb-2">
            {videoId ? t('edit tiktok video form') : t('add tiktok video form')}
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            {videoId ? t('edit tiktok video form description') : t('add tiktok video form description')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="title">{t('title label')}</Label>
              <Input
                id="title"
                type="text"
                placeholder={t('title placeholder')}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="description">{t('description label')}</Label>
              <Textarea
                id="description"
                placeholder={t('description placeholder')}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1 min-h-[80px]"
              />
            </div>
            <div>
              <Label htmlFor="videoUrl">{t('video url label')}</Label>
              <Input
                id="videoUrl"
                type="url"
                placeholder={t('video url placeholder')}
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="publishedAt">{t('published at label')}</Label>
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
                    {publishedAt ? format(publishedAt, "PPP") : <span>{t('pick a date button')}</span>}
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
              <Label htmlFor="thumbnail-upload">{t('thumbnail label')}</Label>
              <Input
                id="thumbnail-upload"
                type="file"
                accept="image/*"
                onChange={handleThumbnailFileChange}
                className="mt-1"
              />
              {thumbnailFile ? (
                <p className="text-sm text-muted-foreground mt-2">
                  {t('selected thumbnail')}: {thumbnailFile.name}
                </p>
              ) : initialThumbnailUrl && (
                <p className="text-sm text-muted-foreground mt-2">
                  {t('current thumbnail')}: <a href={initialThumbnailUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{initialThumbnailUrl.split('/').pop()}</a>
                </p>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={uploading}>
              {uploading ? t('uploading status') : (videoId ? t('save changes button') : t('submit button'))}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="text-center mt-12">
        <Link to="/admin/manage-tiktok-videos">
          <Button>{t('back to list button')}</Button>
        </Link>
      </div>
    </div>
  );
};

export default UploadTikTokVideo;