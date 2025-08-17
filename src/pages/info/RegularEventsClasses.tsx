"use client";

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { getIconComponent } from "@/utils/iconMap";
import { formatDisplayDateTime } from "@/utils/dateUtils";

interface SupabaseRegularEvent {
  id: string;
  name: string;
  schedule: string; // Now an ISO string
  description: string;
  icon_name: string | null;
  created_by: string | null;
  created_at: string;
}

const RegularEventsClasses: React.FC = () => {
  const { t } = useTranslation();
  const [selectedActivityView, setSelectedActivityView] = useState("regularEvents");
  const [regularEvents, setRegularEvents] = useState<SupabaseRegularEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActivities = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data: eventData, error: eventError } = await supabase
          .from('regular_events')
          .select('*')
          .order('created_at', { ascending: false });

        if (eventError) throw eventError;
        setRegularEvents(eventData || []);

      } catch (err: any) {
        console.error("Error fetching activities:", err);
        setError(t("fetch data error", { error: err.message }));
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [t]);

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
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary">{t('schedule events page title')}</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          {t('schedule events page subtitle')}
        </p>
      </section>

      <div className="flex justify-center mb-10">
        <Select value={selectedActivityView} onValueChange={setSelectedActivityView}>
          <SelectTrigger className="w-full md:w-[250px]">
            <SelectValue placeholder={t('select activity placeholder')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="regularEvents">{t('regular events')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {(selectedActivityView === "allActivities" || selectedActivityView === "regularEvents") && (
        <section className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">{t('regular events section title')}</h2>
          {loading ? (
            <p className="text-center text-muted-foreground">{t('loading activities')}</p>
          ) : regularEvents.length > 0 ? (
            <div className="grid grid-cols-1 gap-6">
              {regularEvents.map((event) => {
                const EventIcon = getIconComponent(event.icon_name);
                return (
                  <Card key={event.id} className="p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col md:flex-row items-center md:items-start text-center md:text-left">
                    <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
                      {EventIcon && <EventIcon className="text-primary" size={64} />}
                    </div>
                    <div className="flex-grow">
                      <CardHeader className="pb-2 p-0">
                        <CardTitle className="text-2xl font-semibold">{event.name}</CardTitle>
                        <CardDescription className="text-primary font-medium">{formatDisplayDateTime(event.schedule)}</CardDescription>
                      </CardHeader>
                      <CardContent className="p-0 pt-2">
                        <div
                          className="prose dark:prose-invert max-w-none text-muted-foreground"
                          dangerouslySetInnerHTML={{ __html: event.description }}
                        />
                      </CardContent>
                    </div>
                  </Card>
                );
              })}
            </div>
          ) : (
            <p className="text-center text-muted-foreground mt-8 text-lg">{t('no regular events available')}</p>
          )}
        </section>
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