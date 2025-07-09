import React, { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlayCircle } from "lucide-react";
import { Input } from "@/components/ui/input"; // Import Input component
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"; // Import Pagination components

interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  videoUrl: string;
  date: string;
}

// Data dummy video YouTube yang lebih banyak untuk demonstrasi paginasi
const dummyYouTubeVideos: YouTubeVideo[] = [
  {
    id: "yt1",
    title: "Tutorial Coding untuk Pemula: HTML Dasar",
    description: "Pelajari dasar-dasar HTML untuk membuat struktur website pertamamu.",
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg", // Rick Astley
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    date: "1 Januari 2024",
  },
  {
    id: "yt2",
    title: "Mengenal CSS: Styling Website Jadi Cantik",
    description: "Bagaimana cara membuat website-mu terlihat menarik dengan CSS.",
    thumbnail: "https://img.youtube.com/vi/xvFZjo5PgG0/hqdefault.jpg", // Placeholder ID 2
    videoUrl: "https://www.youtube.com/watch?v=xvFZjo5PgG0",
    date: "15 Januari 2024",
  },
  {
    id: "yt3",
    title: "JavaScript Interaktif: Bikin Website Hidup",
    description: "Tambahkan interaktivitas pada website-mu dengan JavaScript.",
    thumbnail: "https://img.youtube.com/vi/oHg5SJYRHA0/hqdefault.jpg", // Placeholder ID 3
    videoUrl: "https://www.youtube.com/watch?v=oHg5SJYRHA0",
    date: "1 Februari 2024",
  },
  {
    id: "yt4",
    title: "React JS untuk Pemula: Membangun Komponen Pertama",
    description: "Langkah awal membangun aplikasi web modern dengan React JS.",
    thumbnail: "https://img.youtube.com/vi/Ke90Tje7VS0/hqdefault.jpg", // Placeholder ID 4
    videoUrl: "https://www.youtube.com/watch?v=Ke90Tje7VS0",
    date: "10 Februari 2024",
  },
  {
    id: "yt5",
    title: "Dasar-dasar Python: Variabel dan Tipe Data",
    description: "Pengantar Python untuk pemula, memahami variabel dan tipe data.",
    thumbnail: "https://img.youtube.com/vi/rfscVS0vtbw/hqdefault.jpg", // Placeholder ID 5
    videoUrl: "https://www.youtube.com/watch?v=rfscVS0vtbw",
    date: "20 Februari 2024",
  },
  {
    id: "yt6",
    title: "Membuat Website Responsif dengan Tailwind CSS",
    description: "Pelajari cara mendesain website yang tampil baik di semua perangkat.",
    thumbnail: "https://img.youtube.com/vi/z_g_Jt_y_2Q/hqdefault.jpg", // Placeholder ID 6
    videoUrl: "https://www.youtube.com/watch?v=z_g_Jt_y_2Q",
    date: "5 Maret 2024",
  },
  {
    id: "yt7",
    title: "Pengenalan Algoritma dan Struktur Data",
    description: "Pahami konsep dasar algoritma dan struktur data dalam pemrograman.",
    thumbnail: "https://img.youtube.com/vi/8hly3lP3118/hqdefault.jpg", // Placeholder ID 7
    videoUrl: "https://www.youtube.com/watch?v=8hly3lP3118",
    date: "15 Maret 2024",
  },
  {
    id: "yt8",
    title: "Tips dan Trik Debugging Kode JavaScript",
    description: "Cara efektif menemukan dan memperbaiki kesalahan dalam kode JavaScript Anda.",
    thumbnail: "https://img.youtube.com/vi/gSg4L7y_2QY/hqdefault.jpg", // Placeholder ID 8
    videoUrl: "https://www.youtube.com/watch?v=gSg4L7y_2QY",
    date: "25 Maret 2024",
  },
  {
    id: "yt9",
    title: "Membuat Animasi Sederhana dengan CSS",
    description: "Tambahkan efek animasi menarik ke website Anda menggunakan CSS.",
    thumbnail: "https://img.youtube.com/vi/o_o_o_o_o_o/hqdefault.jpg", // Placeholder ID 9
    videoUrl: "https://www.youtube.com/watch?v=o_o_o_o_o_o",
    date: "5 April 2024",
  },
];

const VIDEOS_PER_PAGE = 6; // Jumlah video per halaman

const YouTubeUpdates: React.FC = () => {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchYouTubeVideos = async () => {
      try {
        setLoading(true);
        // Simulasi penundaan dan penggunaan data dummy
        await new Promise(resolve => setTimeout(resolve, 1000));
        setVideos(dummyYouTubeVideos);
      } catch (err) {
        setError("Gagal memuat video YouTube. Silakan coba lagi nanti.");
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
      video.title.toLowerCase().includes(lowerCaseSearchTerm) ||
      video.description.toLowerCase().includes(lowerCaseSearchTerm)
    );
  }, [videos, searchTerm]);

  const totalPages = Math.ceil(filteredVideos.length / VIDEOS_PER_PAGE);
  const currentVideos = useMemo(() => {
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
        {/* Judul "Video YouTube Terbaru" dihapus dari sini */}
        
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

export default YouTubeUpdates;