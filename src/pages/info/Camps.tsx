"use client";

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CalendarDays, Code, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { formatDynamicScheduleOrDates } from "@/utils/dateUtils"; // Import new dynamic formatter
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
// Removed RichTextEditor import as it's no longer used for display
import { cn } from "@/lib/utils";

interface SupabaseCampDayLink {
  id: string;
  camp_id: string;
  label: string;
  url: string;
  content: string | null;
  created_by: string | null;
  created_at: string;
}

interface SupabaseCamp {
  id: string;
  title: string;
  dates: string; // Now a formatted string
  description: string;
  created_by: string | null;
  created_at: string;
  camp_day_links: SupabaseCampDayLink[];
}

const Camps: React.FC = () => {
  const { t } = useTranslation();
  const [camps, setCamps] = useState<SupabaseCamp[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCamps = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase
          .from('camps')
          .select('*, camp_day_links(*)')
          .order('created_at', { ascending: false });

        if (error) {
          throw error;
        }
        setCamps(data || []);
      }
      catch (err: any) {
        console.error("Error fetching camps:", err);
        setError(t("fetch data error", { error: err.message }));
      } finally {
        setLoading(false);
      }
    };

    fetchCamps();
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
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground capitalize">{t('our camp programs title')}</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          {t('our camp programs subtitle')}
        </p>
      </section>

      <section className="mb-16">
        {loading ? (
          <p className="text-center text-muted-foreground">{t('loading camps')}</p>
        ) : camps.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {camps.map((camp) => (
              <Card key={camp.id} className="flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Code className="text-primary" size={28} />
                    <CardTitle className="text-xl font-semibold">{camp.title}</CardTitle>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CalendarDays size={16} />
                    <span>{formatDynamicScheduleOrDates(camp.dates)}</span> {/* Use dynamic formatter */}
                  </div>
                </CardHeader>
                <CardContent className="flex-grow p-6 pt-0">
                  <div 
                    className="prose dark:prose-invert max-w-none text-muted-foreground" 
                    dangerouslySetInnerHTML={{ __html: camp.description }}
                  />
                  {camp.camp_day_links && camp.camp_day_links.length > 0 && (
                    <div className="mt-4">
                      <h3 className="text-lg font-semibold text-foreground mb-2">{t('day links')}</h3>
                      <Accordion type="single" collapsible className="w-full">
                        {camp.camp_day_links.map((day) => (
                          <AccordionItem key={day.id} value={day.id}>
                            <AccordionTrigger 
                              className={cn(
                                "text-base font-medium text-foreground hover:no-underline",
                                "bg-primary text-primary-foreground rounded-md px-4 py-3 mb-2 shadow-md",
                                "hover:bg-primary/90 hover:shadow-lg transition-all duration-300",
                                "data-[state=open]:bg-primary-foreground data-[state=open]:text-primary data-[state=open]:shadow-xl",
                                "data-[state=open]:animate-pulse-subtle"
                              )}
                            >
                              {day.label}
                            </AccordionTrigger>
                            <AccordionContent className="text-muted-foreground p-4 border border-t-0 border-primary/20 rounded-b-md bg-primary/5">
                              {day.content ? (
                                <div dangerouslySetInnerHTML={{ __html: day.content }} />
                              ) : (
                                <p>{t('no content available')}</p>
                              )}
                              {day.url && (
                                <a href={day.url} target="_blank" rel="noopener noreferrer" className="inline-block mt-2">
                                  <Button variant="outline" size="sm">
                                    <ExternalLink className="h-4 w-4 mr-2" /> {t('visit link')}
                                  </Button>
                                </a>
                              )}
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground mt-8 text-lg">{t('no camps found')}</p>
        )}
      </section>

      <div className="text-center mt-12">
        <Link to="/">
          <Button>{t('return to home')}</Button>
        </Link>
      </div>
    </div>
  );
};

export default Camps;