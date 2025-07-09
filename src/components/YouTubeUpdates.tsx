import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlayCircle } from "lucide-react";

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
    title: "Tutorial Coding untuk Pemula: HTML Dasar",
    description: "Pelajari dasar-dasar HTML untuk membuat struktur website pertamamu.",
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg", // Placeholder thumbnail
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", // Placeholder URL
    date: "1 Januari 2024",
  },
  {
    id: "yt2",
    title: "Mengenal CSS: Styling Website Jadi Cantik",
    description: "Bagaimana cara membuat website-mu terlihat menarik dengan CSS.",
    thumbnail: "https://img.youtube.com/vi/y_yK24_8_2Q/hqdefault.jpg", // Placeholder thumbnail
    videoUrl: "https://www.youtube.com/watch?v=y_yK24_8_2Q", // Placeholder URL
    date: "15 Januari 2024",
  },
  {
    id: "yt3",
    title: "JavaScript Interaktif: Bikin Website Hidup",
    description: "Tambahkan interaktivitas pada website-mu dengan JavaScript.",
    thumbnail: "https://img.youtube.com/vi/PkZNo7oNFgY/hqdefault.jpg", // Placeholder thumbnail
    videoUrl: "https://www.youtube.com/watch?v=PkZNo7oNFgY", // Placeholder URL
    date: "1 Februari 2024",
  },
];

const YouTubeUpdates: React.FC = () => {
  return (
    <section className="py-12 bg-muted/40">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">Pembaruan YouTube Terbaru</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dummyYouTubeVideos.map((video) => (
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
        <div className="text-center mt-10">
          <a href="https://www.youtube.com/@ProCodeCG" target="_blank" rel="noopener noreferrer">
            <Button size="lg" variant="default">Kunjungi Channel YouTube Kami</Button>
          </a>
        </div>
      </div>
    </section>
  );
};

export default YouTubeUpdates;