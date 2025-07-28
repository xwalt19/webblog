import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CalendarDays, Code } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { dummyCamps, Camp } from "@/data/camps";

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