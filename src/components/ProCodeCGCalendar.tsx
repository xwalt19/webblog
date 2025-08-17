"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { nationalHolidays } from "@/data/nationalHolidays";
import { formatDisplayDateTime } from "@/utils/dateUtils"; // Import from dateUtils

interface CalendarEvent {
  id: string;
  title: string;
  description: string | null;
  date: string;
  isHoliday?: boolean;
}

const ProCodeCGCalendar: React.FC = () => {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const { t, i18n } = useTranslation();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [errorEvents, setErrorEvents] = useState<string | null>(null);

  useEffect(() => {
    const fetchCalendarEvents = async () => {
      setLoadingEvents(true);
      setErrorEvents(null);
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
        setErrorEvents(t("fetch calendar events error", { error: err.message }));
      } finally {
        setLoadingEvents(false);
      }
    };

    fetchCalendarEvents();
  }, [t]);

  const allCombinedEvents = useMemo(() => {
    return [...events, ...nationalHolidays].map(event => ({
      ...event,
      date: new Date(event.date)
    }));
  }, [events]);

  const getDayEvents = (day: Date) => {
    return allCombinedEvents.filter(event => 
      event.date.getDate() === day.getDate() &&
      event.date.getMonth() === day.getMonth() &&
      event.date.getFullYear() === day.getFullYear()
    ).sort((a, b) => a.date.getTime() - b.date.getTime());
  };

  const allEventDates = useMemo(() => {
    return allCombinedEvents.map(event => event.date);
  }, [allCombinedEvents]);

  const isLoading = loadingEvents;
  const hasError = errorEvents;

  return (
    <div className="flex justify-center">
      <Card className="w-full max-w-4xl p-4 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl font-bold text-center">{t('procodecg calendar title')}</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center">
          {isLoading ? (
            <p className="text-center text-muted-foreground">{t('loading events')}</p>
          ) : hasError ? (
            <p className="text-center text-destructive">{hasError}</p>
          ) : (
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border shadow"
              modifiers={{
                hasEvent: allEventDates
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
              {t('events on')} {formatDisplayDateTime(date.toISOString())}:
            </h3>
            {isLoading ? (
              <p className="text-muted-foreground">{t('loading events')}</p>
            ) : getDayEvents(date).length > 0 ? (
              <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                {getDayEvents(date).map((event, index) => (
                  <li key={index}>
                    <span className={event.isHoliday ? "font-bold text-red-600" : ""}>
                      {event.title}
                    </span>
                    {event.description && ` - ${event.description}`}
                    {event.isHoliday && ` (${t('national holiday')})`}
                  </li>
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