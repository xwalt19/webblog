"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { getIconComponent } from "@/utils/iconMap";
import { formatDisplayDate, formatDisplayDateTime } from "@/utils/dateUtils";
import { toast } from "sonner";

interface RegularEvent {
  id: string;
  name: string;
  schedule: string; // ISO string
  description: string;
  icon_name: string | null;
  created_by: string | null;
  created_at: string;
}

const RegularEventsClasses: React.FC = () => {
  const { t } = useTranslation();
  const [regularEvents, setRegularEvents] = useState<RegularEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRegularEvents = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase
          .from('regular_events')
          .select('*')
          .order('schedule', { ascending: false });

        if (error) {
          throw error;
        }
        setRegularEvents(data || []);
      } catch (err: any) {
        console.error("Error fetching regular events:", err);
        setError(t("fetch data error", { error: err.message }));
      } finally {
        setLoading(false);
      }
    };

    fetchRegularEvents();
  }, [t]);

  // No filtering needed as only regular events are fetched and displayed

  if (error) {
    return (
      <div className="container mx-auto py-10 px-4 bg-muted/40 rounded-lg shadow-inner">
        <p className="text-center text-destructive">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <section className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary capitalize">{t('regular events classes')}</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          {t('regular events classes subtitle')}
        </p>
      </section>

      {loading ? (
        <p className="text-center text-muted-foreground">{t('loading regular events')}</p>
      ) : regularEvents.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {regularEvents.map((event) => {
            const EventIcon = getIconComponent(event.icon_name);
            return (
              <Card key={event.id} className="p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
                <CardHeader className="pb-2 flex-grow">
                  <div className="flex items-center gap-4 mb-2">
                    {EventIcon && <EventIcon className="text-primary" size={40} />}
                    <CardTitle className="text-2xl font-semibold">{event.name}</CardTitle>
                  </div>
                  <CardDescription className="text-primary font-medium">
                    {formatDisplayDateTime(event.schedule)}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0 pt-2">
                  <div
                    className="prose dark:prose-invert max-w-none text-muted-foreground"
                    dangerouslySetInnerHTML={{ __html: event.description }}
                  />
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <p className="text-center text-muted-foreground mt-8 text-lg">{t('no regular events available')}</p>
      )}

      <div className="text-center mt-12">
        <Link to="/">
          <Button>{t('return to home')}</Button>
        </Link>
      </div>
    </div>
  );
};

export default RegularEventsClasses;