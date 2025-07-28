import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Newspaper } from "lucide-react";
import { useTranslation } from "react-i18next"; // Import useTranslation

interface ExternalArticle {
  id: string;
  titleKey: string;
  sourceKey: string;
  date: string;
  url: string;
  excerptKey: string;
}

// TODO: Replace with data fetched from Supabase
const dummyExternalArticles: ExternalArticle[] = [
  {
    id: "ea1",
    titleKey: "external articles.ea1 title",
    sourceKey: "external articles.ea1 source",
    date: "10 Mei 2024",
    url: "https://www.example.com/tech-trends-2024",
    excerptKey: "external articles.ea1 desc",
  },
  {
    id: "ea2",
    titleKey: "external articles.ea2 title",
    sourceKey: "external articles.ea2 source",
    date: "05 Mei 2024",
    url: "https://www.example.com/coding-for-kids-future",
    excerptKey: "external articles.ea2 desc",
  },
  {
    id: "ea3",
    titleKey: "external articles.ea3 title",
    sourceKey: "external articles.ea3 source",
    date: "01 Mei 2024",
    url: "https://www.example.com/data-science-career-guide",
    excerptKey: "external articles.ea3 desc",
  },
  {
    id: "ea4",
    titleKey: "external articles.ea4 title",
    sourceKey: "external articles.ea4 source",
    date: "28 April 2024",
    url: "https://www.example.com/cybersecurity-threats",
    excerptKey: "external articles.ea4 desc",
  },
];

const ExternalArticlesFeed: React.FC = () => {
  const { t } = useTranslation(); // Initialize useTranslation

  return (
    <section className="py-12 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">{t('external articles title')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {dummyExternalArticles.map((article) => (
            <Card key={article.id} className="flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3 mb-2">
                  <Newspaper className="text-primary" size={28} />
                  <CardTitle className="text-xl font-semibold">{t(article.titleKey)}</CardTitle>
                </div>
                <CardDescription className="text-sm text-muted-foreground">
                  {t(article.sourceKey)} - {article.date}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow p-6 pt-0">
                <p className="text-muted-foreground mb-4 line-clamp-2">{t(article.excerptKey)}</p>
                <a href={article.url} target="_blank" rel="noopener noreferrer" className="w-full">
                  <Button variant="outline" className="w-full">{t('read article')}</Button>
                </a>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link to="/blog">
            <Button size="lg" variant="default">{t('explore more articles')}</Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ExternalArticlesFeed;