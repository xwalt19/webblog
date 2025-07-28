"use client";

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/components/SessionProvider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

// Define categories and authors for selection (can be fetched from DB later if dynamic)
const blogCategories = [
  "blog posts.category programming",
  "blog posts.category technology",
  "blog posts.category education",
  "blog posts.category data science",
  "blog posts.category cybersecurity",
  "blog posts.category mobile development",
  "blog posts.category cloud computing",
  "archives.category history",
  "archives.category retro tech",
  "archives.category programming history",
];

const blogAuthors = [
  "blog posts.author procodecg",
  // Add more authors if needed
];

const formSchema = z.object({
  titleKey: z.string().min(1, { message: "Title is required." }),
  excerptKey: z.string().min(1, { message: "Excerpt is required." }),
  imageFile: z.any().optional(),
  categoryKey: z.string().min(1, { message: "Category is required." }),
  authorKey: z.string().min(1, { message: "Author is required." }),
  tagsKeys: z.string().optional(),
  content: z.string().min(1, { message: "Content is required." }), // Changed from contentKey
  pdfLink: z.string().url({ message: "Must be a valid URL." }).optional().or(z.literal('')),
});

const UploadBlogPost: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { session, profile, loading } = useSession();
  const [uploading, setUploading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      titleKey: "",
      excerptKey: "",
      categoryKey: "",
      authorKey: "",
      tagsKeys: "",
      content: "", // Changed from contentKey
      pdfLink: "",
    },
  });

  useEffect(() => {
    if (!loading) {
      if (!session) {
        toast.error(t('auth.login required'));
        navigate('/login');
      } else if (profile?.role !== 'admin') {
        toast.error(t('auth.admin access required'));
        navigate('/');
      }
    }
  }, [session, profile, loading, navigate, t]);

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setUploading(true);

    let imageUrl: string | null = null;
    if (values.imageFile && values.imageFile.length > 0) {
      const imageFile = values.imageFile[0];
      const fileExtension = imageFile.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExtension}`;
      const filePath = `blog_images/${fileName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, imageFile, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) {
        console.error("Error uploading image:", uploadError);
        toast.error(t("blog post.image upload failed", { error: uploadError.message }));
        setUploading(false);
        return;
      }
      
      const { data: publicUrlData } = supabase.storage.from('images').getPublicUrl(filePath);
      imageUrl = publicUrlData.publicUrl;
    }

    const tagsArray = values.tagsKeys ? values.tagsKeys.split(',').map(tag => tag.trim()).filter(tag => tag !== '') : [];

    const { error: insertError } = await supabase
      .from('blog_posts')
      .insert({
        title_key: values.titleKey,
        excerpt_key: values.excerptKey,
        created_at: new Date().toISOString(),
        image_url: imageUrl,
        category_key: values.categoryKey,
        author_key: values.authorKey,
        tags_keys: tagsArray,
        content_key: values.content, // Directly use values.content
        pdf_link: values.pdfLink || null,
      });

    if (insertError) {
      console.error("Error inserting blog post:", insertError);
      toast.error(t("blog post.post upload failed", { error: insertError.message }));
    } else {
      toast.success(t("blog post.post uploaded successfully"));
      form.reset();
      const fileInput = document.getElementById("imageFile") as HTMLInputElement;
      if (fileInput) fileInput.value = "";
    }
    setUploading(false);
  };

  if (loading || (!session && !loading) || (session && profile?.role !== 'admin')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-foreground">{t('loading')}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <section className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary">{t('upload blog post title')}</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          {t('upload blog post subtitle')}
        </p>
      </section>

      <Card className="max-w-3xl mx-auto p-6 md:p-8 shadow-lg">
        <CardHeader className="text-center pb-6">
          <CardTitle className="text-2xl font-bold mb-2">{t('add new blog post')}</CardTitle>
          <CardDescription className="text-muted-foreground">
            {t('fill form to upload blog post')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="titleKey"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("blog post.title key label")}</FormLabel>
                    <FormControl>
                      <Input placeholder={t("blog post.title key placeholder")} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="excerptKey"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("blog post.excerpt key label")}</FormLabel>
                    <FormControl>
                      <Textarea placeholder={t("blog post.excerpt key placeholder")} className="min-h-[80px]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="imageFile"
                render={({ field: { value, onChange, ...fieldProps } }) => (
                  <FormItem>
                    <FormLabel>{t("blog post.image label")}</FormLabel>
                    <FormControl>
                      <Input
                        {...fieldProps}
                        id="imageFile"
                        type="file"
                        accept="image/*"
                        onChange={(event) => {
                          onChange(event.target.files);
                        }}
                      />
                    </FormControl>
                    {value && value[0] && (
                      <p className="text-sm text-muted-foreground mt-2">
                        {t('blog post.selected file')}: {value[0].name}
                      </p>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="categoryKey"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("blog post.category label")}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t("blog post.category placeholder")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {blogCategories.map(category => (
                          <SelectItem key={category} value={category}>
                            {t(category)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="authorKey"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("blog post.author label")}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t("blog post.author placeholder")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {blogAuthors.map(author => (
                          <SelectItem key={author} value={author}>
                            {t(author)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tagsKeys"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("blog post.tags label")}</FormLabel>
                    <FormControl>
                      <Input placeholder={t("blog post.tags placeholder")} {...field} />
                    </FormControl>
                    <FormDescription>
                      {t("blog post.tags description")}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="content" // Changed from contentKey
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("blog post.content label")}</FormLabel> {/* Updated label */}
                    <FormControl>
                      <Textarea placeholder={t("blog post.content placeholder")} className="min-h-[200px]" {...field} /> {/* Updated placeholder */}
                    </FormControl>
                    <FormDescription>
                      {t("blog post.content description")} {/* Updated description */}
                      <br />
                      <span className="text-sm text-yellow-600">
                        {t("blog post.content html tip")}
                      </span>
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="pdfLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("blog post.pdf link label")}</FormLabel>
                    <FormControl>
                      <Input type="url" placeholder={t("blog post.pdf link placeholder")} {...field} />
                    </FormControl>
                    <FormDescription>
                      {t("blog post.pdf link description")}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={uploading}>
                {uploading ? t('blog post.uploading') : t('blog post.submit button')}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <div className="text-center mt-12">
        <Link to="/">
          <Button>{t('back to home')}</Button>
        </Link>
      </div>
    </div>
  );
};

export default UploadBlogPost;