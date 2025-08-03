"use client";

import React, { useEffect, useCallback, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Youtube, Music, ChevronLeft, ChevronRight } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import YouTubeVideoModal from "@/components/YouTubeVideoModal";
import ResponsiveImage from "./ResponsiveImage"; // Import ResponsiveImage

interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnail_url: string;
  video_url: string; 
  published_at: string;
}

interface TikTokVideo {
  id: string;
  title: string;
  description: string;
  thumbnail_url: string;
  video_url: string;
  published_at: string;
}

interface MediaItem {
  id: string;
  title: string;
  description: string;
  thumbnail_url: string;
  url: string;
  date: string; // Use 'date' for sorting consistency
  type: 'youtube' | 'tiktok';
}

const MediaCarousel: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start' });
  const [prevBtnDisabled, setPrevBtnDisabled] = React.useState(true);
  const [nextBtnDisabled, setNextBtnDisabled] = React.useState(true);
  const [allMedia, setAllMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal
  const [selectedVideoForModal, setSelectedVideoForModal] = useState<MediaItem | null>(null); // State for video in modal

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

  useEffect(() => {
    const fetchMedia = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data: youtubeData, error: youtubeError } = await supabase
          .from('youtube_videos')
          .select('*')
          .order('published_at', { ascending: false })
          .limit(7); // Fetch up to 7 latest YouTube videos

        if (youtubeError) throw youtubeError;

        const { data: tiktokData, error: tiktokError } = await supabase
          .from('tiktok_videos')
          .select('*')
          .order('published_at', { ascending: false })
          .limit(7); // Fetch up to 7 latest TikTok videos

        if (tiktokError) throw tiktokError;

        const combined: MediaItem[] = [
          ...(youtubeData || []).map((v: YouTubeVideo) => ({
            id: v.id,
            title: v.title,
            description: v.description,
            thumbnail_url: v.thumbnail_url,
            url: v.video_url,
            date: v.published_at,
            type: 'youtube' as 'youtube'
          })),
          ...(tiktokData || []).map((v: TikTokVideo) => ({
            id: v.id,
            title: v.title,
            description: v.description,
            thumbnail_url: v.thumbnail_url,
            url: v.video_url,
            date: v.published_at,
            type: 'tiktok' as 'tiktok'
          }))
        ];

        // Sort all media by date and take the latest 7
        const sortedMedia = combined.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 7);
        setAllMedia(sortedMedia);

      } catch (err: any) {
        console.error("Error fetching media:", err);
        setError(t("fetch data error", { error: err.message }));
      } finally {
        setLoading(false);
      }
    };

    fetchMedia();
  }, [t]);

  const openVideoInModal = (video: MediaItem) => {
    setSelectedVideoForModal(video);
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <section className="py-12 bg-muted/40">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">{t('latest videos title')}</h2>
          <p className="text-center text-muted-foreground">{t('loading videos')}</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-12 bg-muted/40">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">{t('latest videos title')}</h2>
          <p className="text-center text-destructive">{error}</p>
        </div>
      </section>
    );
  }

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
                    <div className="relative w-full h-48 bg-gray-200 flex items-center justify-center cursor-pointer" onClick={() => item.type === 'youtube' ? openVideoInModal(item) : window.open(item.url, '_blank')}>
                      <ResponsiveImage 
                        src={item.thumbnail_url} 
                        alt={item.title} 
                        containerClassName="w-full h-full absolute inset-0" 
                        className="object-cover" 
                      />
                      {item.type === 'youtube' ? (
                        <Youtube className="absolute text-red-600 hover:text-red-700 transition-colors" size={64} />
                      ) : (
                        <Music className="absolute text-white/80 hover:text-white transition-colors" size={64} />
                      )}
                    </div>
                    <CardHeader className="flex-grow">
                      <CardTitle className="text-xl">{item.title}</CardTitle>
                      <CardDescription className="text-sm text-muted-foreground">
                        {new Date(item.date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })} - {item.type === 'youtube' ? 'YouTube' : 'TikTok'}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6 pt-0">
                      <p className="text-muted-foreground mb-4 line-clamp-2">{item.description}</p>
                      {item.type === 'youtube' ? (
                        <Button variant="outline" className="w-full" onClick={() => openVideoInModal(item)}>
                          {t('view video')}
                        </Button>
                      ) : (
                        <a href={item.url} target="_blank" rel="noopener noreferrer" className="w-full">
                          <Button variant="outline" className="w-full">{t('view video')}</Button>
                        </a>
                      )}
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
      {selectedVideoForModal && selectedVideoForModal.type === 'youtube' && (
        <YouTubeVideoModal
          isOpen={isModalOpen}
          onOpenChange={setIsModalOpen}
          videoUrl={selectedVideoForModal.url}
          title={selectedVideoForModal.title}
        />
      )}
    </section>
  );
};

export default MediaCarousel;