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
    title: "Yuk, Bikin Blog Seru Pertamamu!",
    date: "10 Oktober 2023",
    content: `
      <p>Membuat blog itu seperti punya buku cerita sendiri di internet! Kamu bisa berbagi apa saja yang kamu suka, misalnya cerita petualanganmu, gambar-gambar lucu, atau tips bermain game. Langkah pertama, pikirkan apa yang paling kamu suka dan ingin kamu ceritakan.</p>
      <p>Lalu, pilih tempat untuk blogmu. Ada banyak pilihan, seperti membuat blog di platform khusus anak-anak atau bahkan membangunnya sendiri dengan bantuan orang dewasa, seperti yang kita lakukan di sini dengan React. Pastikan tempat yang kamu pilih itu aman dan seru!</p>
      <p>Terakhir, mulai menulis! Jangan takut kalau tulisan pertamamu belum sempurna. Semakin sering kamu menulis, tulisanmu akan semakin keren. Selamat ngeblog, jagoan!</p>
    `,
  },
  {
    id: "2",
    title: "Rahasia Menulis Cerita Blog yang Bikin Betah Baca",
    date: "15 November 2023",
    content: `
      <p>Mau tulisanmu dibaca banyak teman? Ini dia rahasianya! Mulai dengan judul yang bikin penasaran, seperti "Petualangan Si Kucing Ajaib" atau "Cara Bikin Robot dari Kardus". Judul itu seperti pintu masuk ke ceritamu, jadi harus menarik!</p>
      <p>Gunakan kalimat-kalimat pendek dan mudah dimengerti. Kamu juga bisa pakai daftar poin-poin biar ceritamu gampang dibaca. Jangan lupa tambahkan gambar-gambar lucu atau video seru biar blogmu makin hidup dan tidak membosankan.</p>
      <p>Di akhir tulisan, ajak teman-temanmu untuk berkomentar atau berbagi cerita mereka. Misalnya, "Apa petualangan seru yang pernah kamu alami?" Ini akan membuat mereka merasa diajak ngobrol dan ingin kembali lagi ke blogmu.</p>
    `,
  },
  {
    id: "3",
    title: "Biar Blogmu Gampang Ditemukan di Internet!",
    date: "20 Desember 2023",
    content: `
      <p>Pernah mencari sesuatu di Google? Nah, biar blogmu juga gampang ditemukan teman-teman, kita perlu sedikit "sihir" yang namanya SEO. SEO itu seperti petunjuk arah rahasia yang membantu mesin pencari menemukan blogmu.</p>
      <p>Caranya, gunakan kata-kata penting yang sering dicari orang di judul dan isi blogmu. Misalnya, kalau blogmu tentang "robot mainan", pastikan kata "robot mainan" ada di judul dan beberapa kali di dalam tulisanmu. Tapi jangan terlalu banyak ya, nanti malah aneh!</p>
      <p>Pastikan juga blogmu cepat dibuka dan bisa dilihat dengan baik di handphone atau tablet. Semakin bagus blogmu, semakin sering mesin pencari akan merekomendasikannya kepada teman-teman yang mencari informasi tentang topik yang kamu tulis. Jadi, blogmu bisa jadi terkenal!</p>
    `,
  },
  {
    id: "4",
    title: "Sihir JavaScript: Bikin Website Jadi Hidup!",
    date: "25 Januari 2024",
    content: `
      <p>Pernah lihat tombol di website yang bisa berubah warna saat disentuh? Atau gambar yang bergerak saat kamu klik? Itu semua adalah sihir dari JavaScript! JavaScript adalah bahasa pemrograman yang membuat website kita jadi lebih interaktif dan seru.</p>
      <p>Bayangkan website itu seperti rumah. HTML adalah kerangka rumahnya, CSS adalah cat dan hiasannya, nah JavaScript itu seperti listrik dan semua alat yang bikin rumah itu berfungsi, seperti lampu yang bisa nyala atau pintu yang bisa dibuka otomatis.</p>
      <p>Dengan JavaScript, kita bisa membuat game sederhana, kalkulator, atau bahkan animasi lucu di website. Belajar JavaScript itu seperti belajar mantra baru yang bisa membuat website kita jadi lebih hidup dan menyenangkan!</p>
    `,
  },
  {
    id: "5",
    title: "Yuk, Bikin Aplikasi Keren Pakai React!",
    date: "01 Februari 2024",
    content: `
      <p>React itu seperti kotak LEGO raksasa untuk membuat aplikasi di internet! Daripada membangun semuanya dari awal, kita bisa menggunakan "balok-balok" kecil yang sudah jadi (disebut komponen) dan menggabungkannya menjadi aplikasi yang besar dan canggih.</p>
      <p>Misalnya, kamu mau bikin aplikasi daftar belanjaan. Dengan React, kamu bisa bikin satu balok untuk "item belanjaan", satu balok untuk "tombol tambah", dan satu balok lagi untuk "daftar belanjaan". Lalu, kamu tinggal susun balok-balok itu jadi aplikasi yang utuh.</p>
      <p>React sangat populer karena membuat proses pembuatan aplikasi jadi lebih cepat dan mudah. Banyak aplikasi besar yang kamu pakai sehari-hari juga dibuat dengan React, lho! Jadi, kalau kamu belajar React, kamu bisa bikin aplikasi keren seperti mereka!</p>
    `,
  },
  {
    id: "6",
    title: "Python: Si Pintar Pengolah Data!",
    date: "10 Februari 2024",
    content: `
      <p>Python adalah bahasa pemrograman yang sangat pintar, terutama kalau urusannya dengan data! Data itu seperti kumpulan informasi, misalnya daftar nama temanmu, nilai ulangan, atau berapa banyak es krim yang terjual di kantin.</p>
      <p>Dengan Python, kita bisa meminta komputer untuk menghitung, mengurutkan, atau bahkan menemukan pola-pola menarik dari data-data itu. Misalnya, kamu bisa tahu siapa temanmu yang paling banyak punya koleksi stiker, atau rasa es krim apa yang paling disukai.</p>
      <p>Python juga dipakai untuk membuat game, aplikasi, dan bahkan membantu robot pintar. Belajar Python itu seperti punya teman super pintar yang siap membantumu memahami dunia angka dan informasi dengan cara yang menyenangkan!</p>
    `,
  },
  {
    id: "7",
    title: "Tailwind CSS: Bikin Tampilan Website Makin Cantik!",
    date: "05 Maret 2024",
    content: `
      <p>Pernah ingin membuat website-mu terlihat super keren dan rapi? Nah, ada alat ajaib bernama Tailwind CSS! Tailwind itu seperti kotak pensil warna dan penggaris yang lengkap banget untuk mendesain website.</p>
      <p>Biasanya, kita harus menulis banyak kode untuk mengatur warna, ukuran, atau posisi setiap bagian di website. Tapi dengan Tailwind, kita tinggal pakai "nama-nama" pendek yang sudah ada, seperti "text-blue-500" untuk teks biru, atau "p-4" untuk memberi jarak.</p>
      <p>Ini membuat proses mendesain jadi lebih cepat dan mudah, seperti menyusun balok-balok desain. Jadi, kamu bisa fokus pada ide-ide kreatifmu dan membuat website yang tampilannya memukau tanpa harus pusing dengan banyak kode desain!</p>
    `,
  },
  {
    id: "8",
    title: "JavaScript Sabar: Nunggu Dulu Baru Jalan!",
    date: "12 April 2024",
    content: `
      <p>Pernahkah kamu membuka website dan melihat ada bagian yang masih loading atau menunggu sesuatu sebelum muncul? Itu karena JavaScript sedang bekerja dengan sabar! Konsep ini namanya "asynchronous" atau "async/await".</p>
      <p>Bayangkan kamu sedang memesan makanan di restoran. Kamu tidak akan diam saja menunggu makananmu jadi, kan? Kamu bisa sambil minum atau ngobrol. Nah, JavaScript juga begitu. Dia bisa melakukan pekerjaan lain sambil menunggu data dari internet atau menunggu gambar selesai dimuat.</p>
      <p>Jadi, website-mu tidak akan "macet" atau berhenti total hanya karena menunggu satu hal. JavaScript akan menyelesaikan tugas lain dulu, dan saat yang ditunggu sudah siap, dia akan melanjutkan pekerjaannya. Ini membuat website jadi lebih cepat dan nyaman digunakan!</p>
    `,
  },
  {
    id: "9",
    title: "Jadi Detektif Kode: Cari dan Perbaiki Kesalahan!",
    date: "20 Mei 2025",
    content: `
      <p>Saat kita menulis kode, kadang ada saja kesalahan kecil yang membuat program kita tidak berjalan sesuai keinginan. Kesalahan ini sering disebut "bug", seperti serangga kecil yang mengganggu. Nah, tugas kita adalah menjadi detektif kode untuk menemukan dan memperbaiki bug itu!</p>
      <p>Proses mencari dan memperbaiki bug ini namanya "debugging". Ini seperti bermain teka-teki. Kita harus melihat kode kita dengan teliti, mencari tahu di mana letak kesalahannya, dan kemudian memperbaikinya. Kadang butuh kesabaran, tapi seru juga lho!</p>
      <p>Ada banyak alat yang bisa membantu kita jadi detektif kode yang hebat, seperti "console.log" yang bisa menampilkan pesan rahasia dari kode kita. Dengan debugging, kita jadi lebih pintar dan bisa membuat program yang bekerja dengan sempurna!</p>
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
        <p className="text-lg text-muted-foreground mb-6">Maaf, postingan yang kamu cari tidak ada.</p>
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