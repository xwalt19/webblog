"use client";

import React from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "react-i18next"; // Import useTranslation

const ProCodeCGCalendar: React.FC = () => {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const { t, i18n } = useTranslation(); // Initialize useTranslation and destructure i18n

  // TODO: Replace with data fetched from Supabase
  // Dummy events for demonstration
  // Menggunakan tahun yang konsisten (misalnya, 2025) untuk semua acara agar lebih mudah dilihat
  const events = [
    { date: new Date(2025, 0, 1), title: t("events.new year") }, // Jan 1, 2025
    { date: new Date(2025, 0, 15), title: t("events.html workshop") }, // Jan 15, 2025
    { date: new Date(2025, 1, 3), title: t("events.javascript class starts") }, // Feb 3, 2025
    { date: new Date(2025, 1, 14), title: t("events.react webinar") }, // Feb 14, 2025
    { date: new Date(2025, 2, 10), title: t("events.codemeetup") }, // Mar 10, 2025
    { date: new Date(2025, 2, 22), title: t("events.python training") }, // Mar 22, 2025
    { date: new Date(2025, 3, 1), title: t("events.summer camp registration") }, // Apr 1, 2025
    { date: new Date(2025, 3, 18), title: t("events.debugging session") }, // Apr 18, 2025
    { date: new Date(2025, 4, 5), title: t("events.national education day") }, // May 5, 2025
    { date: new Date(2025, 4, 20), title: t("events.final project presentation") }, // May 20, 2025
    { date: new Date(2025, 5, 1), title: t("events.national holiday") }, // June 1, 2025
    { date: new Date(2025, 5, 15), title: t("events.uiux workshop") }, // June 15, 2025
    { date: new Date(2025, 6, 12), title: t("events.kids coding class") }, // July 12, 2
    { date: new Date(2025, 6, 19), title: t("events.kids coding class") }, // July 19, 2025
    { date: new Date(2025, 6, 26), title: t("events.kids coding class") }, // July 26, 2025
    { date: new Date(2025, 7, 5), title: t("events.ai intro workshop") }, // August 5, 2025
    { date: new Date(2025, 7, 10), title: t("events.codemeetup") }, // August 10, 2025
    { date: new Date(2025, 8, 1), title: t("events.new class starts") }, // Sep 1, 2025
    { date: new Date(2025, 8, 17), title: t("events.independence day") }, // Sep 17, 2025 (from image)
    { date: new Date(2025, 9, 10), title: t("events.cybersecurity seminar") }, // Oct 10, 2025
    { date: new Date(2025, 10, 1), title: t("events.holiday camp registration") }, // Nov 1, 2025
    { date: new Date(2025, 11, 25), title: t("events.christmas holiday") }, // Dec 25, 2025
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
          <CardTitle className="text-2xl font-bold text-center">{t('procodecg calendar title')}</CardTitle>
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
              {t('events on')} {date.toLocaleDateString(i18n.language === 'id' ? 'id-ID' : 'en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}:
            </h3>
            {getDayEvents(date).length > 0 ? (
              <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                {getDayEvents(date).map((event, index) => (
                  <li key={index}>{event.title}</li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">{t('no events scheduled')}</p>
            )}
          </div>
        )}
      </Card>
    </div>
  );
};

export default ProCodeCGCalendar;