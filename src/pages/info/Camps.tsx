import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CalendarDays, Code } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

interface Camp {
  id: string;
  titleKey: string;
  dates: string;
  descriptionKey: string;
  dayLinks: { label: string; url: string }[];
}

const dummyCamps: Camp[] = [
  {
    id: "1",
    titleKey: "camps data.camp1 title",
    dates: "29 – 30 Des 2014",
    descriptionKey: "camps data.camp1 desc",
    dayLinks: [
      { label: "Day 1", url: "#" },
      { label: "Day 2", url: "#" },
      { label: "Day 3", url: "#" }, 
    ],
  },
  {
    id: "2",
    titleKey: "camps data.camp2 title",
    dates: "28 – 30 Juni 2015",
    descriptionKey: "camps data.camp2 desc",
    dayLinks: [
      { label: "Day 1", url: "#" },
      { label: "Day 2", url: "#" },
      { label: "Day 3", url: "#" },
    ],
  },
  {
    id: "3",
    titleKey: "camps data.camp3 title",
    dates: "6 – 8 Juli 2015",
    descriptionKey: "camps data.camp3 desc",
    dayLinks: [
      { label: "Day 1", url: "#" },
      { label: "Day 2", url: "#" },
      { label: "Day 3", url: "#" },
    ],
  },
  {
    id: "4",
    titleKey: "camps data.camp4 title",
    dates: "9 – 11 Juli 2015",
    descriptionKey: "camps data.camp4 desc",
    dayLinks: [
      { label: "Day 1", url: "#" },
      { label: "Day 2",
      url: "#" },
      { label: "Day 3", url: "#" },
    ],
  },
  {
    id: "5",
    titleKey: "camps data.camp5 title",
    dates: "21 -23 Des 2015",
    descriptionKey: "camps data.camp5 desc",
    dayLinks: [
      { label: "Day 1", url: "#" },
      { label: "Day 2", url: "#" },
      { label: "Day 3", url: "#" },
    ],
  },
  {
    id: "6",
    titleKey: "camps data.camp6 title",
    dates: "25 – 27 Des 2015",
    descriptionKey: "camps data.camp6 desc",
    dayLinks: [
      { label: "Day 1", url: "#" },
      { label: "Day 2", url: "#" },
      { label: "Day 3", url: "#" },
    ],
  },
  {
    id: "7",
    titleKey: "camps data.camp7 title",
    dates: "28 – 30 Des 2015",
    descriptionKey: "camps data.camp7 desc",
    dayLinks: [
      { label: "Day 1", url: "#" },
      { label: "Day 2", url: "#" },
      { label: "Day 3", url: "#" },
    ],
  },
];

const Camps: React.FC = () => {
  const { t } = useTranslation();

  const handleDayLinkClick = (campTitle: string, dayLabel: string) => {
    toast.info(t('details coming soon', { campTitle, dayLabel }));
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <section className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary">{t('camp program title')}</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          {t('camp program subtitle')}
        </p>
      </section>

      <section className="mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dummyCamps.map((camp) => (
            <Card key={camp.id} className="flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3 mb-2">
                  <Code className="text-primary" size={28} />
                  <CardTitle className="text-xl font-semibold">{t(camp.titleKey)}</CardTitle>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CalendarDays size={16} />
                  <span>{camp.dates}</span>
                </div>
              </CardHeader>
              <CardContent className="flex-grow p-6 pt-0">
                <CardDescription className="mb-4 text-muted-foreground">
                  {t(camp.descriptionKey)}
                </CardDescription>
                <div className="flex flex-wrap gap-2 mt-4">
                  {camp.dayLinks.map((day, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => handleDayLinkClick(t(camp.titleKey), day.label)}
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
        <Link to="/">
          <Button>{t('back to home')}</Button>
        </Link>
      </div>
    </div>
  );
};

export default Camps;