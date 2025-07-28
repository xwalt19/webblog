import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Newspaper } from "lucide-react";
import { useTranslation } from "react-i18next";
import { dummyExternalArticles, ExternalArticle } from "@/data/externalArticles";

const ExternalArticlesFeed: React.FC = () => {
  const { t } = useTranslation();

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