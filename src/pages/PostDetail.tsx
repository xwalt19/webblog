import React from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { useTranslatedTag } from "@/utils/i18nUtils";
import ResponsiveImage from "@/components/ResponsiveImage";
import { formatDisplayDateTime } from "@/utils/dateUtils";
import { useQuery } from "@tanstack/react-query";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  created_at: string;
  image_url: string;
  category: string;
  author: string;
  tags: string[];
  content?: string;
  pdf_link?: string;
}

const PostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const { getTranslatedTag } = useTranslatedTag();

  const { data: post, isLoading, isError, error } = useQuery<BlogPost, Error>({
    queryKey: ['blogPostDetail', id],
    queryFn: async () => {
      if (!id) throw new Error("Post ID is missing.");
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        throw error;
      }
      if (!data) {
        throw new Error(t('post not found message'));
      }
      return data;
    },
    enabled: !!id, // Only fetch if ID is available
    staleTime: 5 * 60 * 1000, // Data considered fresh for 5 minutes
  });

  if (isLoading) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">{t('loading post')}</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-10">
        <h2 className="text-3xl font-bold mb-4">{t('error')}</h2>
        <p className="text-lg text-destructive mb-6">{error?.message}</p>
        <Link to="/blog">
          <Button>{t('return to post list')}</Button>
        </Link>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-center py-10">
        <h2 className="text-3xl font-bold mb-4">{t('post not found title')}</h2>
        <p className="text-lg text-muted-foreground mb-6">{t('post not found message')}</p>
        <Link to="/blog">
          <Button>{t('return to post list')}</Button>
        </Link>
      </div>
    );
  }

  return (
    <Card className="max-w-3xl mx-auto">
      <>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">{post.title}</CardTitle>
          <p className="text-sm text-muted-foreground">{post.created_at ? formatDisplayDateTime(post.created_at) : ''}</p>
          <div className="flex flex-wrap gap-1 mt-2">
            {post.tags?.map(tag => (
              <Badge key={tag} variant="outline" className="text-xs">{getTranslatedTag(tag)}</Badge>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          <div>
            {post.image_url && (
              <div className="relative w-full h-auto max-h-96 overflow-hidden mb-6 rounded-md">
                <ResponsiveImage 
                  src={post.image_url} 
                  alt={post.title} 
                  containerClassName="w-full h-full" 
                  className="object-cover" 
                />
              </div>
            )}
            <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: post.content || '' }} />
            <div className="mt-8">
              <Link to="/blog">
                <Button variant="outline">{t('return to post list')}</Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </>
    </Card>
  );
};

export default PostDetail;