"use client";

import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/components/SessionProvider";
import { cleanTagForStorage } from "@/utils/i18nUtils";
import BlogPostFormFields from "@/components/admin/BlogPostFormFields"; // Import new component
import BlogPostMediaUpload from "@/components/admin/BlogPostMediaUpload"; // Import new component

const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB
const MAX_PDF_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

const UploadBlogPost: React.FC = () => {
  const { id: postId } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { session, profile, loading: sessionLoading } = useSession();
  
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [author, setAuthor] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [initialImageUrl, setInitialImageUrl] = useState<string | null>(null);
  const [initialPdfLink, setInitialPdfLink] = useState<string | null>(null);
  const [dataLoading, setDataLoading] = useState(true);
  const [formCreatedAt, setFormCreatedAt] = useState<Date | undefined>(undefined);

  const [allPossibleTags, setAllPossibleTags] = useState<string[]>([]);

  useEffect(() => {
    if (!sessionLoading) {
      if (!session) {
        toast.error(t('login required'));
        navigate('/login');
      } else if (profile?.role !== 'admin') {
        toast.error(t('admin required'));
        navigate('/');
      } else {
        if (postId) {
          fetchPostData(postId);
        } else {
          setFormCreatedAt(new Date());
          setDataLoading(false);
        }
        fetchAllTags();
      }
    }
  }, [session, profile, sessionLoading, navigate, t, postId]);

  const fetchPostData = async (id: string) => {
    setDataLoading(true);
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        throw error;
      }
      if (data) {
        setTitle(data.title || "");
        setExcerpt(data.excerpt || "");
        setContent(data.content || "");
        setCategory(data.category || "");
        setAuthor(data.author || "");
        setSelectedTags(data.tags?.map(cleanTagForStorage) || []);
        setInitialImageUrl(data.image_url || null);
        setInitialPdfLink(data.pdf_link || null);
        setFormCreatedAt(new Date(data.created_at));
      }
    } catch (err: any) {
      console.error("Error fetching post data:", err);
      toast.error(t("fetch data error", { error: err.message }));
      navigate('/content');
    } finally {
      setDataLoading(false);
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

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setUploading(true);

    if (!title || !excerpt || !category || !author || !formCreatedAt) {
      toast.error(t("required fields missing"));
      setUploading(false);
      return;
    }

    let currentImageUrl = initialImageUrl;
    let currentPdfLink = initialPdfLink;

    try {
      // Handle image upload/update
      if (imageFile) {
        if (initialImageUrl) {
          await deleteFileFromStorage(initialImageUrl, 'images');
        }
        currentImageUrl = await uploadFile(imageFile, 'images', 'blog_thumbnails');
      } else if (postId && !initialImageUrl) {
        currentImageUrl = null;
      }

      // Handle PDF upload/update
      if (pdfFile) {
        if (initialPdfLink) {
          await deleteFileFromStorage(initialPdfLink, 'pdfs');
        }
        currentPdfLink = await uploadFile(pdfFile, 'pdfs', 'blog_pdfs');
      } else if (postId && !initialPdfLink) {
        currentPdfLink = null;
      }

      const postData = {
        title,
        excerpt,
        content: content || null,
        image_url: currentImageUrl,
        category,
        author,
        tags: selectedTags,
        pdf_link: currentPdfLink,
        created_at: formCreatedAt.toISOString(),
        ...(postId ? {} : { created_by: session?.user?.id }),
      };

      let error;
      if (postId) {
        const { error: updateError } = await supabase
          .from('blog_posts')
          .update(postData)
          .eq('id', postId);
        error = updateError;
      } else {
        const { error: insertError } = await supabase
          .from('blog_posts')
          .insert([postData]);
        error = insertError;
      }

      if (error) {
        throw error;
      }

      toast.success(postId ? t("updated successfully") : t("added successfully"));
      
      if (!postId) {
        setTitle("");
        setExcerpt("");
        setContent("");
        setCategory("");
        setAuthor("");
        setSelectedTags([]);
        setImageFile(null);
        setPdfFile(null);
        setFormCreatedAt(new Date());
        const imageInput = document.getElementById("image-upload") as HTMLInputElement;
        if (imageInput) imageInput.value = "";
        const pdfInput = document.getElementById("pdf-upload") as HTMLInputElement;
        if (pdfInput) pdfInput.value = "";
      } else {
        navigate('/admin/manage-blog-posts');
      }

    } catch (err: any) {
      console.error("Error saving blog post:", err);
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
          {postId ? t('edit blog post') : t('add blog post')}
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          {postId ? t('edit blog post subtitle') : t('add blog post subtitle')}
        </p>
      </section>

      <Card className="max-w-3xl mx-auto p-6 md:p-8 shadow-lg">
        <CardHeader className="text-center pb-6">
          <CardTitle className="text-2xl font-bold mb-2">
            {postId ? t('edit blog post form') : t('add blog post form')}
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            {postId ? t('edit blog post form description') : t('add blog post form description')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <BlogPostFormFields
              title={title}
              setTitle={setTitle}
              excerpt={excerpt}
              setExcerpt={setExcerpt}
              content={content}
              setContent={setContent}
              category={category}
              setCategory={setCategory}
              author={author}
              setAuthor={setAuthor}
              selectedTags={selectedTags}
              setSelectedTags={setSelectedTags}
              formCreatedAt={formCreatedAt}
              setFormCreatedAt={setFormCreatedAt}
              allPossibleTags={allPossibleTags}
            />
            <BlogPostMediaUpload
              imageFile={imageFile}
              setImageFile={setImageFile}
              pdfFile={pdfFile}
              setPdfFile={setPdfFile}
              initialImageUrl={initialImageUrl}
              initialPdfLink={initialPdfLink}
              MAX_IMAGE_SIZE_BYTES={MAX_IMAGE_SIZE_BYTES}
              MAX_PDF_SIZE_BYTES={MAX_PDF_SIZE_BYTES}
            />
            <Button type="submit" className="w-full" disabled={uploading}>
              {uploading ? t('uploading status') : (postId ? t('save changes button') : t('submit button'))}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="text-center mt-12">
        <Link to="/admin/manage-blog-posts">
          <Button>{t('back to list button')}</Button>
        </Link>
      </div>
    </div>
  );
};

export default UploadBlogPost;