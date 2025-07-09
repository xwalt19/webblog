import React from "react";
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
  tags: string[]; // Tambahkan properti tags
}

const dummyBlogPosts: BlogPost[] = [
  {
    id: "1",
    title: "Yuk Bikin Blog Seru Pertamamu",
    excerpt: "Panduan langkah demi langkah untuk membuat blog pertama Anda.",
    date: "10 Oktober 2023",
    image: "https://source.unsplash.com/random/400x250/?blogging,writing",
    category: "Dasar HTML",
    author: "Instruktur A",
    tags: ["pemula", "blogging"],
  },
  {
    id: "2",
    title: "Rahasia Menulis Cerita Blog yang Bikin Betah Baca",
    excerpt: "Pelajari cara membuat postingan blog yang menarik perhatian pembaca.",
    date: "15 November 2023",
    image: "https://source.unsplash.com/random/400x250/?content,marketing",
    category: "Styling CSS",
    author: "Instruktur B",
    tags: ["menulis", "konten"],
  },
  {
    id: "3",
    title: "Biar Blogmu Gampang Ditemukan di Internet",
    excerpt: "Strategi dasar SEO untuk meningkatkan visibilitas blog Anda.",
    date: "20 Desember 2023",
    image: "https://source.unsplash.com/random/400x250/?seo,optimization",
    category: "JavaScript Interaktif",
    author: "Instruktur C",
    tags: ["SEO", "internet"],
  },
  {
    id: "4",
    title: "Sihir JavaScript Bikin Website Jadi Hidup",
    excerpt: "Pelajari JavaScript ES6+ untuk interaktivitas web.",
    date: "25 Januari 2024",
    image: "https://source.unsplash.com/random/400x250/?javascript,code",
    category: "JavaScript Interaktif",
    author: "Instruktur A",
    tags: ["JavaScript", "web"],
  },
  {
    id: "5",
    title: "Yuk Bikin Aplikasi Keren Pakai React",
    excerpt: "Panduan lengkap membangun aplikasi web dinamis dengan React.js.",
    date: "01 Februari 2024",
    image: "https://source.unsplash.com/random/400x250/?reactjs,programming",
    category: "Proyek Akhir",
    author: "Instruktur B",
    tags: ["React", "aplikasi"],
  },
  {
    id: "6",
    title: "Python Si Pintar Pengolah Data",
    excerpt: "Mulai perjalanan Anda di Data Science dengan Python.",
    date: "10 Februari 2024",
    image: "https://source.unsplash.com/random/400x250/?python,data",
    category: "Dasar HTML", // Contoh kategori lain
    author: "Instruktur C",
    tags: ["Python", "data"],
  },
];

const LatestBlogPosts: React.FC = () => {
  // Ambil hanya 3 postingan terbaru untuk homepage
  const latestPosts = dummyBlogPosts.slice(0, 3);

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">Wawasan Terbaru dari Blog Kami</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {latestPosts.map((post) => (
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
                <Link to={`/posts/${post.id}`}>
                  <Button variant="outline" className="w-full">Baca Selengkapnya</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link to="/blog">
            <Button size="lg" variant="default">Baca Semua Postingan</Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default LatestBlogPosts;