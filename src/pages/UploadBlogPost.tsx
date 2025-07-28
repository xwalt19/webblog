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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string | null;
  content: string | null;
  created_at: string;
  image_url: string | null;
  category: string | null;
  author: string | null;
  tags: string[] | null;
  pdf_link: string | null;
  created_by: string | null; // Add created_by to interface
}

const UploadBlogPost: React.FC = () => {
  const { id: postId } = useParams<{ id: string }>(); // Get post ID from URL for editing
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { session, profile, loading: sessionLoading } = useSession();
  
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [author, setAuthor] = useState("");
  const [tagsInput, setTagsInput] = useState(""); // Comma-separated tags
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [initialImageUrl, setInitialImageUrl] = useState<string | null>(null);
  const [initialPdfLink, setInitialPdfLink] = useState<string | null>(null);
  const [dataLoading, setDataLoading] = useState(true);

  const categories = [
    "Programming", "Technology", "Education", "Data Science", "Cybersecurity", "Mobile Development", "Cloud Computing", "History", "Retro Tech", "Programming History"
  ];

  useEffect(() => {
    if (!sessionLoading) {
      if (!session) {
        toast.error(t('auth.login required'));
        navigate('/login');
      } else if (profile?.role !== 'admin') {
        toast.error(t('auth.admin access required'));
        navigate('/');
      } else {
        if (postId) {
          fetchPostData(postId);
        } else {
          setDataLoading(false); // Ready for new post if no ID
        }
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
        setTagsInput(data.tags?.join(', ') || "");
        setInitialImageUrl(data.image_url || null);
        setInitialPdfLink(data.pdf_link || null);
      }
    } catch (err: any) {
      console.error("Error fetching post data:", err);
      toast.error(t("upload blog post.fetch error", { error: err.message }));
      navigate('/content'); // Redirect if post not found or error
    } finally {
      setDataLoading(false);
    }
  };

  const handleImageFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setImageFile(event.target.files[0]);
    } else {
      setImageFile(null);
    }
  };

  const handlePdfFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setPdfFile(event.target.files[0]);
    } else {
      setPdfFile(null);
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

    if (!title || !excerpt || !category || !author) {
      toast.error(t("upload blog post.required fields missing"));
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
        // If editing and no initial image but no new file, ensure image_url is null
        currentImageUrl = null;
      }

      // Handle PDF upload/update
      if (pdfFile) {
        if (initialPdfLink) {
          await deleteFileFromStorage(initialPdfLink, 'pdfs');
        }
        currentPdfLink = await uploadFile(pdfFile, 'pdfs', 'blog_pdfs');
      } else if (postId && !initialPdfLink) {
        // If editing and no initial PDF but no new file, ensure pdf_link is null
        currentPdfLink = null;
      }

      const tagsArray = tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);

      const postData = {
        title,
        excerpt,
        content: content || null,
        image_url: currentImageUrl,
        category,
        author,
        tags: tagsArray,
        pdf_link: currentPdfLink,
        ...(postId ? {} : { created_by: session?.user?.id }), // Add created_by only for new posts
      };

      let error;
      if (postId) {
        // Update existing post
        const { error: updateError } = await supabase
          .from('blog_posts')
          .update(postData)
          .eq('id', postId);
        error = updateError;
      } else {
        // Insert new post
        const { error: insertError } = await supabase
          .from('blog_posts')
          .insert([{ ...postData, created_at: new Date().toISOString() }]);
        error = insertError;
      }

      if (error) {
        throw error;
      }

      toast.success(postId ? t("upload blog post.post updated successfully") : t("upload blog post.post uploaded successfully"));
      
      // Reset form or navigate
      if (!postId) {
        setTitle("");
        setExcerpt("");
        setContent("");
        setCategory("");
        setAuthor("");
        setTagsInput("");
        setImageFile(null);
        setPdfFile(null);
        const imageInput = document.getElementById("image-upload") as HTMLInputElement;
        if (imageInput) imageInput.value = "";
        const pdfInput = document.getElementById("pdf-upload") as HTMLInputElement;
        if (pdfInput) pdfInput.value = "";
      } else {
        navigate('/admin/manage-blog-posts'); // Go back to list after edit
      }

    } catch (err: any) {
      console.error("Error saving blog post:", err);
      toast.error(t("upload blog post.upload failed", { error: err.message }));
    } finally {
      setUploading(false);
    }
  };

  if (sessionLoading || dataLoading || (!session && !sessionLoading) || (session && profile?.role !== 'admin')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-foreground">{t('loading')}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <section className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary">
          {postId ? t('upload blog post.edit blog post title') : t('upload blog post title')}
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          {postId ? t('upload blog post.edit blog post subtitle') : t('upload blog post subtitle')}
        </p>
      </section>

      <Card className="max-w-3xl mx-auto p-6 md:p-8 shadow-lg">
        <CardHeader className="text-center pb-6">
          <CardTitle className="text-2xl font-bold mb-2">
            {postId ? t('upload blog post.edit blog post') : t('add new blog post')}
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            {postId ? t('upload blog post.fill form to edit blog post') : t('fill form to upload blog post')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="title">{t('upload blog post.title label')}</Label>
              <Input
                id="title"
                type="text"
                placeholder={t('upload blog post.title placeholder')}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="excerpt">{t('upload blog post.excerpt label')}</Label>
              <Textarea
                id="excerpt"
                placeholder={t('upload blog post.excerpt placeholder')}
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                className="mt-1 min-h-[80px]"
              />
            </div>
            <div>
              <Label htmlFor="content">{t('upload blog post.content label')}</Label>
              <Textarea
                id="content"
                placeholder={t('upload blog post.content placeholder')}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="mt-1 min-h-[200px]"
              />
            </div>
            <div>
              <Label htmlFor="category">{t('upload blog post.category label')}</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-full mt-1">
                  <SelectValue placeholder={t('upload blog post.select category')} />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="author">{t('upload blog post.author label')}</Label>
              <Input
                id="author"
                type="text"
                placeholder={t('upload blog post.author placeholder')}
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="tags">{t('upload blog post.tags label')}</Label>
              <Input
                id="tags"
                type="text"
                placeholder={t('upload blog post.tags placeholder')}
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                className="mt-1"
              />
              <p className="text-sm text-muted-foreground mt-1">
                {t('upload blog post.tags hint')}
              </p>
            </div>
            <div>
              <Label htmlFor="image-upload">{t('upload blog post.image label')}</Label>
              <Input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageFileChange}
                className="mt-1"
              />
              {imageFile ? (
                <p className="text-sm text-muted-foreground mt-2">
                  {t('upload blog post.selected image')}: {imageFile.name}
                </p>
              ) : initialImageUrl && (
                <p className="text-sm text-muted-foreground mt-2">
                  {t('upload blog post.current image')}: <a href={initialImageUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{initialImageUrl.split('/').pop()}</a>
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="pdf-upload">{t('upload blog post.pdf label')}</Label>
              <Input
                id="pdf-upload"
                type="file"
                accept="application/pdf"
                onChange={handlePdfFileChange}
                className="mt-1"
              />
              {pdfFile ? (
                <p className="text-sm text-muted-foreground mt-2">
                  {t('upload blog post.selected pdf')}: {pdfFile.name}
                </p>
              ) : initialPdfLink && (
                <p className="text-sm text-muted-foreground mt-2">
                  {t('upload blog post.current pdf')}: <a href={initialPdfLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{initialPdfLink.split('/').pop()}</a>
                </p>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={uploading}>
              {uploading ? t('uploading') : (postId ? t('upload blog post.save changes') : t('upload blog post.submit button'))}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="text-center mt-12">
        <Link to="/admin/manage-blog-posts">
          <Button>{t('back to blog posts list')}</Button>
        </Link>
      </div>
    </div>
  );
};

export default UploadBlogPost;