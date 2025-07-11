"use client";

import React, { useEffect, useMemo, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Youtube, Music, ChevronLeft, ChevronRight } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import { useTranslation } from "react-i18next"; // Import useTranslation

interface MediaItem {
  id: string;
  titleKey: string;
  descriptionKey: string;
  thumbnail: string;
  url: string;
  date: string;
  type: 'youtube' | 'tiktok';
}

// Dummy data for YouTube videos
const dummyYouTubeVideos: MediaItem[] = [
  {
    id: "yt1",
    titleKey: "youtube_videos.yt1_title",
    descriptionKey: "youtube_videos.yt1_desc",
    thumbnail: "https://source.unsplash.com/random/400x250/?html,coding",
    url: "https://www.youtube.com/watch?v=M_HTyO_y_0M",
    date: "2024-01-01",
    type: 'youtube',
  },
  {
    id: "yt2",
    titleKey: "youtube_videos.yt2_title",
    descriptionKey: "youtube_videos.yt2_desc",
    thumbnail: "https://source.unsplash.com/random/400x250/?css,design",
    url: "https://www.youtube.com/watch?v=1Rs2ND1ryYc",
    date: "2024-01-15",
    type: 'youtube',
  },
  {
    id: "yt3",
    titleKey: "youtube_videos.yt3_title",
    descriptionKey: "youtube_videos.yt3_desc",
    thumbnail: "https://source.unsplash.com/random/400x250/?javascript,web",
    url: "https://www.youtube.com/watch?v=W6NZfCO5sks",
    date: "2024-02-01",
    type: 'youtube',
  },
  {
    id: "yt4",
    titleKey: "youtube_videos.yt4_title",
    descriptionKey: "youtube_videos.yt4_desc",
    thumbnail: "https://source.unsplash.com/random/400x250/?react,frontend",
    url: "https://www.youtube.com/watch?v=Tn6-PIqc4UM",
    date: "2024-02-10",
    type: 'youtube',
  },
  {
    id: "yt5",
    titleKey: "youtube_videos.yt5_title",
    descriptionKey: "youtube_videos.yt5_desc",
    thumbnail: "https://source.unsplash.com/random/400x250/?python,programming",
    url: "https://www.youtube.com/watch?v=rfscVS0vtbw",
    date: "2024-02-20",
    type: 'youtube',
  },
  {
    id: "yt6",
    titleKey: "youtube_videos.yt6_title",
    descriptionKey: "youtube_videos.yt6_desc",
    thumbnail: "https://source.unsplash.com/random/400x250/?tailwind,responsive",
    url: "https://www.youtube.com/watch?v=z_g_y_2_2_2",
    date: "2024-03-05",
    type: 'youtube',
  },
  {
    id: "yt7",
    titleKey: "youtube_videos.yt7_title",
    descriptionKey: "youtube_videos.yt7_desc",
    thumbnail: "https://source.unsplash.com/random/400x250/?algorithm,datastructure",
    url: "https://www.youtube.com/watch?v=BBpAmxU_NQ8",
    date: "2024-03-15",
    type: 'youtube',
  },
  {
    id: "yt8",
    titleKey: "youtube_videos.yt8_title",
    descriptionKey: "youtube_videos.yt8_desc",
    thumbnail: "https://source.unsplash.com/random/400x250/?debugging,javascript",
    url: "https://www.youtube.com/watch?v=gS_Y4_2_2_2",
    date: "2024-03-25",
    type: 'youtube',
  },
  {
    id: "yt9",
    titleKey: "youtube_videos.yt9_title",
    descriptionKey: "youtube_videos.yt9_desc",
    thumbnail: "https://source.unsplash.com/random/400x250/?css,animation",
    url: "https://www.youtube.com/watch?v=z_g_y_2_2_2",
    date: "2024-04-05",
    type: 'youtube',
  },
];

// Dummy data for TikTok videos
const dummyTikTokVideos: MediaItem[] = [
  {
    id: "tk1",
    titleKey: "tiktok_videos.tk1_title",
    descriptionKey: "tiktok_videos.tk1_desc",
    thumbnail: "https://source.unsplash.com/random/400x250/?coding,tips",
    url: "https://www.tiktok.com/@procodecg/video/1234567890",
    date: "2024-03-10",
    type: 'tiktok',
  },
  {
    id: "tk2",
    titleKey: "tiktok_videos.tk2_title",
    descriptionKey: "tiktok_videos.tk2_desc",
    thumbnail: "https://source.unsplash.com/random/400x250/?challenge,code",
    url: "https://www.tiktok.com/@procodecg/video/0987654321",
    date: "2024-03-18",
    type: 'tiktok',
  },
  {
    id: "tk3",
    titleKey: "tiktok_videos.tk3_title",
    descriptionKey: "tiktok_videos.tk3_desc",
    thumbnail: "https://source.unsplash.com/random/400x250/?kids,coding",
    url: "https://www.tiktok.com/@procodecg/video/1122334455",
    date: "2024-03-25",
    type: 'tiktok',
  },
  {
    id: "tk4",
    titleKey: "tiktok_videos.tk4_title",
    descriptionKey: "tiktok_videos.tk4_desc",
    thumbnail: "https://source.unsplash.com/random/400x250/?html,webdev",
    url: "https://www.tiktok.com/@procodecg/video/1122334456",
    date: "2024-04-01",
    type: 'tiktok',
  },
  {
    id: "tk5",
    titleKey: "tiktok_videos.tk5_title",
    descriptionKey: "tiktok_videos.tk5_desc",
    thumbnail: "https://source.unsplash.com/random/400x250/?css,layout",
    url: "https://www.tiktok.com/@procodecg/video/1122334457",
    date: "2024-04-08",
    type: 'tiktok',
  },
  {
    id: "tk6",
    titleKey: "tiktok_videos.tk6_title",
    descriptionKey: "tiktok_videos.tk6_desc",
    thumbnail: "https://source.unsplash.com/random/400x250/?javascript,array",
    url: "https://www.tiktok.com/@procodecg/video/1122334458",
    date: "2024-04-15",
    type: 'tiktok',
  },
  {
    id: "tk7",
    titleKey: "tiktok_videos.tk7_title",
    descriptionKey: "tiktok_videos.tk7_desc",
    thumbnail: "https://source.unsplash.com/random/400x250/?react,hooks",
    url: "https://www.tiktok.com/@procodecg/video/1122334459",
    date: "2024-04-22",
    type: 'tiktok',
  },
  {
    id: "tk8",
    titleKey: "tiktok_videos.tk8_title",
    descriptionKey: "tiktok_videos.tk8_desc",
    thumbnail: "https://source.unsplash.com/random/400x250/?python,automation",
    url: "https://www.tiktok.com/@procodecg/video/1122334460",
    date: "2024-04-29",
    type: 'tiktok',
  },
  {
    id: "tk9",
    titleKey: "tiktok_videos.tk9_title",
    descriptionKey: "tiktok_videos.tk9_desc",
    thumbnail: "https://source.unsplash.com/random/400x250/?git,github",
    url: "https://www.tiktok.com/@procodecg/video/1122334461",
    date: "2024-05-06",
    type: 'tiktok',
  },
];

const MediaCarousel: React.FC = () => {
  const { t } = useTranslation(); // Initialize useTranslation
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
    const combined = [...dummyYouTubeVideos, ...dummyTikTokVideos];
    return combined.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 7);
  }, []);

  if (allMedia.length === 0) {
    return (
      <section className="py-12 bg-muted/40">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">{t('latest_videos_title')}</h2>
          <p className="text-center text-muted-foreground mt-8 text-lg">{t('no_videos_available')}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-muted/40">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">{t('latest_videos_title')}</h2>
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
                        {new Date(item.date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })} - {item.type === 'youtube' ? 'YouTube' : 'TikTok'}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6 pt-0">
                      <p className="text-muted-foreground mb-4 line-clamp-2">{t(item.descriptionKey)}</p>
                      <a href={item.url} target="_blank" rel="noopener noreferrer" className="w-full">
                        <Button variant="outline" className="w-full">{t('view_video')}</Button>
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