"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { getIconComponent } from "@/utils/iconMap";
import { formatDisplayDate, formatDisplayDateTime, formatRemainingDays, parseDateRangeString } from "@/utils/dateUtils";
import { toast } from "sonner";
import { CalendarDays, BellRing, Users, CheckCircle2, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import ResponsiveImage from "@/components/ResponsiveImage";
import { cn } from "@/lib/utils";

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
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground capitalize">{t('regular events classes')}</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          {t('regular events classes subtitle')}
        </p>
      </section>

      {loading ? (
        <p className="text-center text-muted-foreground">{t('loading regular events')}</p>
      ) : regularEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {regularEvents.map((event) => {
            const EventIcon = getIconComponent(event.icon_name);
            // Use parseDateRangeString to get the actual start date for comparison
            const { startDate } = parseDateRangeString(event.schedule);
            const isEventUpcoming = startDate ? startDate > new Date() : false;
            const isQuotaAvailable = event.quota === null || event.quota > 0;

            return (
              <Card key={event.id} className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                {/* Image/Banner Section */}
                <div className="relative w-full h-48 bg-primary/10 flex items-center justify-center"> {/* Changed h-64 to h-48 */}
                  {event.banner_image_url ? (
                    <ResponsiveImage 
                      src={event.banner_image_url} 
                      alt={event.name} 
                      containerClassName="absolute inset-0" 
                      className="object-cover" 
                    />
                  ) : (
                    // Fallback to icon if no banner image
                    <div className="absolute inset-0 flex items-center justify-center">
                      {EventIcon ? (
                        <EventIcon className="text-primary opacity-70" size={96} />
                      ) : (
                        <CalendarDays className="text-primary opacity-70" size={96} />
                      )}
                    </div>
                  )}
                </div>
                
                {/* Main Content Section */}
                <div className="p-4 flex-grow"> {/* Changed p-4 to p-4, already compact */}
                  <div className="flex justify-between items-center mb-2">
                    <Badge variant="secondary" className="text-sm px-3 py-1">
                      {t('event type label')}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {event.schedule} {/* Display schedule as is */}
                    </span>
                  </div>
                  <CardTitle className="text-xl font-semibold mb-2">{event.name}</CardTitle>
                  <div
                    className="prose dark:prose-invert max-w-none text-muted-foreground mb-4 line-clamp-3"
                    dangerouslySetInnerHTML={{ __html: event.description }}
                  />
                </div>

                {/* Footer Section */}
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
                    {formatRemainingDays(startDate?.toISOString())} {/* Pass ISO string for remaining days */}
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