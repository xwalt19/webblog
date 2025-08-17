"use client";

import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/components/SessionProvider";
import ResponsiveImage from "@/components/ResponsiveImage";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

interface HeroImageFormData {
  id?: string;
  imageFile: File | null;
  orderIndex: number; // Still needed internally
  initialImageUrl: string | null;
}

interface SupabaseHeroImage {
  id: string;
  image_url: string;
  order_index: number;
  created_at: string;
  created_by: string | null;
}

const UploadHeroImage: React.FC = () => {
  const { id: imageId } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { session, profile, loading: sessionLoading } = useSession();
  const isAdmin = profile?.role === 'admin';
  const queryClient = useQueryClient();
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [orderIndex, setOrderIndex] = useState(0); // Managed internally
  const [initialImageUrl, setInitialImageUrl] = useState<string | null>(null);
  const [dataLoading, setDataLoading] = useState(true);

  // Query to fetch existing hero image data for editing
  const { data: imageData, isLoading: isImageLoading, isError: isImageError, error: imageError } = useQuery<SupabaseHeroImage, Error>({
    queryKey: ['heroImage', imageId],
    queryFn: async () => {
      if (!imageId) throw new Error("Image ID is missing.");
      const { data, error } = await supabase
        .from('hero_images')
        .select('*')
        .eq('id', imageId)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!imageId && !!session && isAdmin,
    staleTime: Infinity,
  });

  // Effect to populate form fields when imageData is loaded or calculate next order for new
  useEffect(() => {
    if (!session || !isAdmin) {
      setDataLoading(false);
      return;
    }

    if (imageData) {
      setOrderIndex(imageData.order_index);
      setInitialImageUrl(imageData.image_url);
      setDataLoading(false);
    } else if (!imageId) {
      // For new images, try to get the next available order_index
      const fetchNextOrderIndex = async () => {
        const { data, error } = await supabase
          .from('hero_images')
          .select('order_index')
          .order('order_index', { ascending: false })
          .limit(1);
        
        if (error) {
          console.error("Error fetching max order index:", error);
          setOrderIndex(0); // Default to 0 on error
        } else {
          setOrderIndex((data && data.length > 0 ? data[0].order_index : -1) + 1);
        }
        setDataLoading(false);
      };
      fetchNextOrderIndex();
    } else {
      setDataLoading(false);
    }
  }, [imageData, imageId, session, isAdmin]);

  // Authentication and authorization check
  useEffect(() => {
    if (!sessionLoading) {
      if (!session) {
        toast.error(t('login required'));
        navigate('/login');
      } else if (!isAdmin) {
        toast.error(t('admin required'));
        navigate('/');
      }
    }
  }, [session, isAdmin, sessionLoading, navigate, t]);

  const handleImageFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (file.size > MAX_IMAGE_SIZE_BYTES) {
        toast.error(t('file size too large', { max: '5MB' }));
        event.target.value = ''; // Clear the input
        setImageFile(null);
        return;
      }
      setImageFile(file);
    } else {
      setImageFile(null);
    }
  };

  const saveImageMutation = useMutation<void, Error, HeroImageFormData>({
    mutationFn: async (formData) => {
      let currentImageUrl = formData.initialImageUrl;

      const uploadFile = async (file: File, bucket: string, folder: string) => {
        const fileExtension = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExtension}`;
        const filePath = `${folder}/${fileName}`;

        const { data: _uploadData, error: uploadError } = await supabase.storage
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

      if (formData.imageFile) {
        if (formData.id && formData.initialImageUrl) {
          await deleteFileFromStorage(formData.initialImageUrl, 'hero_images');
        }
        currentImageUrl = await uploadFile(formData.imageFile, 'hero_images', 'hero_backgrounds');
      } else if (formData.id && !formData.imageFile && formData.initialImageUrl) {
        // If editing and image is cleared, delete old image
        await deleteFileFromStorage(formData.initialImageUrl, 'hero_images');
        currentImageUrl = null;
      }

      if (!currentImageUrl) {
        throw new Error("Image file is required.");
      }

      const imageDataToSave = {
        image_url: currentImageUrl,
        order_index: formData.orderIndex,
        ...(formData.id ? {} : { created_by: session?.user?.id, created_at: new Date().toISOString() }),
      };

      if (formData.id) {
        const { error } = await supabase
          .from('hero_images')
          .update(imageDataToSave)
          .eq('id', formData.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('hero_images')
          .insert([imageDataToSave]);

        if (error) throw error;
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['heroImages'] });
      queryClient.invalidateQueries({ queryKey: ['heroImage', variables.id] });
      toast.success(variables.id ? t("updated successfully") : t("added successfully"));
      
      if (!variables.id) {
        setImageFile(null);
        setInitialImageUrl(null);
        setOrderIndex(prev => prev + 1); // Increment for next new image
        const imageInput = document.getElementById("image-upload") as HTMLInputElement;
        if (imageInput) imageInput.value = "";
      } else {
        navigate('/admin/manage-hero-images');
      }
    },
    onError: (err) => {
      console.error("Error saving hero image:", err);
      toast.error(t("save failed", { error: err.message }));
    },
  });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!imageFile && !initialImageUrl) {
      toast.error(t("image file required"));
      return;
    }
    // orderIndex is now managed automatically, no need for manual validation here

    saveImageMutation.mutate({
      id: imageId,
      imageFile,
      orderIndex,
      initialImageUrl,
    });
  };

  const isLoadingPage = sessionLoading || isImageLoading || dataLoading;

  if (isLoadingPage || (!session && !sessionLoading) || (session && !isAdmin)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-foreground">{t('loading status')}</p>
      </div>
    );
  }

  if (isImageError) {
    return (
      <div className="container mx-auto py-10 px-4">
        <p className="text-center text-destructive">{t("fetch data error", { error: imageError?.message })}</p>
        <div className="text-center mt-12">
          <Link to="/admin/manage-hero-images">
            <Button>{t('back to list button')}</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <section className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary">
          {imageId ? t('edit hero image') : t('add hero image')}
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          {imageId ? t('edit hero image subtitle') : t('add hero image subtitle')}
        </p>
      </section>

      <Card className="max-w-xl mx-auto p-6 md:p-8 shadow-lg">
        <CardHeader className="text-center pb-6">
          <CardTitle className="text-2xl font-bold mb-2">
            {imageId ? t('edit hero image form') : t('add hero image form')}
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            {imageId ? t('edit hero image form description') : t('add hero image form description')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="image-upload">{t('image file label')}</Label>
              <Input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageFileChange}
                className="mt-1"
              />
              {imageFile ? (
                <p className="text-sm text-muted-foreground mt-2">
                  {t('selected image')}: {imageFile.name}
                </p>
              ) : initialImageUrl && (
                <div className="mt-2">
                  <ResponsiveImage 
                    src={initialImageUrl} 
                    alt={t('current image')} 
                    containerClassName="w-32 h-20 rounded-md" 
                    className="object-cover" 
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    {t('current image')}: <a href={initialImageUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{initialImageUrl.split('/').pop()}</a>
                  </p>
                </div>
              )}
            </div>
            {/* Order Index field is now hidden and managed automatically */}
            <Button type="submit" className="w-full" disabled={saveImageMutation.isPending}>
              {saveImageMutation.isPending ? t('uploading status') : (imageId ? t('save changes button') : t('submit button'))}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="text-center mt-12">
        <Link to="/admin/manage-hero-images">
          <Button>{t('back to list button')}</Button>
        </Link>
      </div>
    </div>
  );
};

export default UploadHeroImage;