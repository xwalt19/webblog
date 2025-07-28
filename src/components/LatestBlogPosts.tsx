import React, { useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { dummyBlogPosts, BlogPost } from "@/data/blogPosts";

const LatestBlogPosts: React.FC = () => {
  const { t } = useTranslation();
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start' });
  const [prevBtnDisabled, setPrevBtnDisabled] = React.useState(true);
  const [nextBtnDisabled, setNextBtnDisabled] = React.useState(true);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback((emblaApi: any) => {
    setPrevBtnDisabled(!emblaApi.canScrollPrev());
    setNextBtnDisabled(!emblaApi.canScrollNext());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect(emblaApi);
    emblaApi.on("reInit", onSelect);
    emblaApi.on("select", onSelect);
  }, [emblaApi, onSelect]);

  const allPosts = dummyBlogPosts;

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">{t('latest blog posts title')}</h2>
        <div className="relative">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex -ml-4">
              {allPosts.map((post) => (
                <div key={post.id} className="flex-none w-full sm:w-1/2 lg:w-1/3 pl-4">
                  <Card className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 h-full">
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
                        <Button variant="outline" className="w-full">{t('read more')}</Button>
                      </Link>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
          <Button
            className="absolute top-1/2 left-0 -translate-y-1/2 bg-primary/80 hover:bg-primary text-primary-foreground rounded-full p-2 z-10"
            onClick={scrollPrev}
            disabled={prevBtnDisabled}
            size="icon"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            className="absolute top-1/2 right-0 -translate-y-1/2 bg-primary/80 hover:bg-primary text-primary-foreground rounded-full p-2 z-10"
            onClick={scrollNext}
            disabled={nextBtnDisabled}
            size="icon"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>
        <div className="text-center mt-10">
          <Link to="/blog">
            <Button size="lg" variant="default">{t('read all posts')}</Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default LatestBlogPosts;