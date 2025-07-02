import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  image: string;
  category: string;
  author: string;
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
  },
  {
    id: "2",
    title: "Tips Menulis Konten yang Menarik",
    excerpt: "Pelajari cara membuat postingan blog yang menarik perhatian pembaca.",
    date: "15 November 2023",
    image: "https://source.unsplash.com/random/400x250/?content,marketing",
    category: "Styling CSS",
    author: "Instruktur B",
  },
  {
    id: "3",
    title: "Mengoptimalkan Blog Anda untuk SEO",
    excerpt: "Strategi dasar SEO untuk meningkatkan visibilitas blog Anda.",
    date: "20 Desember 2023",
    image: "https://source.unsplash.com/random/400x250/?seo,optimization",
    category: "JavaScript Interaktif",
    author: "Instruktur C",
  },
  {
    id: "4",
    title: "Pengantar JavaScript Modern",
    excerpt: "Pelajari JavaScript ES6+ untuk interaktivitas web.",
    date: "25 Januari 2024",
    image: "https://source.unsplash.com/random/400x250/?javascript,code",
    category: "JavaScript Interaktif",
    author: "Instruktur A",
  },
  {
    id: "5",
    title: "Membangun Proyek Akhir dengan React",
    excerpt: "Panduan lengkap membangun aplikasi web dinamis dengan React.js.",
    date: "01 Februari 2024",
    image: "https://source.unsplash.com/random/400x250/?reactjs,programming",
    category: "Proyek Akhir",
    author: "Instruktur B",
  },
  {
    id: "6",
    title: "Dasar-dasar Python untuk Data Science",
    excerpt: "Mulai perjalanan Anda di Data Science dengan Python.",
    date: "10 Februari 2024",
    image: "https://source.unsplash.com/random/400x250/?python,data",
    category: "Dasar HTML", // Contoh kategori lain
    author: "Instruktur C",
  },
];

const categories = ["Semua", "Dasar HTML", "Styling CSS", "JavaScript Interaktif", "Proyek Akhir"];

const LatestBlogPosts: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState("Semua");

  const filteredPosts = selectedCategory === "Semua"
    ? dummyBlogPosts
    : dummyBlogPosts.filter(post => post.category === selectedCategory);

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        {/* Filter Kategori */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map(category => (
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

        {/* Grid Postingan Blog */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
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
        {filteredPosts.length === 0 && (
          <p className="text-center text-muted-foreground mt-8">Tidak ada postingan untuk kategori ini.</p>
        )}
      </div>
    </section>
  );
};

export default LatestBlogPosts;