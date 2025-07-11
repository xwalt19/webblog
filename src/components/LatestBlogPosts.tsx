import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next"; // Import useTranslation

interface BlogPost {
  id: string;
  titleKey: string;
  excerptKey: string;
  date: string;
  image: string;
  categoryKey: string;
  authorKey: string;
  tagsKeys: string[];
}

const dummyBlogPosts: BlogPost[] = [
  {
    id: "1",
    titleKey: "blog_posts.post1_title",
    excerptKey: "blog_posts.post1_excerpt",
    date: "10 Oktober 2023",
    image: "https://source.unsplash.com/random/400x250/?blogging,writing",
    categoryKey: "blog_posts.post1_category",
    authorKey: "blog_posts.post1_author",
    tagsKeys: ["blog_posts.post1_tags.0", "blog_posts.post1_tags.1", "blog_posts.post1_tags.2"],
  },
  {
    id: "2",
    titleKey: "blog_posts.post2_title",
    excerptKey: "blog_posts.post2_excerpt",
    date: "15 November 2023",
    image: "https://source.unsplash.com/random/400x250/?content,marketing",
    categoryKey: "blog_posts.post2_category",
    authorKey: "blog_posts.post2_author",
    tagsKeys: ["blog_posts.post2_tags.0", "blog_posts.post2_tags.1", "blog_posts.post2_tags.2"],
  },
  {
    id: "3",
    titleKey: "blog_posts.post3_title",
    excerptKey: "blog_posts.post3_excerpt",
    date: "20 Desember 2023",
    image: "https://source.unsplash.com/random/400x250/?seo,optimization",
    categoryKey: "blog_posts.post3_category",
    authorKey: "blog_posts.post3_author",
    tagsKeys: ["blog_posts.post3_tags.0", "blog_posts.post3_tags.1", "blog_posts.post3_tags.2"],
  },
  {
    id: "4",
    titleKey: "blog_posts.post4_title",
    excerptKey: "blog_posts.post4_excerpt",
    date: "25 Januari 2024",
    image: "https://source.unsplash.com/random/400x250/?javascript,code",
    categoryKey: "blog_posts.post4_category",
    authorKey: "blog_posts.post4_author",
    tagsKeys: ["blog_posts.post4_tags.0", "blog_posts.post4_tags.1", "blog_posts.post4_tags.2"],
  },
  {
    id: "5",
    titleKey: "blog_posts.post5_title",
    excerptKey: "blog_posts.post5_excerpt",
    date: "01 Februari 2024",
    image: "https://source.unsplash.com/random/400x250/?reactjs,programming",
    categoryKey: "blog_posts.post5_category",
    authorKey: "blog_posts.post5_author",
    tagsKeys: ["blog_posts.post5_tags.0", "blog_posts.post5_tags.1", "blog_posts.post5_tags.2"],
  },
  {
    id: "6",
    titleKey: "blog_posts.post6_title",
    excerptKey: "blog_posts.post6_excerpt",
    date: "10 Februari 2024",
    image: "https://source.unsplash.com/random/400x250/?python,data",
    categoryKey: "blog_posts.post6_category",
    authorKey: "blog_posts.post6_author",
    tagsKeys: ["blog_posts.post6_tags.0", "blog_posts.post6_tags.1", "blog_posts.post6_tags.2"],
  },
];

const LatestBlogPosts: React.FC = () => {
  const { t } = useTranslation(); // Initialize useTranslation
  const latestPosts = dummyBlogPosts.slice(0, 3);

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">{t('latest_blog_posts_title')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {latestPosts.map((post) => (
            <Card key={post.id} className="flex flex-col overflow-hidden">
              <img src={post.image} alt={t(post.titleKey)} className="w-full h-48 object-cover" />
              <CardHeader className="flex-grow">
                <div className="flex justify-between items-center mb-2">
                  <Badge variant="secondary">{t(post.categoryKey)}</Badge>
                  <span className="text-sm text-muted-foreground">{post.date}</span>
                </div>
                <CardTitle className="text-xl">{t(post.titleKey)}</CardTitle>
                <CardDescription className="text-sm text-muted-foreground">{t('by')} {t(post.authorKey)}</CardDescription>
                <div className="flex flex-wrap gap-1 mt-2">
                  {post.tagsKeys.map(tagKey => (
                    <Badge key={tagKey} variant="outline" className="text-xs">{t(tagKey)}</Badge>
                  ))}
                </div>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <p className="text-muted-foreground mb-4 line-clamp-2">{t(post.excerptKey)}</p>
                <Link to={`/posts/${post.id}`}>
                  <Button variant="outline" className="w-full">{t('read_more')}</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link to="/blog">
            <Button size="lg" variant="default">{t('read_all_posts')}</Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default LatestBlogPosts;