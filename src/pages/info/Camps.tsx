"use client";

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CalendarDays, Code } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { formatDisplayDate } from "@/utils/dateUtils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"; // Import Accordion components

interface SupabaseCampDayLink {
  id: string;
  camp_id: string;
  label: string;
  url: string;
  created_by: string | null;
  created_at: string;
}

interface SupabaseCamp {
  id: string;
  title: string;
  dates: string;
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
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary">{t('our camp programs title')}</h1>
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
                    <span>{formatDisplayDate(camp.dates)}</span>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow p-6 pt-0">
                  <div
                    className="prose dark:prose-invert max-w-none text-muted-foreground"
                    dangerouslySetInnerHTML={{ __html: camp.description }}
                  />
                  {camp.camp_day_links && camp.camp_day_links.length > 0 && (
                    <div className="mt-4">
                      <h3 className="text-lg font-semibold text-primary mb-2">{t('camp day links')}</h3>
                      <Accordion type="single" collapsible className="w-full">
                        {camp.camp_day_links.map((day, index) => (
                          <AccordionItem key={day.id || `day-${index}`} value={`day-${day.id || index}`}>
                            <AccordionTrigger className="text-base font-medium text-foreground hover:text-primary transition-colors">
                              {day.label}
                            </AccordionTrigger>
                            <AccordionContent className="pl-4 pt-2 pb-2">
                              <a
                                href={day.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline text-sm"
                              >
                                {day.url}
                              </a>
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