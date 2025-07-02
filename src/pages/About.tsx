import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Lightbulb, Users, Handshake } from "lucide-react"; // Icons for values

interface TeamMember {
  name: string;
  role: string;
  avatarUrl: string;
  description: string;
}

const dummyTeamMembers: TeamMember[] = [
  {
    name: "Budi Santoso",
    role: "Pendiri & CEO",
    avatarUrl: "https://api.dicebear.com/8.x/lorelei/svg?seed=Budi",
    description: "Visioner di balik Blog Kurusiu, bersemangat untuk memberdayakan individu melalui pendidikan teknologi.",
  },
  {
    name: "Siti Aminah",
    role: "Kepala Konten & Editor",
    avatarUrl: "https://api.dicebear.com/8.x/lorelei/svg?seed=Siti",
    description: "Memastikan setiap artikel dan kursus berkualitas tinggi dan relevan dengan kebutuhan pembaca.",
  },
  {
    name: "Joko Susilo",
    role: "Pengembang Utama",
    avatarUrl: "https://api.dicebear.com/8.x/lorelei/svg?seed=Joko",
    description: "Membangun dan memelihara platform kami, memastikan pengalaman belajar yang mulus dan inovatif.",
  },
];

const AboutPage: React.FC = () => {
  return (
    <div className="container mx-auto py-10 px-4">
      <section className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary">Tentang Blog Kurusiu</h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
          Kami adalah platform yang berdedikasi untuk menyediakan sumber daya belajar teknologi berkualitas tinggi dan wawasan terbaru di dunia pemrograman.
        </p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        <Card className="p-6">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl font-semibold flex items-center gap-2">
              <Lightbulb className="text-yellow-500" size={28} /> Misi Kami
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Misi kami adalah untuk memberdayakan individu dari semua latar belakang untuk menguasai keterampilan teknologi yang relevan, membuka peluang karir baru, dan mendorong inovasi melalui pendidikan yang mudah diakses dan menarik.
            </p>
          </CardContent>
        </Card>
        <Card className="p-6">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl font-semibold flex items-center gap-2">
              <Users className="text-blue-500" size={28} /> Visi Kami
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Kami membayangkan masa depan di mana setiap orang memiliki akses ke pengetahuan teknologi yang mereka butuhkan untuk berkembang di era digital, menciptakan komunitas pembelajar yang dinamis dan saling mendukung.
            </p>
          </CardContent>
        </Card>
      </section>

      <section className="mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">Nilai-nilai Kami</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="text-center p-6">
            <Handshake className="mx-auto mb-4 text-green-500" size={40} />
            <CardTitle className="text-xl mb-2">Aksesibilitas</CardTitle>
            <CardContent className="text-muted-foreground p-0">
              Kami percaya pendidikan berkualitas harus dapat diakses oleh semua orang, tanpa memandang latar belakang atau lokasi.
            </CardContent>
          </Card>
          <Card className="text-center p-6">
            <Lightbulb className="mx-auto mb-4 text-purple-500" size={40} />
            <CardTitle className="text-xl mb-2">Inovasi</CardTitle>
            <CardContent className="text-muted-foreground p-0">
              Kami terus berinovasi dalam metode pengajaran dan konten untuk memastikan Anda selalu mendapatkan informasi terbaru.
            </CardContent>
          </Card>
          <Card className="text-center p-6">
            <Users className="mx-auto mb-4 text-red-500" size={40} />
            <CardTitle className="text-xl mb-2">Komunitas</CardTitle>
            <CardContent className="text-muted-foreground p-0">
              Kami membangun komunitas yang mendukung di mana pembelajar dapat berinteraksi, berbagi, dan tumbuh bersama.
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">Tim Kami</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {dummyTeamMembers.map((member, index) => (
            <Card key={index} className="flex flex-col items-center text-center p-6">
              <Avatar className="w-24 h-24 mb-4">
                <AvatarImage src={member.avatarUrl} alt={member.name} />
                <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <CardTitle className="text-xl mb-1">{member.name}</CardTitle>
              <p className="text-sm text-primary mb-3">{member.role}</p>
              <CardContent className="text-muted-foreground p-0">
                {member.description}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Separator className="my-16" />

      <section className="text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Siap Memulai Perjalanan Belajar Anda?</h2>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
          Jelajahi berbagai kursus kami atau selami wawasan terbaru dari blog kami.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/courses">
            <Button size="lg">Lihat Kursus</Button>
          </Link>
          <Link to="/blog">
            <Button size="lg" variant="outline">Kunjungi Blog</Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;