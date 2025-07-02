import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CalendarDays, Code, Gamepad, Smartphone } from "lucide-react"; // Icons for visual appeal

interface TrainingProgram {
  id: string;
  title: string;
  dates: string;
  description: string;
  icon: React.ElementType; // Icon component from lucide-react
}

const dummyTrainingPrograms: TrainingProgram[] = [
  {
    id: "1",
    title: "Training on Games Development",
    dates: "10 - 12 Des 2014",
    description: "Pelatihan intensif untuk mengembangkan game interaktif menggunakan teknologi terbaru.",
    icon: Gamepad,
  },
  {
    id: "2",
    title: "Intensive Training on Apps Development",
    dates: "18 Maret 2015",
    description: "Program pelatihan mendalam untuk membangun aplikasi lintas platform yang responsif dan fungsional.",
    icon: Smartphone,
  },
  {
    id: "3",
    title: "iOS App Development Training with DyCode",
    dates: "7 April 2015",
    description: "Pelatihan khusus pengembangan aplikasi iOS bekerja sama dengan DyCode, fokus pada Swift dan Xcode.",
    icon: Code, // Menggunakan ikon Code sebagai placeholder untuk pengembangan aplikasi
  },
];

const Training: React.FC = () => {
  return (
    <div className="container mx-auto py-10 px-4">
      <section className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary">Program Training</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Jelajahi program pelatihan khusus kami yang dirancang untuk meningkatkan keahlian Anda di berbagai bidang teknologi.
        </p>
      </section>

      <section className="mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dummyTrainingPrograms.map((program) => (
            <Card key={program.id} className="flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3 mb-2">
                  <program.icon className="text-primary" size={28} />
                  <CardTitle className="text-xl font-semibold">{program.title}</CardTitle>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CalendarDays size={16} />
                  <span>{program.dates}</span>
                </div>
              </CardHeader>
              <CardContent className="flex-grow p-6 pt-0">
                <CardDescription className="mb-4 text-muted-foreground">
                  {program.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <div className="text-center mt-12">
        <Link to="/info">
          <Button>Kembali ke Activity Program</Button>
        </Link>
      </div>
    </div>
  );
};

export default Training;