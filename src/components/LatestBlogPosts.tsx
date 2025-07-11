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
    titleKey: "blogposts.post1title",
    excerptKey: "blogposts.post1excerpt",
    date: "10 Oktober 2023",
    image: "https://source.unsplash.com/random/400x250/?blogging,writing",
    categoryKey: "blogposts.post1category",
    authorKey: "blogposts.post1author",
    tagsKeys: ["blogposts.post1tags0", "blogposts.post1tags1", "blogposts.post1tags2"],
  },
  {
    id: "2",
    titleKey: "blogposts.post2title",
    excerptKey: "blogposts.post2excerpt",
    date: "15 November 2023",
    image: "https://source.unsplash.com/random/400x250/?content,marketing",
    categoryKey: "blogposts.post2category",
    authorKey: "blogposts.post2author",
    tagsKeys: ["blogposts.post2tags0", "blogposts.post2tags1", "blogposts.post2tags2"],
  },
  {
    id: "3",
    titleKey: "blogposts.post3title",
    excerptKey: "blogposts.post3excerpt",
    date: "20 Desember 2023",
    image: "https://source.unsplash.com/random/400x250/?seo,optimization",
    categoryKey: "blogposts.post3category",
    authorKey: "blogposts.post3author",
    tagsKeys: ["blogposts.post3tags0", "blogposts.post3tags1", "blogposts.post3tags2"],
  },
  {
    id: "4",
    titleKey: "blogposts.post4title",
    excerptKey: "blogposts.post4excerpt",
    date: "25 Januari 2024",
    image: "https://source.unsplash.com/random/400x250/?javascript,code",
    categoryKey: "blogposts.post4category",
    authorKey: "blogposts.post4author",
    tagsKeys: ["blogposts.post4tags0", "blogposts.post4tags1", "blogposts.post4tags2"],
  },
  {
    id: "5",
    titleKey: "blogposts.post5title",
    excerptKey: "blogposts.post5excerpt",
    date: "01 Februari 2024",
    image: "https://source.unsplash.com/random/400x250/?reactjs,programming",
    categoryKey: "blogposts.post5category",
    authorKey: "blogposts.post5author",
    tagsKeys: ["blogposts.post5tags0", "blogposts.post5tags1", "blogposts.post5tags2"],
  },
  {
    id: "6",
    titleKey: "blogposts.post6title",
    excerptKey: "blogposts.post6excerpt",
    date: "10 Februari 2024",
    image: "https://source.unsplash.com/random/400x250/?python,data",
    categoryKey: "blogposts.post6category",
    authorKey: "blogposts.post6author",
    tagsKeys: ["blogposts.post6tags0", "blogposts.post6tags1", "blogposts.post6tags2"],
  },
];

const LatestBlogPosts: React.FC = () => {
  const { t } = useTranslation(); // Initialize useTranslation
  const latestPosts = dummyBlogPosts.slice(0, 3);

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">{t('latestblogpoststitle')}</h2>
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
                  <Button variant="outline" className="w-full">{t('readmore')}</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link to="/blog">
            <Button size="lg" variant="default">{t('readallposts')}</Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default LatestBlogPosts;