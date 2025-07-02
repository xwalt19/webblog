import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  image: string;
}

const dummyBlogPosts: BlogPost[] = [
  {
    id: "1",
    title: "5 Tips UI Modern di Tahun 2025",
    excerpt: "Pelajari tren desain UI terbaru untuk membuat antarmuka yang memukau.",
    date: "10 Januari 2025",
    image: "https://source.unsplash.com/random/400x250/?ui-design,modern",
  },
  {
    id: "2",
    title: "Memahami Konsep Asynchronous JavaScript",
    excerpt: "Panduan mendalam tentang Promises, Async/Await, dan Callback.",
    date: "25 Desember 2024",
    image: "https://source.unsplash.com/random/400x250/?javascript,async",
  },
  {
    id: "3",
    title: "Panduan Lengkap Membangun RESTful API dengan Node.js",
    excerpt: "Langkah demi langkah membuat API yang kuat dan skalabel.",
    date: "15 November 2024",
    image: "https://source.unsplash.com/random/400x250/?nodejs,api",
  },
];

const LatestBlogPosts: React.FC = () => {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">Baca Wawasan Terbaru dari Blog Kami</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dummyBlogPosts.map((post) => (
            <Card key={post.id} className="flex flex-col overflow-hidden">
              <img src={post.image} alt={post.title} className="w-full h-48 object-cover" />
              <CardHeader className="flex-grow">
                <CardTitle className="text-xl">{post.title}</CardTitle>
                <CardDescription>{post.date}</CardDescription>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <p className="text-muted-foreground mb-4">{post.excerpt}</p>
                <Link to={`/posts/${post.id}`}>
                  <Button variant="outline" className="w-full">Baca Selengkapnya</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LatestBlogPosts;