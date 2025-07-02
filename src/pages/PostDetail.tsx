import React from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface BlogPost {
  id: string;
  title: string;
  date: string;
  content: string;
}

const dummyPosts: BlogPost[] = [
  {
    id: "1",
    title: "Memulai Perjalanan Blog Anda",
    date: "10 Oktober 2023",
    content: `
      <p>Memulai blog bisa menjadi pengalaman yang sangat memuaskan. Ini adalah platform Anda untuk berbagi pemikiran, ide, dan keahlian dengan dunia. Langkah pertama adalah memilih niche yang Anda minati dan memiliki pengetahuan tentangnya.</p>
      <p>Setelah itu, pilih platform blogging. Ada banyak pilihan, seperti WordPress, Blogger, atau bahkan membangun situs Anda sendiri dengan React seperti yang kita lakukan di sini. Pastikan platform yang Anda pilih sesuai dengan kebutuhan teknis dan tujuan Anda.</p>
      <p>Terakhir, mulailah menulis! Jangan takut untuk memulai dengan postingan yang sederhana. Kualitas akan meningkat seiring waktu dan pengalaman. Selamat ngeblog!</p>
    `,
  },
  {
    id: "2",
    title: "Tips Menulis Konten yang Menarik",
    date: "15 November 2023",
    content: `
      <p>Menulis konten yang menarik adalah kunci untuk mempertahankan pembaca Anda. Mulailah dengan judul yang menarik perhatian. Judul adalah hal pertama yang dilihat pembaca, jadi buatlah semenarik mungkin.</p>
      <p>Gunakan paragraf pendek dan poin-poin untuk membuat teks mudah dibaca. Orang cenderung memindai konten online, jadi struktur yang jelas sangat membantu. Sertakan gambar atau media lain untuk memecah teks dan membuat postingan lebih menarik secara visual.</p>
      <p>Akhiri dengan ajakan bertindak (call to action), seperti meminta komentar, berbagi postingan, atau mengunjungi tautan lain. Ini mendorong interaksi dan membuat pembaca tetap terlibat.</p>
    `,
  },
  {
    id: "3",
    title: "Mengoptimalkan Blog Anda untuk SEO",
    date: "20 Desember 2023",
    content: `
      <p>Optimasi Mesin Pencari (SEO) adalah proses meningkatkan visibilitas blog Anda di hasil pencarian. Salah satu langkah pertama adalah melakukan riset kata kunci. Temukan kata kunci yang relevan dengan niche Anda dan yang dicari oleh audiens target Anda.</p>
      <p>Integrasikan kata kunci ini secara alami ke dalam judul, subjudul, dan isi postingan Anda. Jangan melakukan "keyword stuffing" karena ini dapat merugikan peringkat Anda. Pastikan juga blog Anda memiliki kecepatan muat yang baik dan responsif di perangkat seluler.</p>
      <p>Membangun tautan balik (backlink) dari situs web berkualitas tinggi juga merupakan strategi SEO yang efektif. Semakin banyak tautan berkualitas yang mengarah ke blog Anda, semakin tinggi otoritas yang akan diberikan mesin pencari kepada Anda.</p>
    `,
  },
];

const PostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const post = dummyPosts.find((p) => p.id === id);

  if (!post) {
    return (
      <div className="text-center py-10">
        <h2 className="text-3xl font-bold mb-4">Postingan Tidak Ditemukan</h2>
        <p className="text-lg text-muted-foreground mb-6">Maaf, postingan yang Anda cari tidak ada.</p>
        <Link to="/">
          <Button>Kembali ke Beranda</Button>
        </Link>
      </div>
    );
  }

  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-3xl font-bold">{post.title}</CardTitle>
        <p className="text-sm text-muted-foreground">{post.date}</p>
      </CardHeader>
      <CardContent>
        <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />
        <div className="mt-8">
          <Link to="/">
            <Button variant="outline">Kembali ke Daftar Postingan</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default PostDetail;