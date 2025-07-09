import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlayCircle } from "lucide-react"; // Menggunakan ikon PlayCircle untuk video

interface TikTokVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  videoUrl: string;
  date: string;
}

const dummyTikTokVideos: TikTokVideo[] = [
  {
    id: "tk1",
    title: "Tips Coding Cepat ala ProCodeCG",
    description: "Pelajari trik coding yang akan mempercepat workflow Anda.",
    thumbnail: "https://source.unsplash.com/random/400x250/?coding,tips", // Placeholder thumbnail
    videoUrl: "https://www.tiktok.com/@procodecg/video/1234567890", // Placeholder URL TikTok
    date: "10 Maret 2024",
  },
  {
    id: "tk2",
    title: "Challenge Coding Seru Minggu Ini!",
    description: "Ikuti challenge coding kami dan menangkan hadiah menarik.",
    thumbnail: "https://source.unsplash.com/random/400x250/?challenge,code", // Placeholder thumbnail
    videoUrl: "https://www.tiktok.com/@procodecg/video/0987654321", // Placeholder URL TikTok
    date: "18 Maret 2024",
  },
  {
    id: "tk3",
    title: "Behind The Scenes: Kelas Coding Anak",
    description: "Intip keseruan di balik layar kelas coding untuk anak-anak.",
    thumbnail: "https://source.unsplash.com/random/400x250/?kids,coding", // Placeholder thumbnail
    videoUrl: "https://www.tiktok.com/@procodecg/video/1122334455", // Placeholder URL TikTok
    date: "25 Maret 2024",
  },
];

const TikTokUpdates: React.FC = () => {
  return (
    <section className="py-12 bg-muted/40">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">Pembaruan TikTok Terbaru</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dummyTikTokVideos.map((video) => (
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
          <a href="https://www.tiktok.com/@procodecg" target="_blank" rel="noopener noreferrer">
            <Button size="lg" variant="default">Kunjungi Profil TikTok Kami</Button>
          </a>
        </div>
      </div>
    </section>
  );
};

export default TikTokUpdates;