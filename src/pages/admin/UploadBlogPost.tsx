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
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"; // Import useQueryClient

const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB
const MAX_PDF_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

interface BlogPostData {
  id?: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  tags: string[];
  imageFile: File | null;
  pdfFile: File | null;
  createdAt: Date | undefined;
}

interface SupabaseBlogPost {
  id: string;
  title: string;
  excerpt: string | null;
  created_at: string;
  image_url: string | null;
  category: string | null;
  author: string | null;
  tags: string[] | null;
  content: string | null;
  pdf_link: string | null;
  created_by: string | null;
}

const UploadBlogPost: React.FC = () => {
  const { id: postId } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { session, profile, loading: sessionLoading } = useSession();
  const isAdmin = profile?.role === 'admin';
  const queryClient = useQueryClient(); // Use useQueryClient hook

  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [author, setAuthor] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [initialImageUrl, setInitialImageUrl] = useState<string | null>(null);
  const [initialPdfLink, setInitialPdfLink] = useState<string | null>(null);
  const [formCreatedAt, setFormCreatedAt] = useState<Date | undefined>(undefined);

  // Query to fetch existing blog post data for editing
  const { data: postData, isLoading: isPostLoading, isError: isPostError, error: postError } = useQuery<SupabaseBlogPost, Error>({
    queryKey: ['blogPost', postId],
    queryFn: async () => {
      if (!postId) throw new Error("Post ID is missing.");
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', postId)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!postId && !!session && isAdmin, // Only run if postId exists and user is admin
    staleTime: Infinity, // Data doesn't change unless explicitly updated
  });

  // Query to fetch all possible tags
  const { data: allPossibleTags = [], isLoading: isTagsLoading, isError: isTagsError, error: tagsError } = useQuery<string[], Error>({
    queryKey: ['all_tags_blog_posts_form'], // Separate query key for form tags
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
    enabled: !!session && isAdmin,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  // Query to fetch all categories dynamically
  const { data: categories = [], isLoading: isCategoriesLoading, isError: isCategoriesError, error: categoriesError } = useQuery<string[], Error>({
    queryKey: ['blogCategories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_categories')
        .select('name')
        .order('name', { ascending: true });
      
      if (error) throw error;
      return data.map(cat => cat.name);
    },
    enabled: !!session && isAdmin,
    staleTime: Infinity, // Categories don't change often
  });

  // Effect to populate form fields when postData is loaded
  useEffect(() => {
    if (postData) {
      setTitle(postData.title || "");
      setExcerpt(postData.excerpt || "");
      setContent(postData.content || "");
      setCategory(postData.category || "");
      setAuthor(postData.author || "");
      setSelectedTags(postData.tags?.map(cleanTagForStorage) || []);
      setInitialImageUrl(postData.image_url || null);
      setInitialPdfLink(postData.pdf_link || null);
      setFormCreatedAt(new Date(postData.created_at));
    } else if (!postId) {
      // For new posts, set default created_at
      setFormCreatedAt(new Date());
    }
  }, [postData, postId]);

  // Mutation for saving (add/edit) blog post
  const saveBlogPostMutation = useMutation<void, Error, BlogPostData>({
    mutationFn: async (formData) => {
      let currentImageUrl = initialImageUrl;
      let currentPdfLink = initialPdfLink;

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

      // Handle image upload/update
      if (formData.imageFile) {
        if (initialImageUrl) {
          await deleteFileFromStorage(initialImageUrl, 'images');
        }
        currentImageUrl = await uploadFile(formData.imageFile, 'images', 'blog_thumbnails');
      } else if (postId && !formData.imageFile && initialImageUrl) {
        // If editing and image is cleared, delete old image
        await deleteFileFromStorage(initialImageUrl, 'images');
        currentImageUrl = null;
      }

      // Handle PDF upload/update
      if (formData.pdfFile) {
        if (initialPdfLink) {
          await deleteFileFromStorage(initialPdfLink, 'pdfs');
        }
        currentPdfLink = await uploadFile(formData.pdfFile, 'pdfs', 'blog_pdfs');
      } else if (postId && !formData.pdfFile && initialPdfLink) {
        // If editing and PDF is cleared, delete old PDF
        await deleteFileFromStorage(initialPdfLink, 'pdfs');
        currentPdfLink = null;
      }

      const postToSave = {
        title: formData.title,
        excerpt: formData.excerpt,
        content: formData.content || null,
        image_url: currentImageUrl,
        category: formData.category,
        author: formData.author,
        tags: formData.tags,
        pdf_link: currentPdfLink,
        created_at: formData.createdAt?.toISOString() || new Date().toISOString(),
        ...(formData.id ? {} : { created_by: session?.user?.id }),
      };

      if (formData.id) {
        const { error } = await supabase
          .from('blog_posts')
          .update(postToSave)
          .eq('id', formData.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('blog_posts')
          .insert([postToSave]);

        if (error) throw error;
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['blogPosts'] }); // Invalidate list query
      queryClient.invalidateQueries({ queryKey: ['all_tags_blog_posts'] }); // Invalidate tags query for list
      queryClient.invalidateQueries({ queryKey: ['all_tags_blog_posts_form'] }); // Invalidate tags query for form
      queryClient.invalidateQueries({ queryKey: ['archives'] }); // Invalidate archives if this was an archive
      queryClient.invalidateQueries({ queryKey: ['blogPost', variables.id] }); // Invalidate detail query if editing

      toast.success(variables.id ? t("updated successfully") : t("added successfully"));
      
      if (!variables.id) {
        // Reset form for new post
        setTitle("");
        setExcerpt("");
        setContent("");
        setCategory("");
        setAuthor("");
        setSelectedTags([]);
        setImageFile(null);
        setPdfFile(null);
        setInitialImageUrl(null);
        setInitialPdfLink(null);
        setFormCreatedAt(new Date());
        const imageInput = document.getElementById("image-upload") as HTMLInputElement;
        if (imageInput) imageInput.value = "";
        const pdfInput = document.getElementById("pdf-upload") as HTMLInputElement;
        if (pdfInput) pdfInput.value = "";
      } else {
        navigate('/admin/manage-blog-posts');
      }
    },
    onError: (err) => {
      console.error("Error saving blog post:", err);
      toast.error(t("save failed", { error: err.message }));
    },
  });

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

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!title || !excerpt || !category || !author || !formCreatedAt) {
      toast.error(t("required fields missing"));
      return;
    }

    // For new posts, either image or PDF is required
    if (!postId && !imageFile && !pdfFile) {
      toast.error(t("required fields missing")); // At least one file is required for new posts
      return;
    }

    saveBlogPostMutation.mutate({
      id: postId,
      title,
      excerpt,
      content,
      category,
      author,
      tags: selectedTags,
      imageFile,
      pdfFile,
      createdAt: formCreatedAt,
    });
  };

  const isLoadingPage = sessionLoading || isPostLoading || isTagsLoading || isCategoriesLoading;

  if (isLoadingPage || (!session && !sessionLoading) || (session && !isAdmin)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-foreground">{t('loading status')}</p>
      </div>
    );
  }

  if (isPostError) {
    return (
      <div className="container mx-auto py-10 px-4">
        <p className="text-center text-destructive">{t("fetch data error", { error: postError?.message })}</p>
        <div className="text-center mt-12">
          <Link to="/admin/manage-blog-posts">
            <Button>{t('back to list button')}</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (isTagsError) {
    return (
      <div className="container mx-auto py-10 px-4">
        <p className="text-center text-destructive">{t("fetch data error", { error: tagsError?.message })}</p>
        <div className="text-center mt-12">
          <Link to="/admin/manage-blog-posts">
            <Button>{t('back to list button')}</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (isCategoriesError) {
    return (
      <div className="container mx-auto py-10 px-4">
        <p className="text-center text-destructive">{t("fetch data error", { error: categoriesError?.message })}</p>
        <div className="text-center mt-12">
          <Link to="/admin/manage-blog-posts">
            <Button>{t('back to list button')}</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <section className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary capitalize">
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
              categories={categories} // Pass dynamic categories
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
            <Button type="submit" className="w-full" disabled={saveBlogPostMutation.isPending}>
              {saveBlogPostMutation.isPending ? t('uploading status') : (postId ? t('save changes button') : t('submit button'))}
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