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

const MAX_PDF_SIZE_BYTES = 20 * 1024 * 1024; // 20 MB
const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

const ManageArchives: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { session, profile, loading: sessionLoading } = useSession();
  const isAdmin = profile?.role === 'admin';

  const [archives, setArchives] = useState<ArchivePost[]>([]);
  const [isInitialDataLoaded, setIsInitialDataLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState(false);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentArchiveDataForForm, setCurrentArchiveDataForForm] = useState<ArchivePostFormData | null>(null);
  const [allPossibleTags, setAllPossibleTags] = useState<string[]>([]);

  const fetchArchives = async () => {
    setIsFetching(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .not('pdf_link', 'is', null) // Only fetch posts with a PDF link
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }
      setArchives(data || []);
    } catch (err: any) {
      console.error("Error fetching archives:", err);
      setError(t("fetch data error", { error: err.message }));
    } finally {
      setIsFetching(false);
      setIsInitialDataLoaded(true);
    }
  };

  const fetchAllTags = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('tags');
      
      if (error) throw error;

      const uniqueTags = new Set<string>();
      data.forEach(post => {
        post.tags?.forEach((tag: string) => uniqueTags.add(cleanTagForStorage(tag)));
      });
      setAllPossibleTags(Array.from(uniqueTags).sort());
    } catch (err) {
      console.error("Error fetching all tags:", err);
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

    fetchArchives();
    fetchAllTags();

  }, [session, isAdmin, sessionLoading, navigate, t]);

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

  const handleSaveArchive = async (formData: Omit<ArchivePostFormData, 'initialPdfLink' | 'initialImageUrl'>) => {
    let newPdfLink = formData.id ? currentArchiveDataForForm?.initialPdfLink || null : null;
    let newImageUrl = formData.id ? currentArchiveDataForForm?.initialImageUrl || null : null;

    try {
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
        toast.success(t("updated successfully"));
      } else {
        const { error } = await supabase
          .from('blog_posts')
          .insert([archiveData]);

        if (error) throw error;
        toast.success(t("added successfully"));
      }
      fetchArchives(); // Refresh list after save
    } catch (err: any) {
      console.error("Error saving archive:", err);
      toast.error(t("save failed", { error: err.message }));
      throw err; // Re-throw to let the dialog know it failed
    }
  };

  const handleDeleteArchive = async (id: string, pdfLink: string | null, imageUrl: string | null) => {
    if (!window.confirm(t("confirm delete archive"))) {
      return;
    }
    try {
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
      toast.success(t("deleted successfully"));
      fetchArchives(); // Refresh the list
    } catch (err: any) {
      console.error("Error deleting archive:", err);
      toast.error(t("delete error", { error: err.message }));
    }
  };

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

  if (!session || !isAdmin) {
    return null;
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
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary">{t('manage archives')}</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          {t('manage archives subtitle')}
        </p>
      </section>

      <div className="flex justify-end mb-6">
        <Button onClick={openDialogForAdd}>{t('add new archive')}</Button>
      </div>

      <ArchiveTable
        archives={archives}
        dataLoading={isFetching}
        error={error}
        onEdit={openDialogForEdit}
        onDelete={(id, pdfLink) => {
          const archiveToDelete = archives.find(a => a.id === id);
          handleDeleteArchive(id, pdfLink, archiveToDelete?.image_url || null);
        }}
      />

      <ArchiveFormDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        initialData={currentArchiveDataForForm}
        onSave={handleSaveArchive}
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