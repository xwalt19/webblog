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
    titleKey: "blog_posts.post1_title",
    date: "10 Oktober 2023",
    contentKey: "blog_posts.post1_content",
    tagsKeys: ["blog_posts.post1_tags.0", "blog_posts.post1_tags.1", "blog_posts.post1_tags.2"],
  },
  {
    id: "2",
    titleKey: "blog_posts.post2_title",
    date: "15 November 2023",
    contentKey: "blog_posts.post2_content",
    tagsKeys: ["blog_posts.post2_tags.0", "blog_posts.post2_tags.1", "blog_posts.post2_tags.2"],
  },
  {
    id: "3",
    titleKey: "blog_posts.post3_title",
    date: "20 Desember 2023",
    contentKey: "blog_posts.post3_content",
    tagsKeys: ["blog_posts.post3_tags.0", "blog_posts.post3_tags.1", "blog_posts.post3_tags.2"],
  },
  {
    id: "4",
    titleKey: "blog_posts.post4_title",
    date: "25 Januari 2024",
    contentKey: "blog_posts.post4_content",
    tagsKeys: ["blog_posts.post4_tags.0", "blog_posts.post4_tags.1", "blog_posts.post4_tags.2"],
  },
  {
    id: "5",
    titleKey: "blog_posts.post5_title",
    date: "01 Februari 2024",
    contentKey: "blog_posts.post5_content",
    tagsKeys: ["blog_posts.post5_tags.0", "blog_posts.post5_tags.1", "blog_posts.post5_tags.2"],
  },
  {
    id: "6",
    titleKey: "blog_posts.post6_title",
    date: "10 Februari 2024",
    contentKey: "blog_posts.post6_content",
    tagsKeys: ["blog_posts.post6_tags.0", "blog_posts.post6_tags.1", "blog_posts.post6_tags.2"],
  },
  {
    id: "7",
    titleKey: "blog_posts.post7_title",
    date: "05 Maret 2024",
    contentKey: "blog_posts.post7_content",
    tagsKeys: ["blog_posts.post7_tags.0", "blog_posts.post7_tags.1", "blog_posts.post7_tags.2"],
  },
  {
    id: "8",
    titleKey: "blog_posts.post8_title",
    date: "12 April 2024",
    contentKey: "blog_posts.post8_content",
    tagsKeys: ["blog_posts.post8_tags.0", "blog_posts.post8_tags.1", "blog_posts.post8_tags.2"],
  },
  {
    id: "9",
    titleKey: "blog_posts.post9_title",
    date: "20 Mei 2025",
    contentKey: "blog_posts.post9_content",
    tagsKeys: ["blog_posts.post9_tags.0", "blog_posts.post9_tags.1", "blog_posts.post9_tags.2"],
  },
];

const PostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const post = dummyPosts.find((p) => p.id === id);

  if (!post) {
    return (
      <div className="text-center py-10">
        <h2 className="text-3xl font-bold mb-4">{t('post_not_found_title')}</h2>
        <p className="text-lg text-muted-foreground mb-6">{t('post_not_found_message')}</p>
        <Link to="/">
          <Button>{t('return_to_home')}</Button>
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
            <Button variant="outline">{t('return_to_post_list')}</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default PostDetail;