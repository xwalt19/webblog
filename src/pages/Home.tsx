import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface BlogPost {
  id: string;
  title: string;
  description: string;
  date: string;
}

const dummyPosts: BlogPost[] = [
  {
    id: "1",
    title: "Memulai Perjalanan Blog Anda",
    description: "Panduan langkah demi langkah untuk membuat blog pertama Anda.",
    date: "10 Oktober 2023",
  },
  {
    id: "2",
    title: "Tips Menulis Konten yang Menarik",
    description: "Pelajari cara membuat postingan blog yang menarik perhatian pembaca.",
    date: "15 November 2023",
  },
  {
    id: "3",
    title: "Mengoptimalkan Blog Anda untuk SEO",
    description: "Strategi dasar SEO untuk meningkatkan visibilitas blog Anda.",
    date: "20 Desember 2023",
  },
];

const Home: React.FC = () => {
  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold text-center mb-8">Selamat Datang di Blog Kurusiu</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dummyPosts.map((post) => (
          <Card key={post.id} className="flex flex-col">
            <CardHeader>
              <CardTitle>{post.title}</CardTitle>
              <CardDescription>{post.date}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-muted-foreground">{post.description}</p>
            </CardContent>
            <div className="p-6 pt-0">
              <Link to={`/posts/${post.id}`}>
                <Button className="w-full">Baca Selengkapnya</Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Home;