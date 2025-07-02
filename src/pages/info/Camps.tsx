import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CalendarDays, Code } from "lucide-react"; // Icons for visual appeal
import { toast } from "sonner"; // For placeholder action on day links

interface Camp {
  id: string;
  title: string;
  dates: string;
  description: string;
  dayLinks: { label: string; url: string }[];
}

const dummyCamps: Camp[] = [
  {
    id: "1",
    title: "Kids Half-Day Coding Camp",
    dates: "29 – 30 Des 2014",
    description: "Camp coding setengah hari untuk anak-anak.",
    dayLinks: [
      { label: "Day 1", url: "#" },
      { label: "Day 2", url: "#" },
      { label: "Day 3", url: "#" }, 
    ],
  },
  {
    id: "2",
    title: "Kids Half-Day Coding Camp for Beginner",
    dates: "28 – 30 Juni 2015",
    description: "Pengantar Game dan Membuat Game dengan Blockly dan Game Maker.",
    dayLinks: [
      { label: "Day 1", url: "#" },
      { label: "Day 2", url: "#" },
      { label: "Day 3", url: "#" },
    ],
  },
  {
    id: "3",
    title: "Kids Half-Day Coding Camp for Intermediate",
    dates: "6 – 8 Juli 2015",
    description: "Coding dengan JavaScript dan Python.",
    dayLinks: [
      { label: "Day 1", url: "#" },
      { label: "Day 2", url: "#" },
      { label: "Day 3", url: "#" },
    ],
  },
  {
    id: "4",
    title: "Kids Half-Day Coding Camp for Advanced",
    dates: "9 – 11 Juli 2015",
    description: "Minecraft Modding dengan ScriptCraft dan CanaryMod.",
    dayLinks: [
      { label: "Day 1", url: "#" },
      { label: "Day 2",
      url: "#" },
      { label: "Day 3", url: "#" },
    ],
  },
  {
    id: "5",
    title: "Kids Half-Day Coding Camp – Games Development",
    dates: "21 -23 Des 2015",
    description: "Blockly, GameMaker, JavaScript, Python, Minecraft Modding.",
    dayLinks: [
      { label: "Day 1", url: "#" },
      { label: "Day 2", url: "#" },
      { label: "Day 3", url: "#" },
    ],
  },
  {
    id: "6",
    title: "Kids Half-Day Coding Camp – Cryptography",
    dates: "25 – 27 Des 2015",
    description: "Pengantar Python, Caesar Cipher, Vigenere Cipher.",
    dayLinks: [
      { label: "Day 1", url: "#" },
      { label: "Day 2", url: "#" },
      { label: "Day 3", url: "#" },
    ],
  },
  {
    id: "7",
    title: "Kids Half-Day Coding Camp – Virus Antivirus",
    dates: "28 – 30 Des 2015",
    description: "Pengantar Python, Virus dan Antivirus Sederhana, Virus Enkripsi dan AntiVirus.",
    dayLinks: [
      { label: "Day 1", url: "#" },
      { label: "Day 2", url: "#" },
      { label: "Day 3", url: "#" },
    ],
  },
];

const Camps: React.FC = () => {
  const handleDayLinkClick = (campTitle: string, dayLabel: string) => {
    toast.info(`Detail untuk ${campTitle} - ${dayLabel} akan segera tersedia!`);
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <section className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary">Program Camps</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Jelajahi program kamp coding intensif kami yang dirancang untuk berbagai tingkat keahlian.
        </p>
      </section>

      <Separator className="my-12" />

      <section className="mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">Daftar Camp Kami</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dummyCamps.map((camp) => (
            <Card key={camp.id} className="flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3 mb-2">
                  <Code className="text-primary" size={28} />
                  <CardTitle className="text-xl font-semibold">{camp.title}</CardTitle>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CalendarDays size={16} />
                  <span>{camp.dates}</span>
                </div>
              </CardHeader>
              <CardContent className="flex-grow p-6 pt-0">
                <CardDescription className="mb-4 text-muted-foreground">
                  {camp.description}
                </CardDescription>
                <div className="flex flex-wrap gap-2 mt-4">
                  {camp.dayLinks.map((day, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => handleDayLinkClick(camp.title, day.label)}
                      className="hover:bg-accent hover:text-accent-foreground"
                    >
                      {day.label}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <div className="text-center mt-12">
        <Link to="/info">
          <Button>Kembali ke Info Program</Button>
        </Link>
      </div>
    </div>
  );
};

export default Camps;