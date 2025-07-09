import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Newspaper } from "lucide-react"; // Icon for articles

interface ExternalArticle {
  id: string;
  title: string;
  source: string;
  date: string;
  url: string;
  excerpt: string;
}

const dummyExternalArticles: ExternalArticle[] = [
  {
    id: "ea1",
    title: "Tren Teknologi 2024: AI dan Machine Learning Mendominasi",
    source: "TechDaily",
    date: "10 Mei 2024",
    url: "https://www.example.com/tech-trends-2024",
    excerpt: "Analisis mendalam tentang bagaimana kecerdasan buatan dan pembelajaran mesin akan membentuk masa depan teknologi.",
  },
  {
    id: "ea2",
    title: "Masa Depan Pendidikan Coding untuk Anak-anak",
    source: "EduTech Insights",
    date: "05 Mei 2024",
    url: "https://www.example.com/coding-for-kids-future",
    excerpt: "Diskusi tentang pentingnya literasi digital dan coding sejak usia dini.",
  },
  {
    id: "ea3",
    title: "Panduan Lengkap Memulai Karir di Bidang Data Science",
    source: "DataPro Blog",
    date: "01 Mei 2024",
    url: "https://www.example.com/data-science-career-guide",
    excerpt: "Langkah-langkah praktis untuk pemula yang ingin berkarir sebagai ilmuwan data.",
  },
  {
    id: "ea4",
    title: "Keamanan Siber: Ancaman Terbaru dan Cara Melindungi Diri",
    source: "CyberGuard News",
    date: "28 April 2024",
    url: "https://www.example.com/cybersecurity-threats",
    excerpt: "Pembaruan tentang ancaman siber terkini dan tips untuk menjaga keamanan online Anda.",
  },
];

const ExternalArticlesFeed: React.FC = () => {
  return (
    <section className="py-12 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">Artikel Pilihan dari Berbagai Sumber</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {dummyExternalArticles.map((article) => (
            <Card key={article.id} className="flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3 mb-2">
                  <Newspaper className="text-primary" size={28} />
                  <CardTitle className="text-xl font-semibold">{article.title}</CardTitle>
                </div>
                <CardDescription className="text-sm text-muted-foreground">
                  {article.source} - {article.date}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow p-6 pt-0">
                <p className="text-muted-foreground mb-4 line-clamp-2">{article.excerpt}</p>
                <a href={article.url} target="_blank" rel="noopener noreferrer" className="w-full">
                  <Button variant="outline" className="w-full">Baca Artikel</Button>
                </a>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="text-center mt-10">
          {/* Anda bisa menambahkan tautan ke halaman 'Semua Artikel Eksternal' jika ada */}
          <Link to="/blog"> {/* Mengarahkan ke blog internal sebagai placeholder */}
            <Button size="lg" variant="default">Jelajahi Lebih Banyak Artikel</Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ExternalArticlesFeed;