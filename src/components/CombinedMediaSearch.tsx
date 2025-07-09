import React, { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Youtube, Music } from "lucide-react"; // Add Youtube and Music icons
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface MediaItem {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  url: string; // Renamed from videoUrl to be more generic
  date: string;
  type: 'youtube' | 'tiktok'; // New property to distinguish
}

// Dummy data for YouTube videos (copied from YouTubeUpdates.tsx with actual links)
const dummyYouTubeVideos: MediaItem[] = [
  {
    id: "yt1",
    title: "Tutorial Coding untuk Pemula HTML Dasar",
    description: "Pelajari dasar-dasar HTML untuk membuat struktur website pertamamu.",
    thumbnail: "https://source.unsplash.com/random/400x250/?html,coding",
    url: "https://www.youtube.com/watch?v=M_HTyO_y_0M",
    date: "1 Januari 2024",
    type: 'youtube',
  },
  {
    id: "yt2",
    title: "Mengenal CSS Styling Website Jadi Cantik",
    description: "Bagaimana cara membuat website-mu terlihat menarik dengan CSS.",
    thumbnail: "https://source.unsplash.com/random/400x250/?css,design",
    url: "https://www.youtube.com/watch?v=1Rs2ND1ryYc",
    date: "15 Januari 2024",
    type: 'youtube',
  },
  {
    id: "yt3",
    title: "JavaScript Interaktif Bikin Website Hidup",
    description: "Tambahkan interaktivitas pada website-mu dengan JavaScript.",
    thumbnail: "https://source.unsplash.com/random/400x250/?javascript,web",
    url: "https://www.youtube.com/watch?v=W6NZfCO5sks",
    date: "1 Februari 2024",
    type: 'youtube',
  },
  {
    id: "yt4",
    title: "React JS untuk Pemula Membangun Komponen Pertama",
    description: "Langkah awal membangun aplikasi web modern dengan React JS.",
    thumbnail: "https://source.unsplash.com/random/400x250/?react,frontend",
    url: "https://www.youtube.com/watch?v=Tn6-PIqc4UM",
    date: "10 Februari 2024",
    type: 'youtube',
  },
  {
    id: "yt5",
    title: "Dasar-dasar Python Variabel dan Tipe Data",
    description: "Pengantar Python untuk pemula, memahami variabel dan tipe data.",
    thumbnail: "https://source.unsplash.com/random/400x250/?python,programming",
    url: "https://www.youtube.com/watch?v=rfscVS0vtbw",
    date: "20 Februari 2024",
    type: 'youtube',
  },
  {
    id: "yt6",
    title: "Membuat Website Responsif dengan Tailwind CSS",
    description: "Pelajari cara mendesain website yang tampil baik di semua perangkat.",
    thumbnail: "https://source.unsplash.com/random/400x250/?tailwind,responsive",
    url: "https://www.youtube.com/watch?v=z_g_y_2_2_2",
    date: "5 Maret 2024",
    type: 'youtube',
  },
  {
    id: "yt7",
    title: "Pengenalan Algoritma dan Struktur Data",
    description: "Pahami konsep dasar algoritma dan struktur data dalam pemrograman.",
    thumbnail: "https://source.unsplash.com/random/400x250/?algorithm,datastructure",
    url: "https://www.youtube.com/watch?v=BBpAmxU_NQ8",
    date: "15 Maret 2024",
    type: 'youtube',
  },
  {
    id: "yt8",
    title: "Tips dan Trik Debugging Kode JavaScript",
    description: "Cara efektif menemukan dan memperbaiki kesalahan dalam kode JavaScript Anda.",
    thumbnail: "https://source.unsplash.com/random/400x250/?debugging,javascript",
    url: "https://www.youtube.com/watch?v=gS_Y4_2_2_2",
    date: "25 Maret 2024",
    type: 'youtube',
  },
  {
    id: "yt9",
    title: "Membuat Animasi Sederhana dengan CSS",
    description: "Tambahkan efek animasi menarik ke website Anda menggunakan CSS.",
    thumbnail: "https://source.unsplash.com/random/400x250/?css,animation",
    url: "https://www.youtube.com/watch?v=z_g_y_2_2_2",
    date: "5 April 2024",
    type: 'youtube',
  },
];

// Dummy data for TikTok videos (copied from TikTokUpdates.tsx)
const dummyTikTokVideos: MediaItem[] = [
  {
    id: "tk1",
    title: "Tips Coding Cepat ala ProCodeCG",
    description: "Pelajari trik coding yang akan mempercepat workflow Anda.",
    thumbnail: "https://source.unsplash.com/random/400x250/?coding,tips",
    url: "https://www.tiktok.com/@procodecg/video/1234567890",
    date: "10 Maret 2024",
    type: 'tiktok',
  },
  {
    id: "tk2",
    title: "Challenge Coding Seru Minggu Ini!",
    description: "Ikuti challenge coding kami dan menangkan hadiah menarik.",
    thumbnail: "https://source.unsplash.com/random/400x250/?challenge,code",
    url: "https://www.tiktok.com/@procodecg/video/0987654321",
    date: "18 Maret 2024",
    type: 'tiktok',
  },
  {
    id: "tk3",
    title: "Behind The Scenes Kelas Coding Anak",
    description: "Intip keseruan di balik layar kelas coding untuk anak-anak.",
    thumbnail: "https://source.unsplash.com/random/400x250/?kids,coding",
    url: "https://www.tiktok.com/@procodecg/video/1122334455",
    date: "25 Maret 2024",
    type: 'tiktok',
  },
  {
    id: "tk4",
    title: "Tutorial Singkat HTML Semantik",
    description: "Pahami pentingnya HTML semantik untuk struktur web yang lebih baik.",
    thumbnail: "https://source.unsplash.com/random/400x250/?html,webdev",
    url: "https://www.tiktok.com/@procodecg/video/1122334456",
    date: "1 April 2024",
    type: 'tiktok',
  },
  {
    id: "tk5",
    title: "CSS Grid vs Flexbox Kapan Pakai yang Mana?",
    description: "Perbandingan singkat antara CSS Grid dan Flexbox untuk layout responsif.",
    thumbnail: "https://source.unsplash.com/random/400x250/?css,layout",
    url: "https://www.tiktok.com/@procodecg/video/1122334457",
    date: "8 April 2024",
    type: 'tiktok',
  },
  {
    id: "tk6",
    title: "JavaScript Array Methods yang Wajib Kamu Tahu",
    description: "Beberapa metode array JavaScript yang akan mempermudah codingmu.",
    thumbnail: "https://source.unsplash.com/random/400x250/?javascript,array",
    url: "https://www.tiktok.com/@procodecg/video/1122334458",
    date: "15 April 2024",
    type: 'tiktok',
  },
  {
    id: "tk7",
    title: "React Hooks useState dan useEffect",
    description: "Pengenalan dasar React Hooks useState dan useEffect untuk pemula.",
    thumbnail: "https://source.unsplash.com/random/400x250/?react,hooks",
    url: "https://www.tiktok.com/@procodecg/video/1122334459",
    date: "22 April 2024",
    type: 'tiktok',
  },
  {
    id: "tk8",
    title: "Python untuk Otomatisasi Tugas Sehari-hari",
    description: "Cara menggunakan Python untuk mengotomatisasi tugas-tugas repetitif.",
    thumbnail: "https://source.unsplash.com/random/400x250/?python,automation",
    url: "https://www.tiktok.com/@procodecg/video/1122334460",
    date: "29 April 2024",
    type: 'tiktok',
  },
  {
    id: "tk9",
    title: "Belajar Git dan GitHub dalam 60 Detik",
    description: "Pengantar singkat tentang Git dan GitHub untuk kolaborasi kode.",
    thumbnail: "https://source.unsplash.com/random/400x250/?git,github",
    url: "https://www.tiktok.com/@procodecg/video/1122334461",
    date: "6 Mei 2024",
    type: 'tiktok',
  },
];

const VIDEOS_PER_PAGE = 6;

const CombinedMediaSearch: React.FC = () => {
  const [allMedia, setAllMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchAllMedia = async () => {
      try {
        setLoading(true);
        // Simulate fetching both types of media
        await new Promise<void>(resolve => setTimeout(resolve, 1000));
        const combined = [...dummyYouTubeVideos, ...dummyTikTokVideos].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // Sort by date descending
        setAllMedia(combined);
      } catch (err) {
        setError("Gagal memuat media. Silakan coba lagi nanti.");
        console.error("Error fetching media:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllMedia();
  }, []);

  const filteredMedia = useMemo(() => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return allMedia.filter(item =>
      item.title.toLowerCase().includes(lowerCaseSearchTerm) ||
      item.description.toLowerCase().includes(lowerCaseSearchTerm)
    );
  }, [allMedia, searchTerm]);

  const totalPages = Math.ceil(filteredMedia.length / VIDEOS_PER_PAGE);
  const currentMedia = useMemo(() => {
    const startIndex = (currentPage - 1) * VIDEOS_PER_PAGE;
    const endIndex = startIndex + VIDEOS_PER_PAGE;
    return filteredMedia.slice(startIndex, endIndex);
  }, [filteredMedia, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  return (
    <section className="py-12 bg-muted/40">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">Video Terbaru Kami</h2>
        <div className="flex justify-center mb-8">
          <Input
            type="text"
            placeholder="Cari video YouTube atau TikTok..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:max-w-lg"
          />
        </div>

        {loading ? (
          <p className="text-center text-muted-foreground">Memuat video...</p>
        ) : error ? (
          <p className="text-center text-destructive">{error}</p>
        ) : currentMedia.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentMedia.map((item) => (
              <Card key={item.id} className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="relative w-full h-48 bg-gray-200 flex items-center justify-center">
                  <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
                  {item.type === 'youtube' ? (
                    <Youtube className="absolute text-white/80 hover:text-white transition-colors" size={64} />
                  ) : (
                    <Music className="absolute text-white/80 hover:text-white transition-colors" size={64} />
                  )}
                </div>
                <CardHeader className="flex-grow">
                  <CardTitle className="text-xl">{item.title}</CardTitle>
                  <CardDescription className="text-sm text-muted-foreground">
                    {item.date} - {item.type === 'youtube' ? 'YouTube' : 'TikTok'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 pt-0">
                  <p className="text-muted-foreground mb-4 line-clamp-2">{item.description}</p>
                  <a href={item.url} target="_blank" rel="noopener noreferrer" className="w-full">
                    <Button variant="outline" className="w-full">Lihat Video</Button>
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground mt-8 text-lg">Tidak ada video yang cocok dengan pencarian Anda.</p>
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

export default CombinedMediaSearch;