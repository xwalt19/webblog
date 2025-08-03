"use client";

import React, { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";

interface CalendarEvent {
  id: string;
  title: string;
  description: string | null;
  date: string; // ISO string from database
}

const ProCodeCGCalendar: React.FC = () => {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const { t, i18n } = useTranslation();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCalendarEvents = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase
          .from('calendar_events')
          .select('*')
          .order('date', { ascending: true });

        if (error) {
          throw error;
        }
        setEvents(data || []);
      } catch (err: any) {
        console.error("Error fetching calendar events:", err);
        setError(t("fetch calendar events error", { error: err.message }));
      } finally {
        setLoading(false);
      }
    };

    fetchCalendarEvents();
  }, [t]);

  const parsedEvents = events.map(event => ({
    ...event,
    date: new Date(event.date)
  }));

  const getDayEvents = (day: Date) => {
    return parsedEvents.filter(event => 
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
          {loading ? (
            <p className="text-center text-muted-foreground">{t('loading events')}</p>
          ) : error ? (
            <p className="text-center text-destructive">{error}</p>
          ) : (
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border shadow"
              modifiers={{
                hasEvent: parsedEvents.map(event => event.date)
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
          )}
        </CardContent>
        {date && (
          <div className="mt-6 p-4 border-t border-border">
            <h3 className="text-lg font-semibold text-primary mb-2">
              {t('events on')} {date.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}:
            </h3>
            {getDayEvents(date).length > 0 ? (
              <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                {getDayEvents(date).map((event, index) => (
                  <li key={index}>{event.title} - {event.description}</li>
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