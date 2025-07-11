"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CalendarDays, BellRing } from "lucide-react";
import { useTranslation } from "react-i18next";

interface FixedItem {
  id: string;
  type: "news" | "schedule";
  titleKey: string;
  descriptionKey: string;
  dateTime: string; // Combined date and time into a single ISO string
}

const dummyFixedItems: FixedItem[] = [
  {
    id: "f1",
    type: "schedule",
    titleKey: "fixed items.f1 title",
    descriptionKey: "fixed items.f1 desc",
    dateTime: "2024-04-01T09:00:00", // ISO string for April 1, 2024, 09:00
  },
  {
    id: "f2",
    type: "news",
    titleKey: "fixed items.f2 title",
    descriptionKey: "fixed items.f2 desc",
    dateTime: "2024-03-10T00:00:00", // ISO string for March 10, 2024, no specific time
  },
  {
    id: "f3",
    type: "schedule",
    titleKey: "fixed items.f3 title",
    descriptionKey: "fixed items.f3 desc",
    dateTime: "2024-04-20T14:00:00", // ISO string for April 20, 2024, 14:00
  },
  {
    id: "f4",
    type: "news",
    titleKey: "fixed items.f4 title",
    descriptionKey: "fixed items.f4 desc",
    dateTime: "2024-04-01T00:00:00", // ISO string for April 1, 2024, no specific time
  },
];

const FixedNewsSchedule: React.FC = () => {
  const { t, i18n } = useTranslation();

  const formatDateTime = (isoString: string, type: "news" | "schedule") => {
    const dateObj = new Date(isoString);
    const dateOptions: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };

    let formattedDate = dateObj.toLocaleDateString(i18n.language === 'id' ? 'id-ID' : 'en-US', dateOptions);

    if (type === "schedule" && isoString.includes('T') && (dateObj.getHours() !== 0 || dateObj.getMinutes() !== 0 || dateObj.getSeconds() !== 0)) {
      const timeOptions: Intl.DateTimeFormatOptions = {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false, // Use 24-hour format
      };
      const formattedTime = dateObj.toLocaleTimeString(i18n.language === 'id' ? 'id-ID' : 'en-US', timeOptions);
      
      if (i18n.language === 'id') {
        return `${formattedDate} pukul ${formattedTime} WIB`;
      }
      return `${formattedDate} at ${formattedTime}`;
    }
    return formattedDate;
  };

  return (
    <section className="py-12 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">{t('fixed news schedule title')}</h2>
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
                  <CardTitle className="text-xl font-semibold">{t(item.titleKey)}</CardTitle>
                </div>
                <CardDescription className="text-sm text-muted-foreground">
                  {formatDateTime(item.dateTime, item.type)}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow p-6 pt-0">
                <p className="text-muted-foreground">{t(item.descriptionKey)}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FixedNewsSchedule;