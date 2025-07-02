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

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  image: string;
  category: string;
  author: string;
  year: number;
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
  },
];

const allCategories = ["Semua", ...new Set(dummyBlogPosts.map(post => post.category))];
const allYears = ["Semua", ...new Set(dummyBlogPosts.map(post => post.year.toString()))].sort((a, b) => parseInt(b) - parseInt(a));

const POSTS_PER_PAGE = 6; // Jumlah postingan per halaman

const BlogPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [selectedYear, setSelectedYear] = useState("Semua");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredPosts = useMemo(() => {
    return dummyBlogPosts.filter(post => {
      const matchesCategory = selectedCategory === "Semua" || post.category === selectedCategory;
      const matchesYear = selectedYear === "Semua" || post.year.toString() === selectedYear;
      return matchesCategory && matchesYear;
    });
  }, [selectedCategory, selectedYear]);

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

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">Artikel & Tutorial</h1>
      <p className="text-lg text-muted-foreground text-center mb-10 max-w-2xl mx-auto">
        Jelajahi semua postingan blog kami, filter berdasarkan kategori dan tahun untuk menemukan wawasan yang Anda cari.
      </p>

      {/* Filter Area */}
      <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-10">
        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2">
          {allCategories.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => {
                setSelectedCategory(category);
                setCurrentPage(1); // Reset to first page on filter change
              }}
              className="px-4 py-2 rounded-full"
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Year Filter */}
        <Select
          value={selectedYear}
          onValueChange={(value) => {
            setSelectedYear(value);
            setCurrentPage(1); // Reset to first page on filter change
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Pilih Tahun" />
          </SelectTrigger>
          <SelectContent>
            {allYears.map(year => (
              <SelectItem key={year} value={year}>
                {year === "Semua" ? "Semua Tahun" : year}
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