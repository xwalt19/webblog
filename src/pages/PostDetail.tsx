import React from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";

interface BlogPost {
  id: string;
  titleKey: string;
  date: string;
  contentKey: string;
  tagsKeys: string[];
}

const dummyPosts: BlogPost[] = [
  {
    id: "1",
    titleKey: "blog posts.post1 title",
    date: "10 Oktober 2023",
    contentKey: "blog posts.post1 content",
    tagsKeys: ["blog posts.post1 tags0", "blog posts.post1 tags1", "blog posts.post1 tags2"],
  },
  {
    id: "2",
    titleKey: "blog posts.post2 title",
    date: "15 November 2023",
    contentKey: "blog posts.post2 content",
    tagsKeys: ["blog posts.post2 tags0", "blog posts.post2 tags1", "blog posts.post2 tags2"],
  },
  {
    id: "3",
    titleKey: "blog posts.post3 title",
    date: "20 Desember 2023",
    contentKey: "blog posts.post3 content",
    tagsKeys: ["blog posts.post3 tags0", "blog posts.post3 tags1", "blog posts.post3 tags2"],
  },
  {
    id: "4",
    titleKey: "blog posts.post4 title",
    date: "25 Januari 2024",
    contentKey: "blog posts.post4 content",
    tagsKeys: ["blog posts.post4 tags0", "blog posts.post4 tags1", "blog posts.post4 tags2"],
  },
  {
    id: "5",
    titleKey: "blog posts.post5 title",
    date: "01 Februari 2024",
    contentKey: "blog posts.post5 content",
    tagsKeys: ["blog posts.post5 tags0", "blog posts.post5 tags1", "blog posts.post5 tags2"],
  },
  {
    id: "6",
    titleKey: "blog posts.post6 title",
    date: "10 Februari 2024",
    contentKey: "blog posts.post6 content",
    tagsKeys: ["blog posts.post6 tags0", "blog posts.post6 tags1", "blog posts.post6 tags2"],
  },
  {
    id: "7",
    titleKey: "blog posts.post7 title",
    date: "05 Maret 2024",
    contentKey: "blog posts.post7 content",
    tagsKeys: ["blog posts.post7 tags0", "blog posts.post7 tags1", "blog posts.post7 tags2"],
  },
  {
    id: "8",
    titleKey: "blog posts.post8 title",
    date: "12 April 2024",
    contentKey: "blog posts.post8 content",
    tagsKeys: ["blog posts.post8 tags0", "blog posts.post8 tags1", "blog posts.post8 tags2"],
  },
  {
    id: "9",
    titleKey: "blog posts.post9 title",
    date: "20 Mei 2025",
    contentKey: "blog posts.post9 content",
    tagsKeys: ["blog posts.post9 tags0", "blog posts.post9 tags1", "blog posts.post9 tags2"],
  },
];

const PostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const post = dummyPosts.find((p) => p.id === id);

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
        <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: t(post.contentKey) }} />
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