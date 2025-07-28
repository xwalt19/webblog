"use client";

import React, { useEffect, useMemo, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Youtube, Music, ChevronLeft, ChevronRight } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import { useTranslation } from "react-i18next";
import { dummyYouTubeVideos, YouTubeVideo } from "@/data/youtubeVideos";
import { dummyTikTokVideos, TikTokVideo } from "@/data/tiktokVideos";

interface MediaItem {
  id: string;
  titleKey: string;
  descriptionKey: string;
  thumbnail: string;
  url: string;
  date: string;
  type: 'youtube' | 'tiktok';
}

const MediaCarousel: React.FC = () => {
  const { t, i18n } = useTranslation();
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

  const allMedia: MediaItem[] = useMemo(() => {
    const combined = [...dummyYouTubeVideos.map(v => ({...v, url: v.videoUrl, type: 'youtube' as 'youtube'})), ...dummyTikTokVideos.map(v => ({...v, url: v.videoUrl, type: 'tiktok' as 'tiktok'}))];
    return combined.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 7);
  }, [i18n.language]);

  if (allMedia.length === 0) {
    return (
      <section className="py-12 bg-muted/40">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">{t('latest videos title')}</h2>
          <p className="text-center text-muted-foreground mt-8 text-lg">{t('no videos available')}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-muted/40">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">{t('latest videos title')}</h2>
        <div className="relative">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex -ml-4">
              {allMedia.map((item) => (
                <div key={item.id} className="flex-none w-full sm:w-1/2 lg:w-1/3 pl-4">
                  <Card className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 h-full">
                    <div className="relative w-full h-48 bg-gray-200 flex items-center justify-center">
                      <img src={item.thumbnail} alt={t(item.titleKey)} className="w-full h-full object-cover" />
                      {item.type === 'youtube' ? (
                        <Youtube className="absolute text-white/80 hover:text-white transition-colors" size={64} />
                      ) : (
                        <Music className="absolute text-white/80 hover:text-white transition-colors" size={64} />
                      )}
                    </div>
                    <CardHeader className="flex-grow">
                      <CardTitle className="text-xl">{t(item.titleKey)}</CardTitle>
                      <CardDescription className="text-sm text-muted-foreground">
                        {new Date(item.date).toLocaleDateString(i18n.language === 'id' ? 'id-ID' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })} - {item.type === 'youtube' ? 'YouTube' : 'TikTok'}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6 pt-0">
                      <p className="text-muted-foreground mb-4 line-clamp-2">{t(item.descriptionKey)}</p>
                      <a href={item.url} target="_blank" rel="noopener noreferrer" className="w-full">
                        <Button variant="outline" className="w-full">{t('view video')}</Button>
                      </a>
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
      </div>
    </section>
  );
};

export default MediaCarousel;