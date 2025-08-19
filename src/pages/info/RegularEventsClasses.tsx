"use client";

import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { getIconComponent } from "@/utils/iconMap";
import { formatRemainingDays, parseDateRangeString } from "@/utils/dateUtils";
import { CalendarDays, Users, CheckCircle2, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import ResponsiveImage from "@/components/ResponsiveImage";
import { useQuery } from "@tanstack/react-query";

interface RegularEvent {
  id: string;
  name: string;
  schedule: string; // Changed to string
  description: string;
  icon_name: string | null;
  banner_image_url: string | null;
  quota: number | null;
  registration_link: string | null;
  created_by: string | null;
  created_at: string;
}

const RegularEventsClasses: React.FC = () => {
  const { t } = useTranslation();

  const { data: regularEvents, isLoading, isError, error } = useQuery<RegularEvent[], Error>({
    queryKey: ['regularEventsPublic'], // Unique key for public regular events
    queryFn: async () => {
      const { data, error } = await supabase
        .from('regular_events')
        .select('*')
        .order('schedule', { ascending: false });

      if (error) {
        throw error;
      }
      return data || [];
    },
    staleTime: 5 * 60 * 1000, // Data considered fresh for 5 minutes
  });

  if (isLoading) {
    return (
      <div className="container mx-auto py-10 px-4 bg-muted/40 rounded-lg shadow-inner">
        <p className="text-center text-muted-foreground">{t('loading regular events')}</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto py-10 px-4 bg-muted/40 rounded-lg shadow-inner">
        <p className="text-center text-destructive">{error?.message}</p>
      </div>
    );
  }

  if (!regularEvents || regularEvents.length === 0) {
    return (
      <div className="container mx-auto py-10 px-4 bg-muted/40 rounded-lg shadow-inner">
        <p className="text-center text-muted-foreground mt-8 text-lg">{t('no regular events available')}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <section className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground capitalize">{t('regular events classes')}</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          {t('regular events classes subtitle')}
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {regularEvents.map((event) => {
          const EventIcon = getIconComponent(event.icon_name);
          const { startDate } = parseDateRangeString(event.schedule);
          const isEventUpcoming = startDate ? startDate > new Date() : false;
          const isQuotaAvailable = event.quota === null || event.quota > 0;

          return (
            <Card key={event.id} className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="relative w-full h-48 bg-primary/10 flex items-center justify-center">
                {event.banner_image_url ? (
                  <ResponsiveImage 
                    src={event.banner_image_url} 
                    alt={event.name} 
                    containerClassName="absolute inset-0" 
                    className="object-cover" 
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    {EventIcon ? (
                      <EventIcon className="text-primary opacity-70" size={96} />
                    ) : (
                      <CalendarDays className="text-primary opacity-70" size={96} />
                    )}
                  </div>
                )}
              </div>
              
              <div className="p-4 flex-grow">
                <div className="flex justify-between items-center mb-2">
                  <Badge variant="secondary" className="text-sm px-3 py-1">
                    {t('event type label')}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {event.schedule}
                  </span>
                </div>
                <CardTitle className="text-xl font-semibold mb-2">{event.name}</CardTitle>
                <div
                  className="prose dark:prose-invert max-w-none text-muted-foreground mb-4 line-clamp-3"
                  dangerouslySetInnerHTML={{ __html: event.description }}
                />
              </div>

              <div className="border-t border-border p-4 flex justify-between items-center text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  {event.quota !== null ? (
                    <>
                      {isQuotaAvailable ? (
                        <Users className="h-4 w-4 text-green-500" />
                      ) : (
                        <Users className="h-4 w-4 text-destructive" />
                      )}
                      <span>
                        {event.quota > 0
                          ? t('quota remaining', { count: event.quota })
                          : t('quota full')}
                      </span>
                    </>
                  ) : (
                    <span className="text-muted-foreground">{t('unlimited quota')}</span>
                  )}
                </div>
                <div className="font-semibold text-primary">
                  {formatRemainingDays(startDate?.toISOString())}
                </div>
              </div>
              <div className="p-4 pt-0">
                <Link to={`/info/regular-events-classes/${event.id}`}>
                  <Button variant="outline" className="w-full">
                    {t('view details button')}
                  </Button>
                </Link>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="text-center mt-12">
        <Link to="/">
          <Button>{t('return to home')}</Button>
        </Link>
      </div>
    </div>
  );
};

export default RegularEventsClasses;