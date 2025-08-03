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

// Removed SupabaseRunningClass interface
// interface SupabaseRunningClass {
//   id: string;
//   name: string;
//   schedule: string;
//   description: string;
//   icon_name: string | null;
//   created_by: string | null;
//   created_at: string;
// }

interface SupabaseRegularEvent {
  id: string;
  name: string;
  schedule: string;
  description: string;
  icon_name: string | null;
  created_by: string | null;
  created_at: string;
}

const RegularEventsClasses: React.FC = () => {
  const { t } = useTranslation();
  const [selectedActivityView, setSelectedActivityView] = useState("regularEvents"); // Default to regularEvents
  // Removed runningClasses state
  // const [runningClasses, setRunningClasses] = useState<SupabaseRunningClass[]>([]);
  const [regularEvents, setRegularEvents] = useState<SupabaseRegularEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActivities = async () => {
      setLoading(true);
      setError(null);
      try {
        // Removed runningData fetch
        // const { data: runningData, error: runningError } = await supabase
        //   .from('running_classes')
        //   .select('*')
        //   .order('created_at', { ascending: false });

        // if (runningError) throw runningError;
        // setRunningClasses(runningData || []);

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
            {/* Removed 'allActivities' and 'runningClasses' options */}
            {/* <SelectItem value="allActivities">{t('all activities')}</SelectItem>
            <SelectItem value="runningClasses">{t('running classes')}</SelectItem> */}
            <SelectItem value="regularEvents">{t('regular events')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Removed running classes section */}
      {/* {(selectedActivityView === "allActivities" || selectedActivityView === "runningClasses") && (
        <section className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">{t('running classes section title')}</h2>
          {loading ? (
            <p className="text-center text-muted-foreground">{t('loading activities')}</p>
          ) : runningClasses.length > 0 ? (
            <div className="grid grid-cols-1 gap-6"> 
              {runningClasses.map((cls) => {
                const ClassIcon = getIconComponent(cls.icon_name);
                return (
                  <Card key={cls.id} className="p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col md:flex-row items-center md:items-start text-center md:text-left">
                    <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
                      {ClassIcon && <ClassIcon className="text-primary" size={64} />}
                    </div>
                    <div className="flex-grow">
                      <CardHeader className="pb-2 p-0">
                        <CardTitle className="text-2xl font-semibold">{cls.name}</CardTitle>
                        <CardDescription className="text-primary font-medium">{cls.schedule}</CardDescription>
                      </CardHeader>
                      <CardContent className="text-muted-foreground p-0 pt-2">
                        {cls.description}
                      </CardContent>
                    </div>
                  </Card>
                );
              })}
            </div>
          ) : (
            <p className="text-center text-muted-foreground mt-8 text-lg">{t('no running classes available')}</p>
          )}
        </section>
      )} */}

      {/* Removed separator if running classes section is removed */}
      {/* {(selectedActivityView === "allActivities" || selectedActivityView === "runningClasses") && <Separator className="my-12" />} */}

      {(selectedActivityView === "allActivities" || selectedActivityView === "regularEvents") && (
        <section className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">{t('regular events section title')}</h2>
          {loading ? ( // Show loading only for this section if data is still fetching
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
                        <CardDescription className="text-primary font-medium">{event.schedule}</CardDescription>
                      </CardHeader>
                      <CardContent className="text-muted-foreground p-0 pt-2">
                        {event.description}
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