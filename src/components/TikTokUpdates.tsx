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
import { supabase } from "@/integrations/supabase/client"; // Import supabase
import ResponsiveImage from "./ResponsiveImage"; // Import ResponsiveImage

interface TikTokVideo {
  id: string;
  title: string;
  description: string;
  thumbnail_url: string;
  video_url: string;
  published_at: string; // Use string for ISO date from DB
}

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
      setLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase
          .from('tiktok_videos')
          .select('*')
          .order('published_at', { ascending: false });

        if (error) {
          throw error;
        }
        setVideos(data || []);
      } catch (err: any) {
        setError(t("fetch data error", { error: err.message }));
        console.error("Error fetching TikTok videos:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTikTokVideos();
  }, [t]); // Depend on t to refetch if language changes

  const filteredVideos = useMemo(() => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return videos.filter(video =>
      video.title.toLowerCase().includes(lowerCaseSearchTerm) ||
      video.description.toLowerCase().includes(lowerCaseSearchTerm)
    );
  }, [videos, searchTerm]); // No need for i18n.language here as data is already fetched

  const totalPages = Math.ceil(filteredVideos.length / VIDEOS_PER_PAGE);
  const currentVideos = useMemo(() => {
    const startIndex = (currentPage - 1) * VIDEOS_PER_PAGE;
    const endIndex = startIndex + VIDEOS_PER_PAGE;
    return filteredVideos.slice(startIndex, endIndex);
  }, [filteredVideos, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]); // Reset page when search term changes

  const formatDate = (isoString: string) => {
    const dateObj = new Date(isoString);
    return dateObj.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
  };

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
                  <ResponsiveImage 
                    src={video.thumbnail_url} 
                    alt={video.title} 
                    containerClassName="w-full h-full absolute inset-0" 
                    className="object-cover" 
                  />
                  <PlayCircle className="absolute text-white/80 hover:text-white transition-colors" size={64} />
                </div>
                <CardHeader className="flex-grow">
                  <CardTitle className="text-xl">{video.title}</CardTitle>
                  <CardDescription className="text-sm text-muted-foreground">
                    {formatDate(video.published_at)}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 pt-0">
                  <p className="text-muted-foreground mb-4 line-clamp-2">{video.description}</p>
                  <a href={video.video_url} target="_blank" rel="noopener noreferrer" className="w-full">
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

export default TikTokUpdates;