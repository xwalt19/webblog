import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { BookOpen, Gamepad, Globe, Smartphone, Lock, Cpu, Code, Users, CalendarDays } from "lucide-react"; // Icons for topics and activities
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const RegularEventsClasses: React.FC = () => {
  // State untuk mengontrol tampilan bagian 'Kegiatan' (Kelas & Acara)
  // Mengubah nilai awal menjadi string kosong agar tidak ada yang terpilih secara default
  const [selectedActivityView, setSelectedActivityView] = useState(""); 

  const topics = [
    {
      icon: BookOpen,
      title: "Algorithm & Data Structure",
      description: "Pelajari dasar-dasar pemrograman, struktur pola pikir programmer dengan pengenalan Pemrograman Prosedural vs Pemrograman Berorientasi Objek, Design Pattern, dll.",
    },
    {
      icon: Gamepad,
      title: "Game Programming",
      description: "Pelajari cara mengembangkan game menggunakan bahasa pemrograman sederhana.",
    },
    {
      icon: Globe,
      title: "Web Programming",
      description: "Pelajari cara mengembangkan web untuk berbagai tujuan.",
    },
    {
      icon: Smartphone,
      title: "Application Programming",
      description: "Pelajari cara merancang dan mengembangkan aplikasi di berbagai platform (iOS, Android, Blackberry, Windows).",
    },
    {
      icon: Lock,
      title: "Crypto Programming",
      description: "Pelajari cara membuat kode untuk kriptografi, untuk mengamankan aplikasi, perangkat lunak, dan komputer.",
    },
    {
      icon: Cpu,
      title: "Basic Hardware Programming",
      description: "Pelajari cara memprogram perangkat keras menggunakan Assembly atau C/C++.",
    },
  ];

  const runningClasses = [
    {
      name: "Programming for Kids",
      schedule: "Setiap Sabtu, 09.00 – 11.00 WIB",
      description: "Kelas yang dirancang khusus untuk memperkenalkan dasar-dasar pemrograman kepada anak-anak dengan cara yang menyenangkan dan interaktif.",
      icon: Code, // Menambahkan ikon
    },
  ];

  const regularEvents = [
    {
      name: "ProCodeCG codeMeetUp()",
      schedule: "Setiap Senin, 13.00 – 15.00 WIB",
      description: "Acara pertemuan rutin untuk para pengembang dan penggemar coding untuk berbagi pengetahuan, berkolaborasi, dan berdiskusi tentang tren teknologi terbaru.",
      icon: Users, // Menambahkan ikon
    },
  ];

  return (
    <div className="container mx-auto py-10 px-4">
      <section className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary">REGULAR EVENTS & CLASSES</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Temukan berbagai topik menarik, jadwal kelas rutin, dan acara komunitas yang kami selenggarakan untuk mengembangkan keterampilan IT Anda.
        </p>
      </section>

      <Separator className="my-12" />

      {/* Topics Section (Always visible) */}
      <section className="mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">Topik Pembelajaran</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topics.map((topic, index) => (
            <Card key={index} className="flex flex-col items-center text-center p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <topic.icon className="mb-4 text-primary" size={48} />
              <CardTitle className="text-xl mb-2">{topic.title}</CardTitle>
              <CardDescription className="text-muted-foreground">{topic.description}</CardDescription>
            </Card>
          ))}
        </div>
      </section>

      <Separator className="my-12" />

      {/* Filter Dropdown for Activities */}
      <div className="flex justify-center mb-10">
        <Select value={selectedActivityView} onValueChange={setSelectedActivityView}>
          <SelectTrigger className="w-full md:w-[250px]">
            <SelectValue placeholder="Pilih Kegiatan" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="allActivities">Semua Kegiatan</SelectItem>
            <SelectItem value="runningClasses">Kelas yang Sedang Berjalan</SelectItem>
            <SelectItem value="regularEvents">Acara Reguler</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Running Classes Section */}
      {(selectedActivityView === "allActivities" || selectedActivityView === "runningClasses") && (
        <section className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">Kelas yang Sedang Berjalan</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {runningClasses.map((cls, index) => (
              <Card key={index} className="p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="pb-4 flex flex-col items-center text-center"> {/* Tambahkan flex dan center */}
                  {cls.icon && <cls.icon className="mb-4 text-primary" size={48} />} {/* Render ikon */}
                  <CardTitle className="text-2xl font-semibold">{cls.name}</CardTitle>
                  <CardDescription className="text-primary font-medium">{cls.schedule}</CardDescription>
                </CardHeader>
                <CardContent className="text-muted-foreground text-center"> {/* Tambahkan text-center */}
                  {cls.description}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {(selectedActivityView === "allActivities" || selectedActivityView === "runningClasses") && <Separator className="my-12" />}

      {/* Regular Events Section */}
      {(selectedActivityView === "allActivities" || selectedActivityView === "regularEvents") && (
        <section className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">Acara Reguler</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {regularEvents.map((event, index) => (
              <Card key={index} className="p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="pb-4 flex flex-col items-center text-center"> {/* Tambahkan flex dan center */}
                  {event.icon && <event.icon className="mb-4 text-primary" size={48} />} {/* Render ikon */}
                  <CardTitle className="text-2xl font-semibold">{event.name}</CardTitle>
                  <CardDescription className="text-primary font-medium">{event.schedule}</CardDescription>
                </CardHeader>
                <CardContent className="text-muted-foreground text-center"> {/* Tambahkan text-center */}
                  {event.description}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      <div className="text-center mt-12">
        <Link to="/info">
          <Button>Kembali ke Info Program</Button>
        </Link>
      </div>
    </div>
  );
};

export default RegularEventsClasses;