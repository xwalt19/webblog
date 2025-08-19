"use client";

import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CalendarDays, Clock, User, ExternalLink, HelpCircle, Users, CheckCircle2, XCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import ResponsiveImage from "@/components/ResponsiveImage";
import { formatDisplayDateTime, formatRemainingDays } from "@/utils/dateUtils";
import { cn } from "@/lib/utils";
// Removed RichTextEditor import as it's no longer used for display

interface RegularEvent {
  id: string;
  name: string;
  schedule: string; // ISO string
  description: string;
  icon_name: string | null;
  banner_image_url: string | null;
  quota: number | null;
  registration_link: string | null;
  created_by: string | null;
  created_at: string;
  regular_event_rundowns: RegularEventRundown[];
  regular_event_faqs: RegularEventFAQ[];
}

interface RegularEventRundown {
  id: string;
  event_id: string;
  time: string;
  session_title: string;
  speaker_name: string; // New
  speaker_role: string; // New
  order_index: number;
}

interface RegularEventFAQ {
  id: string;
  event_id: string;
  question: string;
  answer: string;
  order_index: number;
}

const RegularEventDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const [event, setEvent] = useState<RegularEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase
          .from('regular_events')
          .select('*, regular_event_rundowns(id, event_id, time, session_title, speaker_name, speaker_role, order_index), regular_event_faqs(*)')
          .eq('id', id)
          .single();

        if (error) {
          throw error;
        }
        setEvent(data);
      } catch (err: any) {
        console.error("Error fetching event detail:", err);
        setError(t("failed to load event", { error: err.message }));
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchEvent();
    }
  }, [id, t]);

  if (loading) {
    return (
      <div className="container mx-auto py-10 px-4">
        <p className="text-center text-muted-foreground">{t('loading event details')}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <h2 className="text-3xl font-bold mb-4">{t('error')}</h2>
        <p className="text-lg text-destructive mb-6">{error}</p>
        <Link to="/info/regular-events-classes">
          <Button>{t('return to event list')}</Button>
        </Link>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="text-center py-10">
        <h2 className="text-3xl font-bold mb-4">{t('event not found title')}</h2>
        <p className="text-lg text-muted-foreground mb-6">{t('event not found message')}</p>
        <Link to="/info/regular-events-classes">
          <Button>{t('return to event list')}</Button>
        </Link>
      </div>
    );
  }

  const isEventUpcoming = new Date(event.schedule) > new Date();
  const isQuotaAvailable = event.quota === null || event.quota > 0;

  return (
    <div className="container mx-auto py-10 px-4">
      <Card className="max-w-4xl mx-auto shadow-lg">
        {event.banner_image_url && (
          <div className="relative w-full h-64 md:h-80 overflow-hidden rounded-t-lg">
            <ResponsiveImage
              src={event.banner_image_url}
              alt={event.name}
              containerClassName="w-full h-full"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <h1 className="absolute bottom-4 left-4 text-white text-3xl md:text-4xl font-bold">
              {event.name}
            </h1>
          </div>
        )}
        {!event.banner_image_url && (
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-3xl md:text-4xl font-bold">{event.name}</CardTitle>
          </CardHeader>
        )}

        <CardContent className="p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-primary">{t('event details')}</h2>
              <div className="flex items-center gap-3 text-lg text-foreground">
                <CalendarDays className="h-6 w-6 text-muted-foreground" />
                <span>{formatDisplayDateTime(event.schedule)}</span>
              </div>
              <div className="flex items-center gap-3 text-lg text-foreground">
                <Clock className="h-6 w-6 text-muted-foreground" />
                <span>{formatRemainingDays(event.schedule)}</span>
              </div>
              {event.quota !== null && (
                <div className="flex items-center gap-3 text-lg text-foreground">
                  {isQuotaAvailable ? (
                    <CheckCircle2 className="h-6 w-6 text-green-500" />
                  ) : (
                    <XCircle className="h-6 w-6 text-destructive" />
                  )}
                  <span>
                    {event.quota > 0
                      ? t('quota remaining', { count: event.quota })
                      : t('quota full')}
                  </span>
                </div>
              )}
              {event.registration_link && isEventUpcoming && isQuotaAvailable && (
                <a href={event.registration_link} target="_blank" rel="noopener noreferrer" className="block mt-6">
                  <Button size="lg" className="w-full">
                    <ExternalLink className="h-5 w-5 mr-2" /> {t('register now button')}
                  </Button>
                </a>
              )}
              {(!isEventUpcoming || !isQuotaAvailable) && (
                <Button size="lg" className="w-full" disabled>
                  {isEventUpcoming ? t('registration closed') : t('event passed')}
                </Button>
              )}
            </div>
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-primary">{t('description label')}</h2>
              <div 
                className="prose dark:prose-invert max-w-none text-muted-foreground"
                dangerouslySetInnerHTML={{ __html: event.description }}
              />
            </div>
          </div>

          {event.regular_event_rundowns && event.regular_event_rundowns.length > 0 && (
            <>
              <Separator className="my-8" />
              <h2 className="text-2xl font-bold text-primary mb-6">{t('event rundown')}</h2>
              <Card className="shadow-sm">
                <CardContent className="p-0">
                  <Table>
                    <TableHeader className="bg-primary">
                      <TableRow>
                        <TableHead className="w-[100px] text-left border-r text-white font-bold">Time</TableHead>
                        <TableHead className="flex-1 text-left border-r text-white font-bold">Session</TableHead>
                        <TableHead className="w-[250px] text-left text-white font-bold">Speaker</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {event.regular_event_rundowns
                        .sort((a, b) => a.order_index - b.order_index)
                        .map((rundown) => (
                          <TableRow key={rundown.id}>
                            <TableCell className="font-medium text-left text-foreground border-r border-b">{rundown.time}</TableCell>
                            <TableCell className="text-left text-foreground border-r border-b">{rundown.session_title}</TableCell>
                            <TableCell className="text-left text-foreground border-b">
                              {rundown.speaker_name} {rundown.speaker_role && `(${rundown.speaker_role})`}
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </>
          )}

          {event.regular_event_faqs && event.regular_event_faqs.length > 0 && (
            <>
              <Separator className="my-8" />
              <h2 className="text-2xl font-bold text-primary mb-6">{t('frequently asked questions')}</h2>
              <Accordion type="single" collapsible className="w-full">
                {event.regular_event_faqs
                  .sort((a, b) => a.order_index - b.order_index)
                  .map((faq) => (
                    <AccordionItem key={faq.id} value={faq.id}>
                      <AccordionTrigger className="text-base font-medium text-foreground hover:no-underline">
                        <div className="flex items-center gap-2">
                          <HelpCircle className="h-5 w-5 text-muted-foreground" />
                          {faq.question}
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground p-4 border border-t-0 border-border rounded-b-md bg-muted/20">
                        <div dangerouslySetInnerHTML={{ __html: faq.answer }} />
                      </AccordionContent>
                    </AccordionItem>
                  ))}
              </Accordion>
            </>
          )}

          <div className="text-center mt-12">
            <Link to="/info/regular-events-classes">
              <Button>{t('return to event list')}</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegularEventDetail;