import React from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";
import { dummyBlogPosts, BlogPost } from "@/data/blogPosts";

const PostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const post = dummyBlogPosts.find((p) => p.id === id);

  if (!post) {
    return (
      <div className="text-center py-10">
        <h2 className="text-3xl font-bold mb-4">{t('post not found title')}</h2>
        <p className="text-lg text-muted-foreground mb-6">{t('post not found message')}</p>
        <Link to="/">
          <Button>{t('return to home')}</Button>
        </Link>
      </div>
    );
  }

  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-3xl font-bold">{t(post.titleKey)}</CardTitle>
        <p className="text-sm text-muted-foreground">{post.date}</p>
        <div className="flex flex-wrap gap-1 mt-2">
          {post.tagsKeys.map(tagKey => (
            <Badge key={tagKey} variant="outline" className="text-xs">{t(tagKey)}</Badge>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: t(post.contentKey || '') }} />
        <div className="mt-8">
          <Link to="/blog">
            <Button variant="outline">{t('return to post list')}</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default PostDetail;