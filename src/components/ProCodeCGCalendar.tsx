"use client";

import React from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { dummyCalendarEvents, CalendarEvent } from "@/data/calendarEvents";

const ProCodeCGCalendar: React.FC = () => {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const { t, i18n } = useTranslation();

  const events = dummyCalendarEvents.map(event => ({
    ...event,
    date: new Date(event.date) // Ensure Date objects are created
  }));

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
                  <li key={index}>{t(event.title)}</li>
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