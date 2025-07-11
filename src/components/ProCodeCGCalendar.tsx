"use client";

import React from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "react-i18next"; // Import useTranslation

const ProCodeCGCalendar: React.FC = () => {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const { t, i18n } = useTranslation(); // Initialize useTranslation and destructure i18n

  // Dummy events for demonstration
  // Menggunakan tahun yang konsisten (misalnya, 2025) untuk semua acara agar lebih mudah dilihat
  const events = [
    { date: new Date(2025, 0, 1), title: t("events.newyear") }, // Jan 1, 2025
    { date: new Date(2025, 0, 15), title: t("events.htmlworkshop") }, // Jan 15, 2025
    { date: new Date(2025, 1, 3), title: t("events.javascriptclassstarts") }, // Feb 3, 2025
    { date: new Date(2025, 1, 14), title: t("events.reactwebinar") }, // Feb 14, 2025
    { date: new Date(2025, 2, 10), title: t("events.codemeetup") }, // Mar 10, 2025
    { date: new Date(2025, 2, 22), title: t("events.pythontraining") }, // Mar 22, 2025
    { date: new Date(2025, 3, 1), title: t("events.summercampregistration") }, // Apr 1, 2025
    { date: new Date(2025, 3, 18), title: t("events.debuggingsession") }, // Apr 18, 2025
    { date: new Date(2025, 4, 5), title: t("events.nationaleducationday") }, // May 5, 2025
    { date: new Date(2025, 4, 20), title: t("events.finalprojectpresentation") }, // May 20, 2025
    { date: new Date(2025, 5, 1), title: t("events.nationalholiday") }, // June 1, 2025
    { date: new Date(2025, 5, 15), title: t("events.uiuxworkshop") }, // June 15, 2025
    { date: new Date(2025, 6, 12), title: t("events.kidscodingclass") }, // July 12, 2
    { date: new Date(2025, 6, 19), title: t("events.kidscodingclass") }, // July 19, 2025
    { date: new Date(2025, 6, 26), title: t("events.kidscodingclass") }, // July 26, 2025
    { date: new Date(2025, 7, 5), title: t("events.aiintroworkshop") }, // August 5, 2025
    { date: new Date(2025, 7, 10), title: t("events.codemeetup") }, // August 10, 2025
    { date: new Date(2025, 8, 1), title: t("events.newclassstarts") }, // Sep 1, 2025
    { date: new Date(2025, 8, 17), title: t("events.independenceday") }, // Sep 17, 2025 (from image)
    { date: new Date(2025, 9, 10), title: t("events.cybersecurityseminar") }, // Oct 10, 2025
    { date: new Date(2025, 10, 1), title: t("events.holidaycampregistration") }, // Nov 1, 2025
    { date: new Date(2025, 11, 25), title: t("events.christmasholiday") }, // Dec 25, 2025
  ];

  const getDayEvents = (day: Date) => {
    return events.filter(event => 
      event.date.getDate() === day.getDate() &&
      event.date.getMonth() === day.getMonth() &&
      event.date.getFullYear() === day.getFullYear()
    );
  };

  return (
    <div className="flex justify-center">
      <Card className="w-full max-w-4xl p-4 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl font-bold text-center">{t('procodecgcalendartitle')}</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border shadow"
            modifiers={{
              hasEvent: events.map(event => event.date)
            }}
            modifiersStyles={{
              hasEvent: {
                fontWeight: 'bold',
                color: 'hsl(var(--primary))',
                backgroundColor: 'hsl(var(--accent))',
                borderRadius: '0.375rem',
              }
            }}
            captionLayout="dropdown"
          />
        </CardContent>
        {date && (
          <div className="mt-6 p-4 border-t border-border">
            <h3 className="text-lg font-semibold text-primary mb-2">
              {t('eventson')} {date.toLocaleDateString(i18n.language === 'id' ? 'id-ID' : 'en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}:
            </h3>
            {getDayEvents(date).length > 0 ? (
              <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                {getDayEvents(date).map((event, index) => (
                  <li key={index}>{event.title}</li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">{t('noeventsscheduled')}</p>
            )}
          </div>
        )}
      </Card>
    </div>
  );
};

export default ProCodeCGCalendar;