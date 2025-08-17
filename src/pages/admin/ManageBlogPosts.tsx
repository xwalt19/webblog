"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { useTranslation }
from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/components/SessionProvider";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Trash, PlusCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useTranslatedTag, cleanTagForStorage } from "@/utils/i18nUtils";
import ResponsiveImage from "@/components/ResponsiveImage";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAdminPageLogic } from "@/hooks/use-admin-page-logic";
import { formatDisplayDateTime } from "@/utils/dateUtils"; // Import from dateUtils

interface BlogPost {
  id: string;
  title: string;
  excerpt: string | null;
  created_at: string;
  image_url: string | null;
  category: string | null;
  author: string | null;
  tags: string[] | null;
  pdf_link: string | null;
}

const POSTS_PER_PAGE = 10;

const ManageBlogPosts: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { getTranslatedTag } = useTranslatedTag();
  const navigate = useNavigate();
  const { session } = useSession();
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedTag, setSelectedTag] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const [shouldFetchData, setShouldFetchData] = useState(false);

  const { isLoadingAuth, isAuthenticatedAndAuthorized } = useAdminPageLogic({
    isAdminRequired: true,
    onAuthSuccess: () => setShouldFetchData(true),
  });

  const { data: allCategories = [], isLoading: isCategoriesLoading, isError: isCategoriesError, error: categoriesError } = useQuery<string[], Error>({
    queryKey: ['blogCategories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_categories')
        .select('name')
        .order('name', { ascending: true });
      
      if (error) throw error;
      return ["all", ...data.map(cat => cat.name)];
    },
    enabled: shouldFetchData,
    staleTime: Infinity,
  });

  const { data: blogPostsData, isLoading: isBlogPostsLoading, isError: isBlogPostsError, error: blogPostsError } = useQuery<{ posts: BlogPost[], count: number }, Error>({
    queryKey: ['blogPosts', searchTerm, selectedCategory, selectedTag, currentPage],
    queryFn: async () => {
      let query = supabase
        .from('blog_posts')
        .select('*', { count: 'exact' })
        .is('pdf_link', null);

      if (searchTerm) {
        query = query.or(`title.ilike.%${searchTerm}%,excerpt.ilike.%${searchTerm}%`);
      }
      if (selectedCategory !== 'all') {
        query = query.eq('category', selectedCategory);
      }
      if (selectedTag !== 'all') {
        query = query.contains('tags', [selectedTag]);
      }

      const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
      const endIndex = startIndex + POSTS_PER_PAGE - 1;

      const { data, error, count } = await query
        .order('created_at', { ascending: false })
        .range(startIndex, endIndex);

      if (error) {
        throw error;
      }
      return { posts: data || [], count: count || 0 };
    },
    enabled: shouldFetchData,
    placeholderData: (previousData) => previousData,
  });

  const blogPosts = blogPostsData?.posts || [];
  const totalPostsCount = blogPostsData?.count || 0;

  const { data: allPossibleTags = [] } = useQuery<string[], Error>({
    queryKey: ['all_tags_blog_posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('tags')
        .is('pdf_link', null);
      
      if (error) throw error;

      const uniqueTags = new Set<string>();
      data.forEach(post => {
        post.tags?.forEach((tag: string) => uniqueTags.add(cleanTagForStorage(tag)));
      });
      return ["all", ...Array.from(uniqueTags).sort()]; // Add "all" option here
    },
    enabled: shouldFetchData,
  });

  const deleteBlogPostMutation = useMutation<void, Error, { id: string, imageUrl: string | null }>({
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

      if (imageUrl) {
        await deleteFileFromStorage(imageUrl, 'images');
      }

      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
      queryClient.invalidateQueries({ queryKey: ['all_tags_blog_posts'] });
      toast.success(t("deleted successfully"));
    },
    onError: (err) => {
      console.error("Error deleting post:", err);
      toast.error(t("delete error", { error: err.message }));
    },
  });

  useEffect(() => {
    if (!isAuthenticatedAndAuthorized) {
      return;
    }

    const channel = supabase
      .channel('blog_posts_admin_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'blog_posts' },
        (payload) => {
          if ((payload.new as BlogPost)?.pdf_link === null || (payload.old as BlogPost)?.pdf_link === null) {
            queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
            queryClient.invalidateQueries({ queryKey: ['all_tags_blog_posts'] });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isAuthenticatedAndAuthorized, queryClient]);

  const handleDelete = (id: string, imageUrl: string | null) => {
    if (!window.confirm(t("confirm delete blog post"))) {
      return;
    }
    deleteBlogPostMutation.mutate({ id, imageUrl });
  };

  const totalPages = Math.ceil(totalPostsCount / POSTS_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

  if (isBlogPostsLoading || isCategoriesLoading) {
    return (
      <div className="container mx-auto py-10 px-4">
        <p className="text-center text-muted-foreground">{t('loading status')}</p>
      </div>
    );
  }

  if (isBlogPostsError) {
    return (
      <div className="container mx-auto py-10 px-4">
        <p className="text-center text-destructive">{t("fetch data error", { error: blogPostsError?.message })}</p>
      </div>
    );
  }

  if (isCategoriesError) {
    return (
      <div className="container mx-auto py-10 px-4">
        <p className="text-center text-destructive">{t("fetch data error", { error: categoriesError?.message })}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <section className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary capitalize">{t('blog posts')}</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          {t('manage blog posts subtitle')}
        </p>
      </section>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <Input
          type="text"
          placeholder={t('search post placeholder')}
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full md:max-w-xs"
        />

        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <Select
            value={selectedCategory}
            onValueChange={(value) => {
              setSelectedCategory(value);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder={t('select category placeholder')} />
            </SelectTrigger>
            <SelectContent>
              {allCategories.map(category => (
                <SelectItem key={category} value={category}>
                  {category === "all" ? t("all categories") : category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={selectedTag}
            onValueChange={(value) => {
              setSelectedTag(value);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder={t('tag placeholder')} />
            </SelectTrigger>
            <SelectContent>
              {allPossibleTags.map(tag => (
                <SelectItem key={tag} value={tag}>
                  {tag === "all" ? t("all tags") : getTranslatedTag(tag)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Link to="/admin/blog-posts/new">
          <Button className="w-full md:w-auto mt-4 md:mt-0">
            <PlusCircle className="h-4 w-4 mr-2" /> {t('add new blog post')}
          </Button>
        </Link>
      </div>

      {blogPosts.length > 0 ? (
        <Card className="shadow-lg">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('table title')}</TableHead>
                  <TableHead>{t('table category')}</TableHead>
                  <TableHead>{t('author label')}</TableHead>
                  <TableHead>{t('table date')}</TableHead>
                  <TableHead className="text-right">{t('table actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {blogPosts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell className="font-medium">{post.title}</TableCell>
                    <TableCell>{post.category}</TableCell>
                    <TableCell>{post.author}</TableCell>
                    <TableCell>{formatDisplayDateTime(post.created_at)}</TableCell>
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
        <p className="text-center text-muted-foreground mt-8 text-lg">{t('no posts available')}</p>
      )}

      {isBlogPostsLoading && blogPosts.length > 0 && (
        <p className="text-center text-muted-foreground mt-4">{t('updating data')}</p>
      )}

      {totalPages > 1 && (
        <Pagination className="mt-12">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => handlePageChange(currentPage - 1)}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : undefined}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  onClick={() => handlePageChange(page)}
                  isActive={currentPage === page}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={() => handlePageChange(currentPage + 1)}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : undefined}
                />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      <div className="text-center mt-12">
        <Link to="/">
          <Button>{t('back to list button')}</Button>
        </Link>
      </div>
    </div>
  );
};

export default ManageBlogPosts;