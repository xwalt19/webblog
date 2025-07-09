import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CalendarDays, BellRing } from "lucide-react";

interface FixedItem {
  id: string;
  type: "news" | "schedule";
  title: string;
  description: string;
  date?: string; // Opsional untuk berita, wajib untuk jadwal
  time?: string; // Opsional untuk berita, wajib untuk jadwal
}

const dummyFixedItems: FixedItem[] = [
  {
    id: "f1",
    type: "schedule",
    title: "Pendaftaran Kelas Coding Angkatan Baru Dibuka!",
    description: "Jangan lewatkan kesempatan untuk bergabung dengan kelas coding kami. Daftar sekarang!",
    date: "1 April 2024",
    time: "09:00 WIB",
  },
  {
    id: "f2",
    type: "news",
    title: "ProCodeCG Meraih Penghargaan Inovasi Pendidikan",
    description: "Kami bangga mengumumkan ProCodeCG diakui atas kontribusinya dalam inovasi pendidikan teknologi.",
    date: "10 Maret 2024",
  },
  {
    id: "f3",
    type: "schedule",
    title: "Workshop Gratis: Pengantar AI untuk Anak",
    description: "Ikuti workshop interaktif kami untuk mengenal dasar-dasar Kecerdasan Buatan.",
    date: "20 April 2024",
    time: "14:00 WIB",
  },
  {
    id: "f4",
    type: "news",
    title: "Kolaborasi Baru dengan Tech Startup Lokal",
    description: "ProCodeCG menjalin kemitraan strategis untuk memperluas jangkauan program kami.",
    date: "1 April 2024",
  },
];

const FixedNewsSchedule: React.FC = () => {
  return (
    <section className="py-12 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">Berita & Jadwal Penting</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {dummyFixedItems.map((item) => (
            <Card key={item.id} className="flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3 mb-2">
                  {item.type === "schedule" ? (
                    <CalendarDays className="text-primary" size={28} />
                  ) : (
                    <BellRing className="text-yellow-500" size={28} />
                  )}
                  <CardTitle className="text-xl font-semibold">{item.title}</CardTitle>
                </div>
                {(item.date || item.time) && (
                  <CardDescription className="text-sm text-muted-foreground">
                    {item.date} {item.time && `pukul ${item.time}`}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent className="flex-grow p-6 pt-0">
                <p className="text-muted-foreground">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FixedNewsSchedule;