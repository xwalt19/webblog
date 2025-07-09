import React, { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlayCircle } from "lucide-react"; // Menggunakan ikon PlayCircle untuk video
import { Input } from "@/components/ui/input"; // Import Input component
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"; // Import Pagination components

interface TikTokVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  videoUrl: string;
  date: string;
}

const dummyTikTokVideos: TikTokVideo[] = [
  {
    id: "tk1",
    title: "Tips Coding Cepat ala ProCodeCG",
    description: "Pelajari trik coding yang akan mempercepat workflow Anda.",
    thumbnail: "https://source.unsplash.com/random/400x250/?coding,tips", // Placeholder thumbnail
    videoUrl: "https://www.tiktok.com/@procodecg/video/1234567890", // Placeholder URL TikTok
    date: "10 Maret 2024",
  },
  {
    id: "tk2",
    title: "Challenge Coding Seru Minggu Ini",
    description: "Ikuti challenge coding kami dan menangkan hadiah menarik.",
    thumbnail: "https://source.unsplash.com/random/400x250/?challenge,code", // Placeholder thumbnail
    videoUrl: "https://www.tiktok.com/@procodecg/video/0987654321", // Placeholder URL TikTok
    date: "18 Maret 2024",
  },
  {
    id: "tk3",
    title: "Behind The Scenes Kelas Coding Anak",
    description: "Intip keseruan di balik layar kelas coding untuk anak-anak.",
    thumbnail: "https://source.unsplash.com/random/400x250/?kids,coding", // Placeholder thumbnail
    videoUrl: "https://www.tiktok.com/@procodecg/video/1122334455", // Placeholder URL TikTok
    date: "25 Maret 2024",
  },
  {
    id: "tk4",
    title: "Tutorial Singkat HTML Dasar",
    description: "Belajar membuat struktur dasar halaman web dengan HTML.",
    thumbnail: "https://source.unsplash.com/random/400x250/?html,tutorial",
    videoUrl: "https://www.tiktok.com/@procodecg/video/2233445566",
    date: "1 April 2024",
  },
  {
    id: "tk5",
    title: "CSS Tricks Styling Cepat",
    description: "Trik cepat untuk mempercantik tampilan website Anda dengan CSS.",
    thumbnail: "https://source.unsplash.com/random/400x250/?css,design",
    videoUrl: "https://www.tiktok.com/@procodecg/video/3344556677",
    date: "8 April 2024",
  },
  {
    id: "tk6",
    title: "JavaScript Fun Interaksi Tombol",
    description: "Buat tombol interaktif di website Anda menggunakan JavaScript.",
    thumbnail: "https://source.unsplash.com/random/400x250/?javascript,button",
    videoUrl: "https://www.tiktok.com/@procodecg/video/4455667788",
    date: "15 April 2024",
  },
  {
    id: "tk7",
    title: "React Hooks Explained",
    description: "Penjelasan singkat tentang React Hooks untuk pemula.",
    thumbnail: "https://source.unsplash.com/random/400x250/?react,hooks",
    videoUrl: "https://www.tiktok.com/@procodecg/video/5566778899",
    date: "22 April 2024",
  },
  {
    id: "tk8",
    title: "Python Basics Variabel dan Tipe Data",
    description: "Mengenal dasar-dasar Python: variabel dan tipe data.",
    thumbnail: "https://source.unsplash.com/random/400x250/?python,basics",
    videoUrl: "https://www.tiktok.com/@procodecg/video/6677889900",
    date: "29 April 2024",
  },
  {
    id: "tk9",
    title: "Belajar Git dalam 60 Detik",
    description: "Pengantar cepat untuk Git, sistem kontrol versi.",
    thumbnail: "https://source.unsplash.com/random/400x250/?git,versioncontrol",
    videoUrl: "https://www.tiktok.com/@procodecg/video/7788990011",
    date: "6 Mei 2024",
  },
];

const VIDEOS_PER_PAGE = 6; // Jumlah video per halaman

const TikTokUpdates: React.FC = () => {
  const [videos, setVideos] = useState<TikTokVideo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchTikTokVideos = async () => {
      try {
        setLoading(true);
        // Simulasi penundaan dan penggunaan data dummy
        await new Promise<void>(resolve => setTimeout(resolve, 1000)); // Explicitly type Promise
        setVideos(dummyTikTokVideos);
      } catch (err) {
        setError("Gagal memuat video TikTok. Silakan coba lagi nanti.");
        console.error("Error fetching TikTok videos:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTikTokVideos();
  }, []);

  const filteredVideos: TikTokVideo[] = useMemo(() => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return videos.filter(video =>
      video.title.toLowerCase().includes(lowerCaseSearchTerm) ||
      video.description.toLowerCase().includes(lowerCaseSearchTerm)
    );
  }, [videos, searchTerm]);

  const totalPages = Math.ceil(filteredVideos.length / VIDEOS_PER_PAGE);
  const currentVideos: TikTokVideo[] = useMemo(() => {
    const startIndex = (currentPage - 1) * VIDEOS_PER_PAGE;
    const endIndex = startIndex + VIDEOS_PER_PAGE;
    return filteredVideos.slice(startIndex, endIndex);
  }, [filteredVideos, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top on page change
  };

  // Reset pagination whenever search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  return (
    <section className="py-12 bg-muted/40">
      <div className="container mx-auto px-4">
        {/* Judul "Video TikTok Kami" dihapus dari sini */}
        
        {/* Search Input */}
        <div className="flex justify-center mb-8">
          <Input
            type="text"
            placeholder="Cari video..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:max-w-lg"
          />
        </div>

        {loading ? (
          <p className="text-center text-muted-foreground">Memuat video...</p>
        ) : error ? (
          <p className="text-center text-destructive">{error}</p>
        ) : currentVideos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentVideos.map((video) => (
              <Card key={video.id} className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="relative w-full h-48 bg-gray-200 flex items-center justify-center">
                  <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
                  <PlayCircle className="absolute text-white/80 hover:text-white transition-colors" size={64} />
                </div>
                <CardHeader className="flex-grow">
                  <CardTitle className="text-xl">{video.title}</CardTitle>
                  <CardDescription className="text-sm text-muted-foreground">{video.date}</CardDescription>
                </CardHeader>
                <CardContent className="p-6 pt-0">
                  <p className="text-muted-foreground mb-4 line-clamp-2">{video.description}</p>
                  <a href={video.videoUrl} target="_blank" rel="noopener noreferrer" className="w-full">
                    <Button variant="outline" className="w-full">Lihat Video</Button>
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground mt-8 text-lg">Tidak ada video yang cocok dengan pencarian Anda.</p>
        )}

        {/* Paginasi */}
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