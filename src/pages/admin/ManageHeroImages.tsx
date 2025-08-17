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
import { Edit, Trash, PlusCircle, ArrowUp, ArrowDown } from "lucide-react";
import ResponsiveImage from "@/components/ResponsiveImage";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAdminPageLogic } from "@/hooks/use-admin-page-logic";

interface HeroImage {
  id: string;
  image_url: string;
  order_index: number;
  created_at: string;
  created_by: string | null;
}

const ManageHeroImages: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { session } = useSession();
  const queryClient = useQueryClient();

  const [shouldFetchData, setShouldFetchData] = useState(false);

  const { isLoadingAuth, isAuthenticatedAndAuthorized } = useAdminPageLogic({
    isAdminRequired: true,
    onAuthSuccess: () => setShouldFetchData(true),
  });

  const { data: images, isLoading: isImagesLoading, isError: isImagesError, error: imagesError } = useQuery<HeroImage[], Error>({
    queryKey: ['heroImages'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('hero_images')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) throw error;
      return data || [];
    },
    enabled: shouldFetchData,
  });

  const deleteImageMutation = useMutation<void, Error, { id: string, imageUrl: string }>({
    mutationFn: async ({ id, imageUrl }) => {
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

      await deleteFileFromStorage(imageUrl, 'hero_images');

      const { error } = await supabase
        .from('hero_images')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['heroImages'] });
      toast.success(t("deleted successfully"));
    },
    onError: (err) => {
      console.error("Error deleting image:", err);
      toast.error(t("delete error", { error: err.message }));
    },
  });

  const updateOrderMutation = useMutation<void, Error, { id: string, newOrder: number }>({
    mutationFn: async ({ id, newOrder }) => {
      const { error } = await supabase
        .from('hero_images')
        .update({ order_index: newOrder })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['heroImages'] });
      toast.success(t("order updated successfully"));
    },
    onError: (err) => {
      console.error("Error updating order:", err);
      toast.error(t("failed to update order", { error: err.message }));
    },
  });

  useEffect(() => {
    if (!isAuthenticatedAndAuthorized) {
      return;
    }

    const channel = supabase
      .channel('hero_images_admin_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'hero_images' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['heroImages'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isAuthenticatedAndAuthorized, queryClient]);

  const handleDelete = (id: string, imageUrl: string) => {
    if (!window.confirm(t("confirm delete hero image"))) {
      return;
    }
    deleteImageMutation.mutate({ id, imageUrl });
  };

  const handleMove = (id: string, currentOrder: number, direction: 'up' | 'down') => {
    if (!images) return;

    const currentImageIndex = images.findIndex(img => img.id === id);
    if (currentImageIndex === -1) return;

    const targetIndex = direction === 'up' ? currentImageIndex - 1 : currentImageIndex + 1;

    if (targetIndex < 0 || targetIndex >= images.length) {
      return; // Cannot move further
    }

    const imageToMove = images[currentImageIndex];
    const targetImage = images[targetIndex];

    // Perform optimistic update
    queryClient.setQueryData(['heroImages'], (oldImages: HeroImage[] | undefined) => {
      if (!oldImages) return oldImages;
      const newImages = [...oldImages];
      [newImages[currentImageIndex], newImages[targetIndex]] = [newImages[targetIndex], newImages[currentImageIndex]];
      return newImages.map((img, idx) => ({ ...img, order_index: idx })); // Reassign order_index based on new array position
    });

    // Send updates to backend
    updateOrderMutation.mutate({ id: imageToMove.id, newOrder: targetIndex });
    updateOrderMutation.mutate({ id: targetImage.id, newOrder: currentImageIndex });
  };

  if (isLoadingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-foreground">{t('loading status')}</p>
      </div>
    );
  }

  if (!isAuthenticatedAndAuthorized) {
    return null;
  }

  if (isImagesLoading) {
    return (
      <div className="container mx-auto py-10 px-4">
        <p className="text-center text-muted-foreground">{t('loading status')}</p>
      </div>
    );
  }

  if (isImagesError) {
    return (
      <div className="container mx-auto py-10 px-4">
        <p className="text-center text-destructive">{t("fetch data error", { error: imagesError?.message })}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <section className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary">{t('manage hero images')}</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          {t('manage hero images subtitle')}
        </p>
      </section>

      {/* Removed the "Add New Hero Image" button */}

      {images && images.length > 0 ? (
        <Card className="shadow-lg">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('table image')}</TableHead>
                  {/* Removed Order Index column from display */}
                  <TableHead>{t('table date')}</TableHead>
                  <TableHead className="text-right">{t('table actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {images.map((image, index) => (
                  <TableRow key={image.id}>
                    <TableCell>
                      <ResponsiveImage 
                        src={image.image_url} 
                        alt={`Hero Image ${index + 1}`} 
                        containerClassName="w-32 h-20 rounded" 
                        className="object-cover" 
                      />
                    </TableCell>
                    {/* Removed Order Index cell from display */}
                    <TableCell>{new Date(image.created_at).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleMove(image.id, image.order_index, 'up')} 
                        disabled={index === 0 || updateOrderMutation.isPending}
                        className="mr-1"
                      >
                        <ArrowUp className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleMove(image.id, image.order_index, 'down')} 
                        disabled={index === images.length - 1 || updateOrderMutation.isPending}
                        className="mr-2"
                      >
                        <ArrowDown className="h-4 w-4" />
                      </Button>
                      <Link to={`/admin/hero-images/${image.id}/edit`}>
                        <Button variant="ghost" size="icon" className="mr-2">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button variant="destructive" size="icon" onClick={() => handleDelete(image.id, image.image_url)} disabled={deleteImageMutation.isPending}>
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
        <p className="text-center text-muted-foreground mt-8 text-lg">{t('no hero images found')}</p>
      )}

      {(deleteImageMutation.isPending || updateOrderMutation.isPending) && (
        <p className="text-center text-muted-foreground mt-4">{t('updating data')}</p>
      )}

      <div className="text-center mt-12">
        <Link to="/admin">
          <Button>{t('back to dashboard')}</Button>
        </Link>
      </div>
    </div>
  );
};

export default ManageHeroImages;