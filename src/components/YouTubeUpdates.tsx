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

interface YouTubeVideo {
  id: string;
  titleKey: string;
  descriptionKey: string;
  thumbnail: string;
  videoUrl: string; 
  date: string;
}

const dummyYouTubeVideos: YouTubeVideo[] = [
  {
    id: "yt1",
    titleKey: "youtube videos.yt1 title",
    descriptionKey: "youtube videos.yt1 desc",
    thumbnail: "https://source.unsplash.com/random/400x250/?html,coding",
    videoUrl: "https://www.youtube.com/watch?v=M_HTyO_y_0M", 
    date: "2024-01-01", // Changed to YYYY-MM-DD for easier Date object creation
  },
  {
    id: "yt2",
    titleKey: "youtube videos.yt2 title",
    descriptionKey: "youtube videos.yt2 desc",
    thumbnail: "https://source.unsplash.com/random/400x250/?css,design",
    videoUrl: "https://www.youtube.com/watch?v=1Rs2ND1ryYc", 
    date: "2024-01-15",
  },
  {
    id: "yt3",
    titleKey: "youtube videos.yt3 title",
    descriptionKey: "youtube videos.yt3 desc",
    thumbnail: "https://source.unsplash.com/random/400x250/?javascript,web",
    videoUrl: "https://www.youtube.com/watch?v=W6NZfCO5sks", 
    date: "2024-02-01",
  },
  {
    id: "yt4",
    titleKey: "youtube videos.yt4 title",
    descriptionKey: "youtube videos.yt4 desc",
    thumbnail: "https://source.unsplash.com/random/400x250/?react,frontend",
    videoUrl: "https://www.youtube.com/watch?v=Tn6-PIqc4UM", 
    date: "2024-02-10",
  },
  {
    id: "yt5",
    titleKey: "youtube videos.yt5 title",
    descriptionKey: "youtube videos.yt5 desc",
    thumbnail: "https://source.unsplash.com/random/400x250/?python,programming",
    videoUrl: "https://www.youtube.com/watch?v=rfscVS0vtbw", 
    date: "2024-02-20",
  },
  {
    id: "yt6",
    titleKey: "youtube videos.yt6 title",
    descriptionKey: "youtube videos.yt6 desc",
    thumbnail: "https://source.unsplash.com/random/400x250/?tailwind,responsive",
    videoUrl: "https://www.youtube.com/watch?v=z_g_y_2_2_2", 
    date: "2024-03-05",
  },
  {
    id: "yt7",
    titleKey: "youtube videos.yt7 title",
    descriptionKey: "youtube videos.yt7 desc",
    thumbnail: "https://source.unsplash.com/random/400x250/?algorithm,datastructure",
    videoUrl: "https://www.youtube.com/watch?v=BBpAmxU_NQ8", 
    date: "2024-03-15",
  },
  {
    id: "yt8",
    titleKey: "youtube videos.yt8 title",
    descriptionKey: "youtube videos.yt8 desc",
    thumbnail: "https://source.unsplash.com/random/400x250/?debugging,javascript",
    videoUrl: "https://www.youtube.com/watch?v=gS_Y4_2_2_2", 
    date: "2024-03-25",
  },
  {
    id: "yt9",
    titleKey: "youtube videos.yt9 title",
    descriptionKey: "youtube videos.yt9 desc",
    thumbnail: "https://source.unsplash.com/random/400x250/?css,animation",
    videoUrl: "https://www.youtube.com/watch?v=z_g_y_2_2_2", 
    date: "2024-04-05",
  },
];

const VIDEOS_PER_PAGE = 6;

const YouTubeUpdates: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchYouTubeVideos = async () => {
      try {
        setLoading(true);
        await new Promise<void>(resolve => setTimeout(resolve, 1000));
        setVideos(dummyYouTubeVideos);
      } catch (err) {
        setError(t("failed to load videos"));
        console.error("Error fetching YouTube videos:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchYouTubeVideos();
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
            placeholder={t('search video')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:max-w-lg"
          />
        </div>

        {loading ? (
          <p className="text-center text-muted-foreground">{t('loading videos')}</p>
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
                    <Button variant="outline" className="w-full">{t('view video')}</Button>
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground mt-8 text-lg">{t('no matching videos')}</p>
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

export default YouTubeUpdates;