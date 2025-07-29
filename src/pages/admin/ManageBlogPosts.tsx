"use client";

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/components/SessionProvider";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Trash, PlusCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string | null;
  created_at: string;
  image_url: string | null;
  category: string | null;
  author: string | null;
  tags: string[] | null;
  pdf_link: string | null; // To filter out archives
}

const ManageBlogPosts: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { session, profile, loading: sessionLoading } = useSession();
  const isAdmin = profile?.role === 'admin';

  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionLoading) {
      if (!session) {
        toast.error(t('auth.login_required'));
        navigate('/login');
      } else if (!isAdmin) {
        toast.error(t('auth.admin_required'));
        navigate('/');
      } else {
        fetchBlogPosts();
      }
    }
  }, [session, isAdmin, sessionLoading, navigate, t]);

  const fetchBlogPosts = async () => {
    setDataLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .is('pdf_link', null) // Only fetch actual blog posts (no PDF link)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }
      setBlogPosts(data || []);
    } catch (err: any) {
      console.error("Error fetching blog posts:", err);
      setError(t("message.fetch_error", { error: err.message }));
    } finally {
      setDataLoading(false);
    }
  };

  const handleDelete = async (id: string, imageUrl: string | null) => {
    if (!window.confirm(t("admin.blog_post.confirm_delete"))) {
      return;
    }
    try {
      // Optionally delete the image file from storage if it exists
      if (imageUrl) {
        const filePath = imageUrl.split('/storage/v1/object/public/images/')[1];
        if (filePath) {
          const { error: storageError } = await supabase.storage.from('images').remove([filePath]);
          if (storageError) {
            console.warn("Error deleting image from storage:", storageError);
            toast.warning(t("message.storage_delete_warning", { error: storageError.message }));
          }
        }
      }

      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }
      toast.success(t("success.deleted"));
      fetchBlogPosts(); // Refresh the list
    } catch (err: any) {
      console.error("Error deleting post:", err);
      toast.error(t("message.delete_error", { error: err.message }));
    }
  };

  const formatDisplayDate = (isoString: string) => {
    const dateObj = new Date(isoString);
    return dateObj.toLocaleDateString(i18n.language === 'id' ? 'id-ID' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (sessionLoading || (!session && !sessionLoading) || (session && !isAdmin)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-foreground">{t('status.loading')}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <section className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary">{t('admin.blog_post.title')}</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          {t('admin.blog_post.subtitle')}
        </p>
      </section>

      <div className="flex justify-end mb-6">
        <Link to="/admin/blog-posts/new">
          <Button>
            <PlusCircle className="h-4 w-4 mr-2" /> {t('admin.blog_post.add_new')}
          </Button>
        </Link>
      </div>

      {dataLoading ? (
        <p className="text-center text-muted-foreground">{t('status.loading')}</p>
      ) : error ? (
        <p className="text-center text-destructive">{error}</p>
      ) : blogPosts.length > 0 ? (
        <Card className="shadow-lg">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('admin.blog_post.table.title')}</TableHead>
                  <TableHead>{t('admin.blog_post.table.category')}</TableHead>
                  <TableHead>{t('admin.blog_post.table.author')}</TableHead>
                  <TableHead>{t('admin.blog_post.table.date')}</TableHead>
                  <TableHead className="text-right">{t('admin.blog_post.table.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {blogPosts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell className="font-medium">{post.title}</TableCell>
                    <TableCell>{post.category}</TableCell>
                    <TableCell>{post.author}</TableCell>
                    <TableCell>{formatDisplayDate(post.created_at)}</TableCell>
                    <TableCell className="text-right">
                      <Link to={`/admin/blog-posts/${post.id}/edit`}>
                        <Button variant="ghost" size="icon" className="mr-2">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button variant="destructive" size="icon" onClick={() => handleDelete(post.id, post.image_url)}>
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
        <p className="text-center text-muted-foreground mt-8 text-lg">{t('admin.blog_post.no_posts')}</p>
      )}

      <div className="text-center mt-12">
        <Link to="/">
          <Button>{t('button.back_to_list')}</Button>
        </Link>
      </div>
    </div>
  );
};

export default ManageBlogPosts;