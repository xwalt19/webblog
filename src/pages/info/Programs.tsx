"use client";

import React, { useState, useMemo } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  type: "kids" | "private" | "professional";
}

const programs: Program[] = [
  // Semua data program telah dihapus di sini.
  // Anda bisa menambahkan program baru di sini.
];

const ProgramsPage: React.FC = () => {
  const [selectedProgramType, setSelectedProgramType] = useState("all");

  const filteredPrograms = useMemo(() => {
    if (selectedProgramType === "all") {
      return programs;
    }
    return programs.filter(program => program.type === selectedProgramType);
  }, [selectedProgramType]);

  return (
    <div className="container mx-auto py-10 px-4 bg-muted/40 rounded-lg shadow-inner">
      <section className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary">Program Kami</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Jelajahi berbagai program coding dan pelatihan yang kami tawarkan, dirancang untuk semua tingkatan dan kebutuhan.
        </p>
        {/* Kalimat "Semua kelas dilakukan secara online." telah dihapus */}
      </section>

      {/* Filter Dropdown for Program Types */}
      <div className="flex justify-center mb-10">
        <Select value={selectedProgramType} onValueChange={setSelectedProgramType}>
          <SelectTrigger className="w-full md:w-[250px]">
            <SelectValue placeholder="Pilih Jenis Program" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Program</SelectItem>
            <SelectItem value="kids">Kelas Anak-anak</SelectItem>
            <SelectItem value="private">Kelas Privat & Bimbingan</SelectItem>
            <SelectItem value="professional">Pelatihan Profesional</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
        {filteredPrograms.map((program) => (
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

              {/* Display price table directly, without Accordion */}
              {!program.price && program.priceTable && program.priceTable.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-lg font-semibold text-primary mb-2">Rincian Harga</h3>
                  {program.priceTable.map((table, idx) => (
                    <Card key={idx} className="mb-4 shadow-sm">
                      <CardHeader className="p-3 pb-2">
                        <CardTitle className="text-lg font-semibold">{table.header[1]}</CardTitle>
                      </CardHeader>
                      <CardContent className="p-0">
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
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* Display topics directly, without Accordion, as a simple list */}
              {program.topics && program.topics.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-lg font-semibold text-primary mb-2">Topik yang Termasuk</h3>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    {program.topics.map((topic, topicIdx) => (
                      <li key={topicIdx} className="flex items-center gap-2">
                        {topic.icon && <topic.icon size={18} className="text-accent-foreground flex-shrink-0" />}
                        <span className="font-medium text-foreground">{topic.title}:</span> {topic.description}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPrograms.length === 0 && (
        <p className="text-center text-muted-foreground mt-8 text-lg">
          Tidak ada program yang tersedia. Silakan tambahkan program baru.
        </p>
      )}

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