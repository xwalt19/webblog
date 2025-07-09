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

interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  videoUrl: string;
  date: string;
}

const dummyYouTubeVideos: YouTubeVideo[] = [
  {
    id: "yt1",
    title: "Belajar HTML Dasar: Membuat Website Pertama",
    description: "Panduan lengkap untuk pemula dalam membangun struktur dasar website menggunakan HTML.",
    thumbnail: "https://img.youtube.com/vi/k_B0y_b0_b0/hqdefault.jpg", // Placeholder for HTML
    videoUrl: "https://www.youtube.com/watch?v=k_B0y_b0_b0",
    date: "1 Januari 2024",
  },
  {
    id: "yt2",
    title: "CSS untuk Pemula: Mendesain Tampilan Web",
    description: "Pelajari cara membuat website Anda terlihat menarik dan responsif dengan CSS.",
    thumbnail: "https://img.youtube.com/vi/l_C1y_C1_C1/hqdefault.jpg", // Placeholder for CSS
    videoUrl: "https://www.youtube.com/watch?v=l_C1y_C1_C1",
    date: "15 Januari 2024",
  },
  {
    id: "yt3",
    title: "JavaScript Interaktif: Menghidupkan Website",
    description: "Tambahkan fungsionalitas dinamis dan interaktivitas pada website Anda dengan JavaScript.",
    thumbnail: "https://img.youtube.com/vi/m_D2z_D2_D2/hqdefault.jpg", // Placeholder for JavaScript
    videoUrl: "https://www.youtube.com/watch?v=m_D2z_D2_D2",
    date: "1 Februari 2024",
  },
  {
    id: "yt4",
    title: "Pengantar React JS: Membangun UI Modern",
    description: "Mulai perjalanan Anda dengan React JS untuk membangun antarmuka pengguna yang kompleks dan efisien.",
    thumbnail: "https://img.youtube.com/vi/n_E3x_E3_E3/hqdefault.jpg", // Placeholder for React JS
    videoUrl: "https://www.youtube.com/watch?v=n_E3x_E3_E3",
    date: "10 Februari 2024",
  },
  {
    id: "yt5",
    title: "Python untuk Data Science: Analisis Data Dasar",
    description: "Pelajari dasar-dasar Python untuk analisis data, visualisasi, dan manipulasi data.",
    thumbnail: "https://img.youtube.com/vi/o_F4y_F4_F4/hqdefault.jpg", // Placeholder for Python Data Science
    videoUrl: "https://www.youtube.com/watch?v=o_F4y_F4_F4",
    date: "20 Februari 2024",
  },
  {
    id: "yt6",
    title: "Tailwind CSS: Desain Cepat dan Responsif",
    description: "Optimalkan workflow desain Anda dengan Tailwind CSS untuk tampilan website yang modern.",
    thumbnail: "https://img.youtube.com/vi/p_G5z_G5_G5/hqdefault.jpg", // Placeholder for Tailwind CSS
    videoUrl: "https://www.youtube.com/watch?v=p_G5z_G5_G5",
    date: "5 Maret 2024",
  },
  {
    id: "yt7",
    title: "Algoritma & Struktur Data: Konsep Penting",
    description: "Pahami fundamental algoritma dan struktur data untuk memecahkan masalah pemrograman yang kompleks.",
    thumbnail: "https://img.youtube.com/vi/q_H6a_H6_H6/hqdefault.jpg", // Placeholder for Algorithms
    videoUrl: "https://www.youtube.com/watch?v=q_H6a_H6_H6",
    date: "15 Maret 2024",
  },
  {
    id: "yt8",
    title: "Debugging JavaScript: Menemukan dan Memperbaiki Bug",
    description: "Teknik efektif untuk mengidentifikasi dan memperbaiki kesalahan dalam kode JavaScript Anda.",
    thumbnail: "https://img.youtube.com/vi/r_I7b_I7_I7/hqdefault.jpg", // Placeholder for Debugging
    videoUrl: "https://www.youtube.com/watch?v=r_I7b_I7_I7",
    date: "25 Maret 2024",
  },
  {
    id: "yt9",
    title: "Membuat Animasi Web dengan CSS3",
    description: "Panduan langkah demi langkah untuk menambahkan animasi menarik ke elemen website Anda.",
    thumbnail: "https://img.youtube.com/vi/s_J8c_J8_J8/hqdefault.jpg", // Placeholder for CSS Animation
    videoUrl: "https://www.youtube.com/watch?v=s_J8c_J8_J8",
    date: "5 April 2024",
  },
  {
    id: "yt10",
    title: "Pengenalan Git & GitHub untuk Kolaborasi",
    description: "Pelajari dasar-dasar Git dan GitHub untuk manajemen versi dan kolaborasi tim.",
    thumbnail: "https://img.youtube.com/vi/t_K9d_K9_K9/hqdefault.jpg", // Placeholder for Git/GitHub
    videoUrl: "https://www.youtube.com/watch?v=t_K9d_K9_K9",
    date: "15 April 2024",
  },
  {
    id: "yt11",
    title: "Dasar-dasar SQL: Mengelola Database",
    description: "Pahami cara berinteraksi dengan database menggunakan SQL untuk mengambil dan memanipulasi data.",
    thumbnail: "https://img.youtube.com/vi/u_L0e_L0_L0/hqdefault.jpg", // Placeholder for SQL
    videoUrl: "https://www.youtube.com/watch?v=u_L0e_L0_L0",
    date: "25 April 2024",
  },
  {
    id: "yt12",
    title: "Membuat API dengan Node.js dan Express",
    description: "Bangun RESTful API pertama Anda menggunakan Node.js dan framework Express.",
    thumbnail: "https://img.youtube.com/vi/v_M1f_M1_M1/hqdefault.jpg", // Placeholder for Node.js/Express
    videoUrl: "https://www.youtube.com/watch?v=v_M1f_M1_M1",
    date: "5 Mei 2024",
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
        await new Promise<void>(resolve => setTimeout(resolve, 1000)); // Explicitly type Promise
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

  const filteredVideos: YouTubeVideo[] = useMemo(() => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return videos.filter(video =>
      video.title.toLowerCase().includes(lowerCaseSearchTerm) ||
      video.description.toLowerCase().includes(lowerCaseSearchTerm)
    );
  }, [videos, searchTerm]);

  const totalPages = Math.ceil(filteredVideos.length / VIDEOS_PER_PAGE);
  const currentVideos: YouTubeVideo[] = useMemo(() => {
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