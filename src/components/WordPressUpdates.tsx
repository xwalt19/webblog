import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Newspaper } from "lucide-react";

interface WordPressPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  image: string;
  category: string;
  author: string;
  postUrl: string; // URL ke postingan WordPress asli
}

const dummyWordPressPosts: WordPressPost[] = [
  {
    id: "wp1",
    title: "Tips Efektif Belajar Coding untuk Pemula",
    excerpt: "Mulai perjalanan coding Anda dengan tips dan trik yang terbukti efektif.",
    date: "5 Maret 2024",
    image: "https://source.unsplash.com/random/400x250/?coding,learning",
    category: "Edukasi",
    author: "Admin WP",
    postUrl: "https://example.wordpress.com/tips-belajar-coding", // Placeholder URL
  },
  {
    id: "wp2",
    title: "Peran AI dalam Pengembangan Web Modern",
    excerpt: "Bagaimana kecerdasan buatan mengubah cara kita membangun website.",
    date: "12 Maret 2024",
    image: "https://source.unsplash.com/random/400x250/?ai,webdev",
    category: "Teknologi",
    author: "Guest Blogger",
    postUrl: "https://example.wordpress.com/ai-web-development", // Placeholder URL
  },
  {
    id: "wp3",
    title: "Studi Kasus: Membangun Aplikasi E-commerce dengan React",
    excerpt: "Lihat bagaimana kami membangun aplikasi e-commerce lengkap dari nol.",
    date: "20 Maret 2024",
    image: "https://source.unsplash.com/random/400x250/?ecommerce,react",
    category: "Studi Kasus",
    author: "Tim ProCodeCG",
    postUrl: "https://example.wordpress.com/ecommerce-react-casestudy", // Placeholder URL
  },
];

const WordPressUpdates: React.FC = () => {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">Pembaruan dari Blog WordPress Kami</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dummyWordPressPosts.map((post) => (
            <Card key={post.id} className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
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
                <a href={post.postUrl} target="_blank" rel="noopener noreferrer" className="w-full">
                  <Button variant="outline" className="w-full">Baca Selengkapnya</Button>
                </a>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="text-center mt-10">
          <a href="https://example.wordpress.com" target="_blank" rel="noopener noreferrer">
            <Button size="lg" variant="default">Kunjungi Blog WordPress Kami</Button>
          </a>
        </div>
      </div>
    </section>
  );
};

export default WordPressUpdates;