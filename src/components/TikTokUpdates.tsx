import React, { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlayCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useTranslation } from "react-i18next";

interface TikTokVideo {
  id: string;
  titleKey: string;
  descriptionKey: string;
  thumbnail: string;
  videoUrl: string;
  date: string;
}

const dummyTikTokVideos: TikTokVideo[] = [
  {
    id: "tk1",
    titleKey: "tiktok_videos.tk1_title",
    descriptionKey: "tiktok_videos.tk1_desc",
    thumbnail: "https://source.unsplash.com/random/400x250/?coding,tips",
    videoUrl: "https://www.tiktok.com/@procodecg/video/1234567890",
    date: "2024-03-10", // Changed to YYYY-MM-DD for easier Date object creation
  },
  {
    id: "tk2",
    titleKey: "tiktok_videos.tk2_title",
    descriptionKey: "tiktok_videos.tk2_desc",
    thumbnail: "https://source.unsplash.com/random/400x250/?challenge,code",
    videoUrl: "https://www.tiktok.com/@procodecg/video/0987654321",
    date: "2024-03-18",
  },
  {
    id: "tk3",
    titleKey: "tiktok_videos.tk3_title",
    descriptionKey: "tiktok_videos.tk3_desc",
    thumbnail: "https://source.unsplash.com/random/400x250/?kids,coding",
    videoUrl: "https://www.tiktok.com/@procodecg/video/1122334455",
    date: "2024-03-25",
  },
  {
    id: "tk4",
    titleKey: "tiktok_videos.tk4_title",
    descriptionKey: "tiktok_videos.tk4_desc",
    thumbnail: "https://source.unsplash.com/random/400x250/?html,webdev",
    videoUrl: "https://www.tiktok.com/@procodecg/video/1122334456",
    date: "2024-04-01",
  },
  {
    id: "tk5",
    titleKey: "tiktok_videos.tk5_title",
    descriptionKey: "tiktok_videos.tk5_desc",
    thumbnail: "https://source.unsplash.com/random/400x250/?css,layout",
    videoUrl: "https://www.tiktok.com/@procodecg/video/1122334457",
    date: "2024-04-08",
  },
  {
    id: "tk6",
    titleKey: "tiktok_videos.tk6_title",
    descriptionKey: "tiktok_videos.tk6_desc",
    thumbnail: "https://source.unsplash.com/random/400x250/?javascript,array",
    videoUrl: "https://www.tiktok.com/@procodecg/video/1122334458",
    date: "2024-04-15",
  },
  {
    id: "tk7",
    titleKey: "tiktok_videos.tk7_title",
    descriptionKey: "tiktok_videos.tk7_desc",
    thumbnail: "https://source.unsplash.com/random/400x250/?react,hooks",
    videoUrl: "https://www.tiktok.com/@procodecg/video/1122334459",
    date: "2024-04-22",
  },
  {
    id: "tk8",
    titleKey: "tiktok_videos.tk8_title",
    descriptionKey: "tiktok_videos.tk8_desc",
    thumbnail: "https://source.unsplash.com/random/400x250/?python,automation",
    videoUrl: "https://www.tiktok.com/@procodecg/video/1122334460",
    date: "2024-04-29",
  },
  {
    id: "tk9",
    titleKey: "tiktok_videos.tk9_title",
    descriptionKey: "tiktok_videos.tk9_desc",
    thumbnail: "https://source.unsplash.com/random/400x250/?git,github",
    videoUrl: "https://www.tiktok.com/@procodecg/video/1122334461",
    date: "2024-05-06",
  },
];

const VIDEOS_PER_PAGE = 6;

const TikTokUpdates: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [videos, setVideos] = useState<TikTokVideo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchTikTokVideos = async () => {
      try {
        setLoading(true);
        await new Promise<void>(resolve => setTimeout(resolve, 1000));
        setVideos(dummyTikTokVideos);
      } catch (err) {
        setError(t("failed_to_load_videos"));
        console.error("Error fetching TikTok videos:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTikTokVideos();
  }, []);

  const filteredVideos = useMemo(() => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return videos.filter(video =>
      t(video.titleKey).toLowerCase().includes(lowerCaseSearchTerm) ||
      t(video.descriptionKey).toLowerCase().includes(lowerCaseSearchTerm)
    );
  }, [videos, searchTerm, t, i18n.language]); // Add i18n.language to dependencies

  const totalPages = Math.ceil(filteredVideos.length / VIDEOS_PER_PAGE);
  const currentVideos = useMemo(() => {
    const startIndex = (currentPage - 1) * VIDEOS_PER_PAGE;
    const endIndex = startIndex + VIDEOS_PER_PAGE;
    return filteredVideos.slice(startIndex, endIndex);
  }, [filteredVideos, currentPage, i18n.language]); // Add i18n.language to dependencies

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, i18n.language]); // Add i18n.language to dependencies

  return (
    <section className="py-12 bg-muted/40">
      <div className="container mx-auto px-4">
        <div className="flex justify-center mb-8">
          <Input
            type="text"
            placeholder={t('search_video')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:max-w-lg"
          />
        </div>

        {loading ? (
          <p className="text-center text-muted-foreground">{t('loading_videos')}</p>
        ) : error ? (
          <p className="text-center text-destructive">{error}</p>
        ) : currentVideos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentVideos.map((video) => (
              <Card key={video.id} className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="relative w-full h-48 bg-gray-200 flex items-center justify-center">
                  <img src={video.thumbnail} alt={t(video.titleKey)} className="w-full h-full object-cover" />
                  <PlayCircle className="absolute text-white/80 hover:text-white transition-colors" size={64} />
                </div>
                <CardHeader className="flex-grow">
                  <CardTitle className="text-xl">{t(video.titleKey)}</CardTitle>
                  <CardDescription className="text-sm text-muted-foreground">
                    {new Date(video.date).toLocaleDateString(i18n.language === 'id' ? 'id-ID' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 pt-0">
                  <p className="text-muted-foreground mb-4 line-clamp-2">{t(video.descriptionKey)}</p>
                  <a href={video.videoUrl} target="_blank" rel="noopener noreferrer" className="w-full">
                    <Button variant="outline" className="w-full">{t('view_video')}</Button>
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground mt-8 text-lg">{t('no_matching_videos')}</p>
        )}

        {totalPages > 1 && (
          <Pagination className="mt-12">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(currentPage - 1)}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : undefined}
                />
              </PaginationItem>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    onClick={() => handlePageChange(page)}
                    isActive={currentPage === page}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  onClick={() => handlePageChange(currentPage + 1)}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : undefined}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </section>
  );
};

export default TikTokUpdates;