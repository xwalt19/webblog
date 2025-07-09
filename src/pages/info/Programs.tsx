"use client";

import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { BookOpen, Gamepad, Globe, Smartphone, Lock, Cpu, Code, Users, GraduationCap, DollarSign, CalendarDays } from "lucide-react";

interface PriceTier {
  participants: string;
  price: string;
}

interface Program {
  id: string;
  title: string;
  description: string;
  schedule?: string;
  registrationFee?: string;
  price?: string;
  priceTable?: {
    header: string[];
    rows: PriceTier[];
  }[];
  topics?: { icon: React.ElementType; title: string; description: string }[];
  icon?: React.ElementType;
}

const programs: Program[] = [
  {
    id: "kids-regular-coding-class",
    title: "Kids Regular Coding Class",
    description: "ProCodeCG Kids Programming Class is a regular event every Saturday 9 - 12.",
    schedule: "Setiap Sabtu, 09.00 – 12.00 WIB",
    registrationFee: "Rp50.000,-",
    icon: Code,
    priceTable: [
      {
        header: ["Jumlah Peserta", "Harga (1 Sesi - 90 menit)"],
        rows: [
          { participants: "Dua peserta", price: "Rp200.000" },
          { participants: "Tiga peserta", price: "Rp180.000" },
          { participants: "Empat peserta", price: "Rp160.000" },
          { participants: "Lima atau lebih peserta", price: "Rp150.000" },
        ],
      },
      {
        header: ["Jumlah Peserta", "Harga (2 Sesi - 180 menit)"],
        rows: [
          { participants: "Dua peserta", price: "Rp325.000" },
          { participants: "Tiga peserta", price: "Rp305.000" },
          { participants: "Empat peserta", price: "Rp285.000" },
          { participants: "Lima atau lebih peserta", price: "Rp275.000" },
        ],
      },
    ],
  },
  {
    id: "kids-weekday-coding-class",
    title: "Kids Weekday Coding Class",
    description: "ProCodeCG Kids Programming Class is held every Tuesday 16:00 - 17:30, Wednesday 16:30 - 18:00, Thursday & Friday 16:00 - 17:30.",
    schedule: "Setiap Selasa 16:00-17:30, Rabu 16:30-18:00, Kamis & Jumat 16:00-17:30 WIB",
    registrationFee: "Rp50.000,-",
    icon: CalendarDays,
    priceTable: [
      {
        header: ["Jumlah Peserta", "Harga per Sesi"],
        rows: [
          { participants: "Dua peserta", price: "Rp200.000" },
          { participants: "Tiga peserta", price: "Rp180.000" },
          { participants: "Empat peserta", price: "Rp160.000" },
          { participants: "Lima atau lebih peserta", price: "Rp150.000" },
        ],
      },
    ],
  },
  {
    id: "kids-coding-camp",
    title: "Kids Coding Camp",
    description: "ProCodeCG usually holds Kids Coding Camp event twice a year during school holiday. Each topic takes 3 - 5 days.",
    schedule: "Dua kali setahun selama liburan sekolah (3-5 hari per topik)",
    price: "Rp950.000 - Rp2.000.000",
    icon: GraduationCap,
  },
  {
    id: "online-private-class",
    title: "Online Private Class",
    description: "ProCodeCG provides private classes with customized curriculum and more flexible schedules.",
    price: "Rp500.000 per jam",
    icon: Users,
  },
  {
    id: "tutoring-coding-class",
    title: "Tutoring Coding Class",
    description: "ProCodeCG provides online tutoring class for high school and college students to help with their assignments, exams, competitions, etc. Each tutoring session is 90 minutes.",
    schedule: "Sesi 90 menit",
    icon: BookOpen,
    priceTable: [
      {
        header: ["Jumlah Peserta", "Harga per Sesi"],
        rows: [
          { participants: "Dua peserta", price: "Rp250.000" },
          { participants: "Tiga peserta", price: "Rp230.000" },
          { participants: "Empat peserta", price: "Rp210.000" },
          { participants: "Lima peserta", price: "Rp190.000" },
          { participants: "Enam peserta", price: "Rp170.000" },
        ],
      },
    ],
  },
  {
    id: "crash-course-customized-training",
    title: "Crash Course & Customized Training",
    description: "ProCodeCG provides customized curriculum and training. This program is usually for companies or adults.",
    price: "Mulai dari Rp1.000.000",
    icon: Cpu,
  },
  {
    id: "coding-mom",
    title: "Coding Mom",
    description: "Training Moms to be front-end developers. The topics included are GitHub, HTML, CSS, JavaScript, Bootstrap, PHP, MySQL.",
    icon: Smartphone,
    topics: [
      { icon: BookOpen, title: "Algorithm & Data Structure", description: "Pelajari dasar-dasar pemrograman, struktur pola pikir programmer dengan pengenalan Pemrograman Prosedural vs Pemrograman Berorientasi Objek, Design Pattern, dll." },
      { icon: Gamepad, title: "Game Programming", description: "Pelajari cara mengembangkan game menggunakan bahasa pemrograman sederhana." },
      { icon: Globe, title: "Web Programming", description: "Pelajari cara mengembangkan web untuk berbagai tujuan." },
      { icon: Smartphone, title: "Application Programming", description: "Pelajari cara merancang dan mengembangkan aplikasi di berbagai platform (iOS, Android, Blackberry, Windows)." },
      { icon: Lock, title: "Crypto Programming", description: "Pelajari cara membuat kode untuk kriptografi, untuk mengamankan aplikasi, perangkat lunak, dan komputer." },
      { icon: Cpu, title: "Basic Hardware Programming", description: "Pelajari cara memprogram perangkat keras menggunakan Assembly atau C/C++." },
    ],
  },
];

const ProgramsPage: React.FC = () => {
  return (
    <div className="container mx-auto py-10 px-4 bg-muted/40 rounded-lg shadow-inner">
      <section className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary">Program Kami</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Jelajahi berbagai program coding dan pelatihan yang kami tawarkan, dirancang untuk semua tingkatan dan kebutuhan.
        </p>
        <p className="text-md font-semibold text-primary mt-6">
          Semua kelas dilakukan secara online.
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
        {programs.map((program) => (
          <Card key={program.id} className="p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
            <CardHeader className="pb-4 flex-grow">
              <div className="flex items-center gap-4 mb-2">
                {program.icon && <program.icon className="text-primary" size={40} />}
                <CardTitle className="text-2xl font-bold">{program.title}</CardTitle>
              </div>
              <CardDescription className="text-muted-foreground">
                {program.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 pt-4">
              {program.schedule && (
                <p className="text-md text-foreground mb-2 flex items-center gap-2">
                  <CalendarDays size={18} className="text-muted-foreground" />
                  Jadwal: <span className="font-medium">{program.schedule}</span>
                </p>
              )}
              {program.registrationFee && (
                <p className="text-md text-foreground mb-4 flex items-center gap-2">
                  <DollarSign size={18} className="text-muted-foreground" />
                  Biaya Pendaftaran: <span className="font-medium">{program.registrationFee}</span>
                </p>
              )}

              {program.price && (
                <p className="text-md text-foreground mb-4 flex items-center gap-2">
                  <DollarSign size={18} className="text-muted-foreground" />
                  Harga: <span className="font-medium">{program.price}</span>
                </p>
              )}

              {/* Display price table directly if available and no single price string */}
              {!program.price && program.priceTable && program.priceTable.length > 0 && (
                <div className="mt-4">
                  {program.priceTable.map((table, idx) => (
                    <div key={idx} className="mb-6 border rounded-md overflow-hidden">
                      <h3 className="text-lg font-semibold bg-muted p-3 border-b">{table.header[1]}</h3>
                      <Table className="w-full">
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[150px]">{table.header[0]}</TableHead>
                            <TableHead className="text-right">{table.header[1]}</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {table.rows.map((row, rowIndex) => (
                            <TableRow key={rowIndex}>
                              <TableCell className="font-medium">{row.participants}</TableCell>
                              <TableCell className="text-right">{row.price}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ))}
                </div>
              )}

              {program.topics && program.topics.length > 0 && (
                <Accordion type="single" collapsible className="w-full mt-4">
                  <AccordionItem value="topics-included">
                    <AccordionTrigger className="text-lg font-semibold text-primary hover:no-underline">
                      Topik yang Termasuk
                    </AccordionTrigger>
                    <AccordionContent className="pt-2">
                      <div className="grid grid-cols-1 gap-4">
                        {program.topics.map((topic, topicIdx) => (
                          <Card key={topicIdx} className="p-4 bg-muted/30">
                            <div className="flex items-center gap-3 mb-2">
                              <topic.icon size={24} className="text-accent-foreground" />
                              <h4 className="text-lg font-semibold">{topic.title}</h4>
                            </div>
                            <p className="text-sm text-muted-foreground">{topic.description}</p>
                          </Card>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Separator className="my-12" />

      <div className="text-center mt-12">
        <Link to="/">
          <Button>Kembali ke Beranda</Button>
        </Link>
      </div>
    </div>
  );
};

export default ProgramsPage;