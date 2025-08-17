"use client";

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CalendarDays, Code } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { formatDisplayDate } from "@/utils/dateUtils"; // Import from dateUtils

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
      } catch (err: any) {
        console.error("Error fetching camps:", err);
        setError(t("fetch data error", { error: err.message }));
      } finally {
        setLoading(false);
      }
    };

    fetchCamps();
  }, [t]);

  const handleDayLinkClick = (campTitle: string, dayLabel: string) => {
    toast.info(t('details coming soon', { campTitle, dayLabel }));
  };

  // Helper function to format plain text with newlines into paragraphs
  const formatTextToParagraphs = (text: string | null | undefined): string => {
    if (!text) return '';
    // Replace multiple consecutive newlines with a single one for cleaner output
    const cleanedText = text.replace(/\n\s*\n/g, '\n');
    // Split by newline and wrap each line in a <p> tag
    return cleanedText.split('\n').map(line => `<p>${line}</p>`).join('');
  };

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
                    dangerouslySetInnerHTML={{ __html: formatTextToParagraphs(camp.description) }} 
                  />
                  <div className="flex flex-wrap gap-2 mt-4">
                    {camp.camp_day_links.map((day, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => handleDayLinkClick(camp.title, day.label)}
                        className="hover:bg-accent hover:text-accent-foreground"
                      >
                        {day.label}
                      </Button>
                    ))}
                  </div>
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