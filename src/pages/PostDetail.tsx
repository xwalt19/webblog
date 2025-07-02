import React from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge"; // Import Badge component

interface BlogPost {
  id: string;
  title: string;
  date: string;
  content: string;
  tags: string[]; // Tambahkan properti tags
}

const dummyPosts: BlogPost[] = [
  {
    id: "1",
    title: "Yuk Bikin Blog Seru Pertamamu",
    date: "10 Oktober 2023",
    content: `
      <p>Membuat blog itu seperti punya buku cerita sendiri di internet. Kamu bisa berbagi apa saja yang kamu suka, misalnya cerita petualanganmu, gambar-gambar lucu, atau tips bermain game. Ini adalah tempat di mana suaramu bisa didengar oleh banyak orang di seluruh dunia. Langkah pertama yang paling penting adalah memikirkan apa yang paling kamu suka dan ingin kamu ceritakan. Apakah itu tentang hobi barumu, ulasan game favorit, atau mungkin petualangan seru saat liburan?</p>
      <p>Setelah kamu punya ide, saatnya memilih "rumah" untuk blogmu. Ada banyak pilihan platform yang bisa kamu gunakan, mulai dari yang sederhana dan mudah digunakan untuk pemula, hingga yang lebih canggih seperti membangunnya sendiri dengan bantuan orang dewasa, seperti yang kita lakukan di sini dengan React. Yang terpenting, pastikan tempat yang kamu pilih itu aman, mudah diakses, dan seru untuk kamu jelajahi.</p>
      <p>Terakhir, dan ini yang paling menyenangkan, mulailah menulis! Jangan takut kalau tulisan pertamamu belum sempurna atau kamu merasa sedikit canggung. Setiap penulis hebat pasti memulai dari nol. Semakin sering kamu menulis, semakin kamu akan menemukan gaya bahasamu sendiri, dan tulisanmu akan semakin keren dan menarik. Ingat, blog adalah perjalanan, bukan tujuan. Selamat ngeblog, jagoan!</p>
    `,
    tags: ["pemula", "blogging", "menulis"],
  },
  {
    id: "2",
    title: "Rahasia Menulis Cerita Blog yang Bikin Betah Baca",
    date: "15 November 2023",
    content: `
      <p>Mau tulisanmu dibaca banyak teman dan membuat mereka betah berlama-lama di blogmu? Ini dia beberapa rahasia yang bisa kamu coba. Pertama, mulailah dengan judul yang bikin penasaran. Judul itu seperti pintu masuk ke ceritamu, jadi harus menarik perhatian. Coba gunakan pertanyaan, angka, atau kata-kata yang memancing rasa ingin tahu, seperti "Petualangan Si Kucing Ajaib yang Mengubah Dunia" atau "5 Cara Gampang Bikin Robot dari Kardus Bekas".</p>
      <p>Kedua, gunakan kalimat-kalimat pendek dan mudah dimengerti. Hindari paragraf yang terlalu panjang karena bisa membuat pembaca cepat bosan. Kamu juga bisa pakai daftar poin-poin atau sub-judul untuk memecah teks dan membuatnya lebih mudah dicerna. Ini akan membantu pembaca mengikuti alur ceritamu tanpa merasa kewalahan.</p>
      <p>Ketiga, jangan lupa tambahkan gambar-gambar lucu, ilustrasi menarik, atau video seru yang relevan dengan ceritamu. Visual akan membuat blogmu makin hidup dan tidak membosankan. Terakhir, di akhir tulisan, ajak teman-temanmu untuk berkomentar atau berbagi cerita mereka sendiri. Misalnya, "Apa petualangan seru yang pernah kamu alami?" atau "Punya tips lain untuk menulis blog?" Ini akan membuat mereka merasa diajak ngobrol dan ingin kembali lagi ke blogmu untuk berinteraksi.</p>
    `,
    tags: ["konten", "menulis", "tips"],
  },
  {
    id: "3",
    title: "Biar Blogmu Gampang Ditemukan di Internet",
    date: "20 Desember 2023",
    content: `
      <p>Pernah mencari sesuatu di Google dan menemukan banyak hasil? Nah, biar blogmu juga gampang ditemukan teman-teman, kita perlu sedikit "sihir" yang namanya SEO (Search Engine Optimization). SEO itu seperti petunjuk arah rahasia yang membantu mesin pencari seperti Google menemukan dan menampilkan blogmu di hasil pencarian teratas.</p>
      <p>Caranya, gunakan kata-kata penting atau "kata kunci" yang sering dicari orang di judul dan isi blogmu. Misalnya, kalau blogmu tentang "robot mainan", pastikan kata "robot mainan" ada di judul, di paragraf pertama, dan beberapa kali di dalam tulisanmu. Tapi ingat, jangan terlalu banyak ya, nanti malah aneh dan tidak alami. Gunakan kata kunci secara bijak agar tulisanmu tetap enak dibaca.</p>
      <p>Selain itu, pastikan blogmu cepat dibuka dan bisa dilihat dengan baik di handphone atau tablet. Banyak orang mengakses internet dari perangkat seluler, jadi blog yang responsif sangat penting. Semakin bagus blogmu dalam hal kecepatan dan tampilan di berbagai perangkat, semakin sering mesin pencari akan merekomendasikannya kepada teman-teman yang mencari informasi tentang topik yang kamu tulis. Dengan begitu, blogmu bisa jadi terkenal dan menjangkau lebih banyak pembaca!</p>
    `,
    tags: ["SEO", "internet", "visibilitas"],
  },
  {
    id: "4",
    title: "Sihir JavaScript Bikin Website Jadi Hidup",
    date: "25 Januari 2024",
    content: `
      <p>Pernah lihat tombol di website yang bisa berubah warna saat disentuh? Atau gambar yang bergerak saat kamu klik? Itu semua adalah sihir dari JavaScript! JavaScript adalah bahasa pemrograman yang membuat website kita jadi lebih interaktif, dinamis, dan seru. Tanpa JavaScript, website akan terasa kaku, seperti buku gambar yang tidak bisa bergerak.</p>
      <p>Bayangkan website itu seperti rumah. HTML adalah kerangka rumahnya, yang menentukan di mana dinding, pintu, dan jendela berada. CSS adalah cat dan hiasannya, yang membuat rumah terlihat cantik dengan warna dan gaya yang menarik. Nah, JavaScript itu seperti listrik dan semua alat yang bikin rumah itu berfungsi, seperti lampu yang bisa nyala, pintu yang bisa dibuka otomatis, atau bahkan robot pembersih yang bergerak sendiri.</p>
      <p>Dengan JavaScript, kita bisa membuat game sederhana langsung di browser, kalkulator yang berfungsi, formulir interaktif, atau bahkan animasi lucu yang membuat pengunjung betah berlama-lama. Belajar JavaScript itu seperti belajar mantra baru yang bisa membuat website kita jadi lebih hidup, responsif, dan menyenangkan untuk digunakan. Ini adalah langkah penting untuk menjadi seorang "penyihir" web yang handal!</p>
    `,
    tags: ["JavaScript", "web", "interaktif"],
  },
  {
    id: "5",
    title: "Yuk Bikin Aplikasi Keren Pakai React",
    date: "01 Februari 2024",
    content: `
      <p>React itu seperti kotak LEGO raksasa untuk membuat aplikasi di internet. Daripada membangun semuanya dari awal, kita bisa menggunakan "balok-balok" kecil yang sudah jadi (disebut komponen) dan menggabungkannya menjadi aplikasi yang besar dan canggih. Setiap balok ini punya tugasnya sendiri, misalnya satu balok untuk tombol, satu balok untuk daftar, dan satu balok untuk gambar.</p>
      <p>Misalnya, kamu mau bikin aplikasi daftar belanjaan. Dengan React, kamu bisa bikin satu balok untuk "item belanjaan" yang bisa kamu centang, satu balok untuk "tombol tambah" item baru, dan satu balok lagi untuk "daftar belanjaan" secara keseluruhan. Lalu, kamu tinggal susun balok-balok itu jadi aplikasi yang utuh dan berfungsi dengan baik. Keuntungan menggunakan balok-balok ini adalah kamu bisa menggunakannya berulang kali di tempat yang berbeda tanpa harus menulis ulang kode.</p>
      <p>React sangat populer di kalangan pengembang karena membuat proses pembuatan aplikasi jadi lebih cepat, mudah, dan terorganisir. Banyak aplikasi besar yang kamu pakai sehari-hari, seperti Facebook, Instagram, atau Netflix, juga dibuat dengan React, lho! Jadi, kalau kamu belajar React, kamu bisa punya kemampuan untuk membuat aplikasi keren seperti mereka dan menjadi bagian dari dunia teknologi yang terus berkembang.</p>
    `,
    tags: ["React", "aplikasi web", "pemrograman"],
  },
  {
    id: "6",
    title: "Python Si Pintar Pengolah Data",
    date: "10 Februari 2024",
    content: `
      <p>Python adalah bahasa pemrograman yang sangat pintar, terutama kalau urusannya dengan data. Data itu seperti kumpulan informasi, misalnya daftar nama temanmu, nilai ulangan di sekolah, berapa banyak es krim yang terjual di kantin, atau bahkan data cuaca. Python punya kemampuan luar biasa untuk mengolah, menganalisis, dan memahami data-data ini.</p>
      <p>Dengan Python, kita bisa meminta komputer untuk menghitung rata-rata nilai, mengurutkan daftar nama dari A sampai Z, atau bahkan menemukan pola-pola menarik dari data penjualan es krim. Misalnya, kamu bisa tahu rasa es krim apa yang paling disukai di hari Jumat, atau bulan apa penjualan es krim paling tinggi. Ini sangat berguna untuk membuat keputusan yang lebih baik berdasarkan informasi yang ada.</p>
      <p>Selain untuk mengolah data, Python juga dipakai untuk membuat game, aplikasi web, dan bahkan membantu robot pintar atau kecerdasan buatan. Belajar Python itu seperti punya teman super pintar yang siap membantumu memahami dunia angka dan informasi dengan cara yang menyenangkan dan mudah. Ini adalah keterampilan yang sangat berharga di era digital saat ini!</p>
    `,
    tags: ["Python", "data science", "pemrograman"],
  },
  {
    id: "7",
    title: "Tailwind CSS Bikin Tampilan Website Makin Cantik",
    date: "05 Maret 2024",
    content: `
      <p>Pernah ingin membuat website-mu terlihat super keren, rapi, dan modern tanpa harus pusing dengan banyak kode desain? Nah, ada alat ajaib bernama Tailwind CSS. Tailwind itu seperti kotak pensil warna dan penggaris yang lengkap banget untuk mendesain website, tapi dalam bentuk kode yang sangat efisien.</p>
      <p>Biasanya, kita harus menulis banyak baris kode CSS untuk mengatur warna, ukuran, posisi, atau jenis huruf setiap bagian di website. Tapi dengan Tailwind, kita tinggal pakai "nama-nama" pendek yang sudah ada (disebut utility classes) langsung di dalam kode HTML kita. Misalnya, untuk membuat teks biru dengan ukuran besar, kamu cukup menambahkan kelas seperti "text-blue-500 text-xl font-bold". Ini sangat intuitif dan cepat.</p>
      <p>Pendekatan ini membuat proses mendesain jadi lebih cepat dan mudah, seperti menyusun balok-balok desain. Kamu bisa dengan cepat mengubah tampilan elemen tanpa harus beralih antar file CSS dan HTML. Jadi, kamu bisa fokus pada ide-ide kreatifmu dan membuat website yang tampilannya memukau dan responsif di berbagai ukuran layar, tanpa harus pusing dengan banyak kode desain yang rumit. Tailwind CSS adalah pilihan yang tepat untuk membuat website-mu tampil profesional dan menarik perhatian.</p>
    `,
    tags: ["Tailwind CSS", "desain web", "styling"],
  },
  {
    id: "8",
    title: "JavaScript Sabar Nunggu Dulu Baru Jalan",
    date: "12 April 2024",
    content: `
      <p>Pernahkah kamu membuka website dan melihat ada bagian yang masih loading atau menunggu sesuatu sebelum muncul sepenuhnya? Itu karena JavaScript sedang bekerja dengan sabar di belakang layar. Konsep ini namanya "asynchronous" atau "async/await", dan ini adalah salah satu fitur paling kuat dari JavaScript yang membuat website terasa cepat dan responsif.</p>
      <p>Bayangkan kamu sedang memesan makanan di restoran. Kamu tidak akan diam saja menunggu makananmu jadi, kan? Kamu bisa sambil minum, ngobrol dengan teman, atau melihat menu lain. Nah, JavaScript juga begitu. Dia bisa melakukan pekerjaan lain (misalnya menampilkan bagian lain dari website) sambil menunggu data dari internet (seperti gambar atau informasi dari server) atau menunggu tugas yang memakan waktu selesai.</p>
      <p>Jadi, website-mu tidak akan "macet" atau berhenti total hanya karena menunggu satu hal. JavaScript akan menyelesaikan tugas lain dulu, dan saat yang ditunggu sudah siap, dia akan melanjutkan pekerjaannya. Ini membuat pengalaman pengguna jadi lebih mulus, karena website tetap interaktif meskipun ada proses yang sedang berjalan di latar belakang. Memahami asynchronous JavaScript adalah kunci untuk membangun aplikasi web yang modern dan efisien.</p>
    `,
    tags: ["JavaScript", "asynchronous", "web performance"],
  },
  {
    id: "9",
    title: "Jadi Detektif Kode Cari dan Perbaiki Kesalahan",
    date: "20 Mei 2025",
    content: `
      <p>Saat kita menulis kode, kadang ada saja kesalahan kecil yang membuat program kita tidak berjalan sesuai keinginan. Kesalahan ini sering disebut "bug", seperti serangga kecil yang mengganggu sistem. Nah, tugas kita sebagai programmer adalah menjadi detektif kode untuk menemukan dan memperbaiki bug itu. Proses mencari dan memperbaiki bug ini namanya "debugging", dan ini adalah salah satu keterampilan paling penting yang harus dimiliki seorang pengembang.</p>
      <p>Debugging itu seperti bermain teka-teki yang menantang. Kita harus melihat kode kita dengan teliti, membaca pesan kesalahan (jika ada), dan mencoba memahami di mana letak kesalahannya. Kadang, bug bisa sangat tersembunyi dan butuh kesabaran ekstra untuk menemukannya. Kita bisa menggunakan berbagai teknik, seperti menambahkan "console.log" untuk menampilkan nilai variabel di titik tertentu, atau menggunakan alat debugger yang canggih untuk melacak alur eksekusi kode langkah demi langkah.</p>
      <p>Meskipun terkadang frustrasi, proses debugging sebenarnya sangat mendidik. Setiap kali kamu berhasil menemukan dan memperbaiki bug, kamu akan belajar lebih banyak tentang bagaimana kode bekerja dan bagaimana cara menulis kode yang lebih baik di masa depan. Ini akan membuatmu menjadi programmer yang lebih pintar, lebih teliti, dan mampu membuat program yang bekerja dengan sempurna. Jadi, siapkan kaca pembesarmu dan mari berburu bug!</p>
    `,
    tags: ["debugging", "pemrograman", "error handling"],
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
        <div className="flex flex-wrap gap-1 mt-2">
          {post.tags.map(tag => (
            <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
          ))}
        </div>
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