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
    titleKey: "blogposts.post1title",
    date: "10 Oktober 2023",
    contentKey: "blogposts.post1content",
    tagsKeys: ["blogposts.post1tags0", "blogposts.post1tags1", "blogposts.post1tags2"],
  },
  {
    id: "2",
    titleKey: "blogposts.post2title",
    date: "15 November 2023",
    contentKey: "blogposts.post2content",
    tagsKeys: ["blogposts.post2tags0", "blogposts.post2tags1", "blogposts.post2tags2"],
  },
  {
    id: "3",
    titleKey: "blogposts.post3title",
    date: "20 Desember 2023",
    contentKey: "blogposts.post3content",
    tagsKeys: ["blogposts.post3tags0", "blogposts.post3tags1", "blogposts.post3tags2"],
  },
  {
    id: "4",
    titleKey: "blogposts.post4title",
    date: "25 Januari 2024",
    contentKey: "blogposts.post4content",
    tagsKeys: ["blogposts.post4tags0", "blogposts.post4tags1", "blogposts.post4tags2"],
  },
  {
    id: "5",
    titleKey: "blogposts.post5title",
    date: "01 Februari 2024",
    contentKey: "blogposts.post5content",
    tagsKeys: ["blogposts.post5tags0", "blogposts.post5tags1", "blogposts.post5tags2"],
  },
  {
    id: "6",
    titleKey: "blogposts.post6title",
    date: "10 Februari 2024",
    contentKey: "blogposts.post6content",
    tagsKeys: ["blogposts.post6tags0", "blogposts.post6tags1", "blogposts.post6tags2"],
  },
  {
    id: "7",
    titleKey: "blogposts.post7title",
    date: "05 Maret 2024",
    contentKey: "blogposts.post7content",
    tagsKeys: ["blogposts.post7tags0", "blogposts.post7tags1", "blogposts.post7tags2"],
  },
  {
    id: "8",
    titleKey: "blogposts.post8title",
    date: "12 April 2024",
    contentKey: "blogposts.post8content",
    tagsKeys: ["blogposts.post8tags0", "blogposts.post8tags1", "blogposts.post8tags2"],
  },
  {
    id: "9",
    titleKey: "blogposts.post9title",
    date: "20 Mei 2025",
    contentKey: "blogposts.post9content",
    tagsKeys: ["blogposts.post9tags0", "blogposts.post9tags1", "blogposts.post9tags2"],
  },
];

const PostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const post = dummyPosts.find((p) => p.id === id);

  if (!post) {
    return (
      <div className="text-center py-10">
        <h2 className="text-3xl font-bold mb-4">{t('postnotfoundtitle')}</h2>
        <p className="text-lg text-muted-foreground mb-6">{t('postnotfoundmessage')}</p>
        <Link to="/">
          <Button>{t('returntohome')}</Button>
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
            <Button variant="outline">{t('returntopostlist')}</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default PostDetail;