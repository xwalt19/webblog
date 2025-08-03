"use client";

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/components/SessionProvider";
import { cleanTagForStorage } from "@/utils/i18nUtils";
import ArchiveTable from "@/components/admin/ArchiveTable";
import ArchiveFormDialog from "@/components/admin/ArchiveFormDialog";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAdminPageLogic } from "@/hooks/use-admin-page-logic"; // Import the new hook

interface ArchivePost {
  id: string;
  title: string;
  excerpt: string | null;
  created_at: string;
  image_url: string | null; // Can be null for archives
  category: string | null;
  author: string | null;
  tags: string[] | null;
  pdf_link: string | null;
}

interface ArchivePostFormData {
  id?: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  tags: string[];
  pdfFile: File | null;
  imageFile: File | null; // Added for image upload
  createdAt: Date | undefined;
  initialPdfLink: string | null; // Untuk menyimpan link PDF yang sudah ada saat edit
  initialImageUrl: string | null; // Added for existing image URL
}

const MAX_PDF_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB
const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

const ManageArchives: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { session } = useSession(); // Only need session for created_by in mutations
  const queryClient = useQueryClient();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentArchiveDataForForm, setCurrentArchiveDataForForm] = useState<ArchivePostFormData | null>(null);

  // State to control when data fetching queries should run
  const [shouldFetchData, setShouldFetchData] = useState(false);

  // Use the new admin page logic hook
  const { isLoadingAuth, isAuthenticatedAndAuthorized } = useAdminPageLogic({
    isAdminRequired: true,
    onAuthSuccess: () => setShouldFetchData(true), // Set flag to true when auth is successful
  });

  // Query to fetch archives
  const { data: archives, isLoading: isArchivesLoading, isError: isArchivesError, error: archivesError } = useQuery<ArchivePost[], Error>({
    queryKey: ['archives'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .not('pdf_link', 'is', null) // Only fetch posts with a PDF link
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: shouldFetchData, // Only run query if auth is successful
  });

  // Query to fetch all possible tags
  const { data: allPossibleTags = [], isLoading: isTagsLoading, isError: isTagsError, error: tagsError } = useQuery<string[], Error>({
    queryKey: ['all_tags'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('tags');
      
      if (error) throw error;

      const uniqueTags = new Set<string>();
      data.forEach(post => {
        post.tags?.forEach((tag: string) => uniqueTags.add(cleanTagForStorage(tag)));
      });
      return Array.from(uniqueTags).sort();
    },
    enabled: shouldFetchData, // Only run query if auth is successful
  });

  // Mutation for saving (add/edit) archive
  const saveArchiveMutation = useMutation<void, Error, Omit<ArchivePostFormData, 'initialPdfLink' | 'initialImageUrl'>>({
    mutationFn: async (formData) => {
      let newPdfLink = formData.id ? currentArchiveDataForForm?.initialPdfLink || null : null;
      let newImageUrl = formData.id ? currentArchiveDataForForm?.initialImageUrl || null : null;

      // Helper function to upload file
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

      // Helper function to delete file from storage
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

      // Handle PDF upload/update
      if (formData.pdfFile) {
        if (formData.id && currentArchiveDataForForm?.initialPdfLink) {
          await deleteFileFromStorage(currentArchiveDataForForm.initialPdfLink, 'pdfs');
        }
        newPdfLink = await uploadFile(formData.pdfFile, 'pdfs', 'blog_pdfs');
      } else if (formData.id && !formData.pdfFile) {
        newPdfLink = currentArchiveDataForForm?.initialPdfLink || null;
      }

      // Handle Image upload/update
      if (formData.imageFile) {
        if (formData.id && currentArchiveDataForForm?.initialImageUrl) {
          await deleteFileFromStorage(currentArchiveDataForForm.initialImageUrl, 'images');
        }
        newImageUrl = await uploadFile(formData.imageFile, 'images', 'blog_thumbnails');
      } else if (formData.id && !formData.imageFile) {
        newImageUrl = currentArchiveDataForForm?.initialImageUrl || null;
      }

      const archiveData = {
        title: formData.title,
        excerpt: formData.excerpt,
        category: formData.category,
        author: formData.author,
        tags: formData.tags,
        pdf_link: newPdfLink,
        image_url: newImageUrl, // Save image URL
        content: null, // Archives do not have content
        created_at: formData.createdAt?.toISOString() || new Date().toISOString(),
        ...(formData.id ? {} : { created_by: session?.user?.id }),
      };

      if (formData.id) {
        const { error } = await supabase
          .from('blog_posts')
          .update(archiveData)
          .eq('id', formData.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('blog_posts')
          .insert([archiveData]);

        if (error) throw error;
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['archives'] });
      queryClient.invalidateQueries({ queryKey: ['all_tags'] });
      toast.success(variables.id ? t("updated successfully") : t("added successfully"));
      setIsDialogOpen(false); // Close dialog on success
    },
    onError: (err) => {
      console.error("Error saving archive:", err);
      toast.error(t("save failed", { error: err.message }));
    },
  });

  // Mutation for deleting archive
  const deleteArchiveMutation = useMutation<void, Error, { id: string, pdfLink: string | null, imageUrl: string | null }>({
    mutationFn: async ({ id, pdfLink, imageUrl }) => {
      // Helper function to delete file from storage
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

      if (pdfLink) {
        await deleteFileFromStorage(pdfLink, 'pdfs');
      }
      if (imageUrl) { // Delete image if it exists
        await deleteFileFromStorage(imageUrl, 'images');
      }

      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['archives'] });
      queryClient.invalidateQueries({ queryKey: ['all_tags'] });
      toast.success(t("deleted successfully"));
    },
    onError: (err) => {
      console.error("Error deleting archive:", err);
      toast.error(t("delete error", { error: err.message }));
    },
  });

  // Realtime subscription (separate useEffect as it's a one-time setup)
  useEffect(() => {
    if (!isAuthenticatedAndAuthorized) { // Only subscribe if authenticated and authorized
      return;
    }

    const channel = supabase
      .channel('archives_admin_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'blog_posts' },
        (payload) => {
          // Only process changes for PDF posts (archives)
          if ((payload.new as ArchivePost)?.pdf_link !== null || (payload.old as ArchivePost)?.pdf_link !== null) {
            // Invalidate the query to refetch data and update UI
            queryClient.invalidateQueries({ queryKey: ['archives'] });
            queryClient.invalidateQueries({ queryKey: ['all_tags'] });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isAuthenticatedAndAuthorized, queryClient]); // Depend on isAuthenticatedAndAuthorized

  const openDialogForAdd = () => {
    setCurrentArchiveDataForForm(null); // Clear data for new entry
    setIsDialogOpen(true);
  };

  const openDialogForEdit = (archive: ArchivePost) => {
    setCurrentArchiveDataForForm({
      id: archive.id,
      title: archive.title,
      excerpt: archive.excerpt || "",
      category: archive.category || "",
      author: archive.author || "",
      tags: archive.tags?.map(cleanTagForStorage) || [],
      pdfFile: null, // File input is cleared for edit, user must re-upload
      imageFile: null, // Image file input is cleared for edit
      createdAt: archive.created_at ? new Date(archive.created_at) : undefined,
      initialPdfLink: archive.pdf_link || null,
      initialImageUrl: archive.image_url || null, // Pass existing image URL
    });
    setIsDialogOpen(true);
  };

  // Render loading state based on auth loading or data loading
  if (isLoadingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-foreground">{t('loading status')}</p>
      </div>
    );
  }

  // If not authenticated/authorized, the hook will navigate, so we return null here
  if (!isAuthenticatedAndAuthorized) {
    return null;
  }

  // Show loading for data fetching after auth is confirmed
  if (isArchivesLoading || isTagsLoading) {
    return (
      <div className="container mx-auto py-10 px-4">
        <p className="text-center text-muted-foreground">{t('loading status')}</p>
      </div>
    );
  }

  if (isArchivesError) {
    return (
      <div className="container mx-auto py-10 px-4">
        <p className="text-center text-destructive">{t("fetch data error", { error: archivesError?.message })}</p>
      </div>
    );
  }

  if (isTagsError) {
    return (
      <div className="container mx-auto py-10 px-4">
        <p className="text-center text-destructive">{t("fetch data error", { error: tagsError?.message })}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <section className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary">{t('manage archives')}</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          {t('manage archives subtitle')}
        </p>
      </section>

      <div className="flex justify-end mb-6">
        <Button onClick={openDialogForAdd}>{t('add new archive')}</Button>
      </div>

      <ArchiveTable
        archives={archives || []}
        dataLoading={isArchivesLoading}
        error={archivesError?.message || null}
        onEdit={openDialogForEdit}
        onDelete={(id, pdfLink, imageUrl) => deleteArchiveMutation.mutate({ id, pdfLink, imageUrl })}
      />

      <ArchiveFormDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        initialData={currentArchiveDataForForm}
        onSave={saveArchiveMutation.mutateAsync} // Use mutateAsync for await
        allPossibleTags={allPossibleTags}
        MAX_PDF_SIZE_BYTES={MAX_PDF_SIZE_BYTES}
        MAX_IMAGE_SIZE_BYTES={MAX_IMAGE_SIZE_BYTES}
      />

      <div className="text-center mt-12">
        <Link to="/">
          <Button>{t('back to list button')}</Button>
        </Link>
      </div>
    </div>
  );
};

export default ManageArchives;