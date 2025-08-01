"use client";

import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { Trash } from "lucide-react"; // Removed Image, FileText, CalendarDays
import { useSession } from "@/components/SessionProvider";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { useTranslatedTag, cleanTagForStorage } from "@/utils/i18nUtils";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string | null;
  image_url: string | null;
  created_at: string;
  category: string;
  author: string;
  tags: string[];
  pdf_link: string | null;
  created_by: string | null; // Add created_by to interface
}

const ContentList: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { getTranslatedTag } = useTranslatedTag();
  const navigate = useNavigate();
  const { session, profile, loading } = useSession();

  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading) {
      if (!session) {
        toast.error(t('login required'));
        navigate('/login');
      } else if (profile?.role !== 'admin') {
        toast.error(t('admin required'));
        navigate('/');
      } else {
        fetchBlogPosts();
      }
    }
  }, [session, profile, loading, navigate, t]);

  const fetchBlogPosts = async () => {
    setDataLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }
      setBlogPosts(data || []);
    } catch (err: any) {
      console.error("Error fetching blog posts:", err);
      setError(t("fetch content error", { error: err.message }));
    } finally {
      setDataLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(t("confirm delete content"))) {
      return;
    }
    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }
      toast.success(t("content deleted successfully"));
      fetchBlogPosts();
    } catch (err: any) {
      console.error("Error deleting post:", err);
      toast.error(t("delete content error", { error: err.message }));
    }
  };

  const formatDateTime = (isoString: string) => {
    const dateObj = new Date(isoString);
    const dateOptions: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    };
    return dateObj.toLocaleDateString(i18n.language === 'id' ? 'id-ID' : 'en-US', dateOptions);
  };

  if (loading || (!session && !loading) || (session && profile?.role !== 'admin')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-foreground">{t('loading status')}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <section className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary">{t('content list title')}</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          {t('content list subtitle')}
        </p>
      </section>

      {dataLoading ? (
        <p className="text-center text-muted-foreground">{t('loading content')}</p>
      ) : error ? (
        <p className="text-center text-destructive">{error}</p>
      ) : blogPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogPosts.map((post) => (
            <Card key={post.id} className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
              {post.image_url && (
                <div className="relative w-full h-48 bg-gray-200 flex items-center justify-center">
                  <img src={post.image_url} alt={post.title} className="w-full h-full object-cover" />
                </div>
              )}
              <CardHeader className="flex-grow">
                <div className="flex justify-between items-center mb-2">
                  <Badge variant="secondary">{post.category}</Badge>
                  <span className="text-sm text-muted-foreground">{formatDateTime(post.created_at)}</span>
                </div>
                <CardTitle className="text-xl">{post.title}</CardTitle>
                <CardDescription className="text-sm text-muted-foreground">{t('by')} {post.author}</CardDescription>
                <div className="flex flex-wrap gap-1 mt-2">
                  {post.tags?.map(tag => (
                    <Badge key={tag} variant="outline" className="text-xs">{getTranslatedTag(tag)}</Badge>
                  ))}
                </div>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <p className="text-muted-foreground mb-4 line-clamp-3">{post.excerpt}</p>
                <div className="flex gap-2">
                  <Link to={`/posts/${post.id}`} className="flex-grow">
                    <Button variant="outline" className="w-full">{t('view details')}</Button>
                  </Link>
                  <Button variant="destructive" onClick={() => handleDelete(post.id)}>
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground mt-8 text-lg">{t('no content found')}</p>
      )}

      <div className="text-center mt-12">
        <Link to="/">
          <Button>{t('return to home')}</Button>
        </Link>
      </div>
    </div>
  );
};

export default ContentList;