import React, { useState, useMemo } from "react";
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
import { Input } from "@/components/ui/input"; // Import Input component

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
}

const dummyBlogPosts: BlogPost[] = [
  {
    id: "1",
    title: "Memulai Perjalanan Blog Anda",
    excerpt: "Panduan langkah demi langkah untuk membuat blog pertama Anda.",
    date: "10 Oktober 2023",
    image: "https://source.unsplash.com/random/400x250/?blogging,writing",
    category: "Dasar HTML",
    author: "Instruktur A",
    year: 2023,
    month: 10, // Oktober
  },
  {
    id: "2",
    title: "Tips Menulis Konten yang Menarik",
    excerpt: "Pelajari cara membuat postingan blog yang menarik perhatian pembaca.",
    date: "15 November 2023",
    image: "https://source.unsplash.com/random/400x250/?content,marketing",
    category: "Styling CSS",
    author: "Instruktur B",
    year: 2023,
    month: 11, // November
  },
  {
    id: "3",
    title: "Mengoptimalkan Blog Anda untuk SEO",
    excerpt: "Strategi dasar SEO untuk meningkatkan visibilitas blog Anda.",
    date: "20 Desember 2023",
    image: "https://source.unsplash.com/random/400x250/?seo,optimization",
    category: "JavaScript Interaktif",
    author: "Instruktur C",
    year: 2023,
    month: 12, // Desember
  },
  {
    id: "4",
    title: "Pengantar JavaScript Modern",
    excerpt: "Pelajari JavaScript ES6+ untuk interaktivitas web.",
    date: "25 Januari 2024",
    image: "https://source.unsplash.com/random/400x250/?javascript,code",
    category: "JavaScript Interaktif",
    author: "Instruktur A",
    year: 2024,
    month: 1, // Januari
  },
  {
    id: "5",
    title: "Membangun Proyek Akhir dengan React",
    excerpt: "Panduan lengkap membangun aplikasi web dinamis dengan React.js.",
    date: "01 Februari 2024",
    image: "https://source.unsplash.com/random/400x250/?reactjs,programming",
    category: "Proyek Akhir",
    author: "Instruktur B",
    year: 2024,
    month: 2, // Februari
  },
  {
    id: "6",
    title: "Dasar-dasar Python untuk Data Science",
    excerpt: "Mulai perjalanan Anda di Data Science dengan Python.",
    date: "10 Februari 2024",
    image: "https://source.unsplash.com/random/400x250/?python,data",
    category: "Dasar HTML",
    author: "Instruktur C",
    year: 2024,
    month: 2, // Februari
  },
  {
    id: "7",
    title: "Deep Dive ke Tailwind CSS",
    excerpt: "Menguasai styling cepat dengan Tailwind CSS.",
    date: "05 Maret 2024",
    image: "https://source.unsplash.com/random/400x250/?tailwind,css",
    category: "Styling CSS",
    author: "Instruktur A",
    year: 2024,
    month: 3, // Maret
  },
  {
    id: "8",
    title: "Memahami Konsep Asynchronous JavaScript",
    excerpt: "Penjelasan mendalam tentang Promises, Async/Await.",
    date: "12 April 2024",
    image: "https://source.unsplash.com/random/400x250/?async,javascript",
    category: "JavaScript Interaktif",
    author: "Instruktur B",
    year: 2024,
    month: 4, // April
  },
  {
    id: "9",
    title: "Strategi Debugging Efektif",
    excerpt: "Tips dan trik untuk menemukan dan memperbaiki bug.",
    date: "20 Mei 2025",
    image: "https://source.unsplash.com/random/400x250/?debugging,code",
    category: "Proyek Akhir",
    author: "Instruktur C",
    year: 2025,
    month: 5, // Mei
  },
];

const allCategories = ["Semua", ...new Set(dummyBlogPosts.map(post => post.category))];

const monthNames = [
  "", "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

const POSTS_PER_PAGE = 6; // Jumlah postingan per halaman

const BlogPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [selectedPeriod, setSelectedPeriod] = useState("Semua"); // State baru untuk filter gabungan tahun-bulan
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
      const matchesCategory = selectedCategory === "Semua" || post.category === selectedCategory;
      const matchesSearch = post.title.toLowerCase().includes(lowerCaseSearchTerm) ||
                            post.excerpt.toLowerCase().includes(lowerCaseSearchTerm);
      
      let matchesPeriod = true;
      if (selectedPeriod !== "Semua") {
        const [filterYear, filterMonth] = selectedPeriod.split('-').map(Number);
        matchesPeriod = post.year === filterYear && post.month === filterMonth;
      }

      return matchesCategory && matchesSearch && matchesPeriod;
    });
  }, [selectedCategory, selectedPeriod, searchTerm]);

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
  React.useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedPeriod, searchTerm]);

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">Artikel & Tutorial</h1>
      <p className="text-lg text-muted-foreground text-center mb-10 max-w-2xl mx-auto">
        Jelajahi semua postingan blog kami, filter berdasarkan kategori, periode (tahun & bulan), atau cari berdasarkan kata kunci.
      </p>

      {/* Filter Area */}
      <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-10 flex-wrap">
        {/* Search Input */}
        <Input
          type="text"
          placeholder="Cari postingan..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-auto max-w-sm"
        />

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2">
          {allCategories.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              className="px-4 py-2 rounded-full"
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Period Filter (Year and Month Combined) */}
        <Select
          value={selectedPeriod}
          onValueChange={(value) => setSelectedPeriod(value)}
        >
          <SelectTrigger className="w-[200px]">
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
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <p className="text-muted-foreground mb-4 line-clamp-2">{post.excerpt}</p>
                <Link to={`/posts/${post.id}`}>
                  <Button variant="outline" className="w-full">Baca Selengkapnya</Button>
                </Link>
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

export default BlogPage;