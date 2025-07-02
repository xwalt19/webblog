import React, { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  image: string;
  category: string;
  author: string;
  year: number;
  month: number; // Properti bulan (1-12)
  pdfLink?: string; // Tambahkan properti untuk tautan PDF
  tags: string[]; // Tambahkan properti tags
}

// Data dummy postingan blog (sama dengan yang digunakan di BlogPage)
const dummyBlogPosts: BlogPost[] = [
  {
    id: "1",
    title: "Galeri Proyek Akhir HTML & CSS Angkatan 2023",
    excerpt: "Lihat hasil karya menakjubkan siswa kami dalam membangun website pertama mereka.",
    date: "10 Oktober 2023",
    image: "https://source.unsplash.com/random/400x250/?html,css,project",
    category: "Proyek Siswa",
    author: "Tim Pengajar",
    year: 2023,
    month: 10, // Oktober
    pdfLink: "https://www.africau.edu/images/default/sample.pdf", // Contoh tautan PDF
    tags: ["proyek", "HTML", "CSS", "galeri"],
  },
  {
    id: "2",
    title: "Momen Seru Belajar JavaScript Interaktif",
    excerpt: "Kompilasi foto dan cerita dari sesi praktik JavaScript yang penuh tawa dan penemuan.",
    date: "15 November 2023",
    image: "https://source.unsplash.com/random/400x250/?javascript,learning,fun",
    category: "Kegiatan Kelas",
    author: "Instruktur B",
    year: 2023,
    month: 11, // November
    pdfLink: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", // Contoh tautan PDF
    tags: ["JavaScript", "interaktif", "belajar", "momen"],
  },
  {
    id: "3",
    title: "Pameran Aplikasi Web React Terbaik",
    excerpt: "Saksikan inovasi siswa kami dalam menciptakan aplikasi web dinamis menggunakan React.",
    date: "20 Desember 2023",
    image: "https://source.unsplash.com/random/400x250/?reactjs,app,showcase",
    category: "Proyek Siswa",
    author: "Tim Pengajar",
    year: 2023,
    month: 12, // Desember
    pdfLink: "https://www.africau.edu/images/default/sample.pdf", // Contoh tautan PDF
    tags: ["React", "aplikasi", "inovasi", "pameran"],
  },
  {
    id: "4",
    title: "Refleksi Belajar Python untuk Data Science",
    excerpt: "Cerita dan pengalaman siswa dalam mengolah data menggunakan Python.",
    date: "25 Januari 2024",
    image: "https://source.unsplash.com/random/400x250/?python,data,reflection",
    category: "Refleksi Belajar",
    author: "Instruktur A",
    year: 2024,
    month: 1, // Januari
    pdfLink: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", // Contoh tautan PDF
    tags: ["Python", "data science", "refleksi", "pengalaman"],
  },
  {
    id: "5",
    title: "Workshop Desain UI/UX dengan Tailwind CSS",
    excerpt: "Dokumentasi workshop praktis tentang mendesain antarmuka pengguna yang responsif.",
    date: "01 Februari 2024",
    image: "https://source.unsplash.com/random/400x250/?tailwind,uiux,workshop",
    category: "Workshop",
    author: "Instruktur B",
    year: 2024,
    month: 2, // Februari
    pdfLink: "https://www.africau.edu/images/default/sample.pdf", // Contoh tautan PDF
    tags: ["Tailwind CSS", "UI/UX", "desain", "workshop"],
  },
  {
    id: "6",
    title: "Sesi Pemecahan Masalah Debugging Kode",
    excerpt: "Cuplikan dari sesi interaktif di mana siswa belajar menjadi detektif kode.",
    date: "10 Februari 2024",
    image: "https://source.unsplash.com/random/400x250/?debugging,problemsolving",
    category: "Kegiatan Kelas",
    author: "Instruktur C",
    year: 2024,
    month: 2, // Februari
    pdfLink: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", // Contoh tautan PDF
    tags: ["debugging", "pemecahan masalah", "kode", "praktik"],
  },
  {
    id: "7",
    title: "Kunjungan Industri Mengenal Dunia Startup",
    excerpt: "Laporan kunjungan siswa ke startup teknologi terkemuka di Bandung.",
    date: "05 Maret 2024",
    image: "https://source.unsplash.com/random/400x250/?startup,industry,visit",
    category: "Kegiatan Eksternal",
    author: "Tim Pengajar",
    year: 2024,
    month: 3, // Maret
    pdfLink: "https://www.africau.edu/images/default/sample.pdf", // Contoh tautan PDF
    tags: ["kunjungan", "industri", "startup", "pengalaman"],
  },
  {
    id: "8",
    title: "Hackathon Mini Tantangan Coding Seru",
    excerpt: "Ringkasan hackathon mini yang menguji kemampuan coding dan kolaborasi siswa.",
    date: "12 April 2024",
    image: "https://source.unsplash.com/random/400x250/?hackathon,coding,challenge",
    category: "Kompetisi",
    author: "Instruktur B",
    year: 2024,
    month: 4, // April
    pdfLink: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", // Contoh tautan PDF
    tags: ["hackathon", "coding", "tantangan", "kolaborasi"],
  },
  {
    id: "9",
    title: "Sertifikasi Kelulusan Angkatan Terbaru",
    excerpt: "Perayaan kelulusan dan penyerahan sertifikat bagi siswa yang telah menyelesaikan kursus.",
    date: "20 Mei 2025",
    image: "https://source.unsplash.com/random/400x250/?graduation,certificate,celebration",
    category: "Acara Spesial",
    author: "Manajemen",
    year: 2025,
    month: 5, // Mei
    pdfLink: "https://www.africau.edu/images/default/sample.pdf", // Contoh tautan PDF
    tags: ["kelulusan", "sertifikasi", "perayaan", "prestasi"],
  },
];

const allTags = ["Semua", ...new Set(dummyBlogPosts.flatMap(post => post.tags))];

const monthNames = [
  "", "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

const POSTS_PER_PAGE = 6; // Jumlah postingan per halaman

const Archives: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("Semua");
  const [selectedTag, setSelectedTag] = useState("Semua");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Generate unique year-month periods
  const allPeriods = useMemo(() => {
    const periods = new Set<string>();
    dummyBlogPosts.forEach(post => {
      periods.add(`${post.year}-${post.month}`);
    });
    const sortedPeriods = Array.from(periods).sort((a, b) => {
      const [yearA, monthA] = a.split('-').map(Number);
      const [yearB, monthB] = b.split('-').map(Number);
      if (yearA !== yearB) return yearB - yearA; // Sort by year descending
      return monthB - monthA; // Then by month descending
    });
    return ["Semua", ...sortedPeriods];
  }, []);

  const getPeriodDisplayName = (period: string) => {
    if (period === "Semua") return "Semua Waktu";
    const [year, month] = period.split('-').map(Number);
    return `${year} - ${monthNames[month]}`;
  };

  const filteredPosts = useMemo(() => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return dummyBlogPosts.filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(lowerCaseSearchTerm) ||
                            post.excerpt.toLowerCase().includes(lowerCaseSearchTerm);
      
      let matchesPeriod = true;
      if (selectedPeriod !== "Semua") {
        const [filterYear, filterMonth] = selectedPeriod.split('-').map(Number);
        matchesPeriod = post.year === filterYear && post.month === filterMonth;
      }

      const matchesTag = selectedTag === "Semua" || post.tags.includes(selectedTag);

      return matchesSearch && matchesPeriod && matchesTag;
    });
  }, [selectedPeriod, selectedTag, searchTerm]);

  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const currentPosts = useMemo(() => {
    const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
    const endIndex = startIndex + POSTS_PER_PAGE;
    return filteredPosts.slice(startIndex, endIndex);
  }, [filteredPosts, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top on page change
  };

  // Reset pagination whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedPeriod, selectedTag, searchTerm]);

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">Archives</h1>
      <p className="text-lg text-muted-foreground text-center mb-10 max-w-2xl mx-auto">
        Temukan momen berharga dan pengalaman belajar kami. Filter berdasarkan periode, tag, atau cari dengan kata kunci.
      </p>

      {/* Filter Area */}
      <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-10 flex-wrap">
        {/* Search Input */}
        <Input
          type="text"
          placeholder="Cari postingan..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:max-w-xs"
        />

        {/* Tag Filter (as Select) */}
        <Select
          value={selectedTag}
          onValueChange={(value) => setSelectedTag(value)}
        >
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Tag" />
          </SelectTrigger>
          <SelectContent>
            {allTags.map(tag => (
              <SelectItem key={tag} value={tag}>
                {tag === "Semua" ? "Tag" : tag}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Period Filter (Year and Month Combined) */}
        <Select
          value={selectedPeriod}
          onValueChange={(value) => setSelectedPeriod(value)}
        >
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Pilih Periode" />
          </SelectTrigger>
          <SelectContent>
            {allPeriods.map(period => (
              <SelectItem key={period} value={period}>
                {getPeriodDisplayName(period)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Grid Postingan Blog */}
      {currentPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentPosts.map((post) => (
            <Card key={post.id} className="flex flex-col overflow-hidden">
              <img src={post.image} alt={post.title} className="w-full h-48 object-cover" />
              <CardHeader className="flex-grow">
                <div className="flex justify-between items-center mb-2">
                  <Badge variant="secondary">{post.category}</Badge>
                  <span className="text-sm text-muted-foreground">{post.date}</span>
                </div>
                <CardTitle className="text-xl">{post.title}</CardTitle>
                <CardDescription className="text-sm text-muted-foreground">By {post.author}</CardDescription>
                <div className="flex flex-wrap gap-1 mt-2">
                  {post.tags.map(tag => (
                    <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                  ))}
                </div>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <p className="text-muted-foreground mb-4 line-clamp-2">{post.excerpt}</p>
                {post.pdfLink ? (
                  <a href={post.pdfLink} target="_blank" rel="noopener noreferrer" className="w-full">
                    <Button variant="outline" className="w-full">Baca Selengkapnya (PDF)</Button>
                  </a>
                ) : (
                  <Link to={`/posts/${post.id}`}>
                    <Button variant="outline" className="w-full">Baca Selengkapnya</Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground mt-8 text-lg">Tidak ada postingan yang cocok dengan filter Anda.</p>
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
  );
};

export default Archives;