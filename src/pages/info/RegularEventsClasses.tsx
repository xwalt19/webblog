"use client";

import React, { useState, useEffect, useMemo } from "react";
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
import { formatDisplayDate, formatDisplayDateTime } from "@/utils/dateUtils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";

interface SupabasePriceTier {
  id: string;
  program_id: string;
  header_key_col1: string;
  header_key_col2: string;
  participants_key: string;
  price: string;
}

interface SupabaseTopic {
  id: string;
  program_id: string;
  icon_name: string;
  title: string;
  description: string;
}

interface SupabaseCampDayLink {
  id: string;
  camp_id: string;
  label: string;
  url: string;
  created_by: string | null;
  created_at: string;
}

// Unified interface for all activity types
interface ActivityItem {
  id: string;
  title: string;
  description: string;
  date: string; // ISO string for sorting (e.g., created_at, schedule, dates, published_at)
  type: 'regularEvent' | 'program' | 'camp' | 'training';
  icon_name?: string | null;
  // Specific fields for display, if needed
  schedule?: string | null; // for programs, regular events
  dates?: string; // for camps, training
  registration_fee?: string | null; // for programs
  price?: string | null; // for programs
  camp_day_links?: SupabaseCampDayLink[]; // for camps
  program_price_tiers?: SupabasePriceTier[]; // for programs
  program_topics?: SupabaseTopic[]; // for programs
}

const RegularEventsClasses: React.FC = () => {
  const { t } = useTranslation();
  const [selectedActivityView, setSelectedActivityView] = useState("all"); // Default to "all"
  const [allActivities, setAllActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllActivities = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch Regular Events
        const { data: regularEventData, error: regularEventError } = await supabase
          .from('regular_events')
          .select('*')
          .order('schedule', { ascending: false });
        if (regularEventError) throw regularEventError;

        // Fetch Programs
        const { data: programData, error: programError } = await supabase
          .from('programs')
          .select('*, program_price_tiers(*), program_topics(*)')
          .order('created_at', { ascending: false });
        if (programError) throw programError;

        // Fetch Camps
        const { data: campData, error: campError } = await supabase
          .from('camps')
          .select('*, camp_day_links(*)')
          .order('created_at', { ascending: false });
        if (campError) throw campError;

        // Fetch Training Programs
        const { data: trainingData, error: trainingError } = await supabase
          .from('training_programs')
          .select('*')
          .order('created_at', { ascending: false });
        if (trainingError) throw trainingError;

        const combinedActivities: ActivityItem[] = [
          ...(regularEventData || []).map(item => ({
            id: item.id,
            title: item.name,
            description: item.description,
            date: item.schedule, // Use schedule for regular events
            type: 'regularEvent' as const, // Explicitly type as literal
            icon_name: item.icon_name,
            schedule: item.schedule,
          })),
          ...(programData || []).map(item => ({
            id: item.id,
            title: item.title,
            description: item.description,
            date: item.schedule || item.created_at, // Use schedule if available, else created_at
            type: 'program' as const, // Explicitly type as literal
            icon_name: item.icon_name,
            schedule: item.schedule,
            registration_fee: item.registration_fee,
            price: item.price,
            program_price_tiers: item.program_price_tiers,
            program_topics: item.program_topics,
          })),
          ...(campData || []).map(item => ({
            id: item.id,
            title: item.title,
            description: item.description,
            date: item.dates, // Use dates for camps
            type: 'camp' as const, // Explicitly type as literal
            icon_name: 'Code', // Default icon for camps
            dates: item.dates,
            camp_day_links: item.camp_day_links,
          })),
          ...(trainingData || []).map(item => ({
            id: item.id,
            title: item.title,
            description: item.description,
            date: item.dates, // Use dates for training
            type: 'training' as const, // Explicitly type as literal
            icon_name: item.icon_name,
            dates: item.dates,
          })),
        ];

        // Sort all activities by date (most recent first)
        combinedActivities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        setAllActivities(combinedActivities);

      } catch (err: any) {
        console.error("Error fetching all activities:", err);
        setError(t("fetch data error", { error: err.message }));
      } finally {
        setLoading(false);
      }
    };

    fetchAllActivities();
  }, [t]);

  const filteredActivities = useMemo(() => {
    if (selectedActivityView === "all") {
      return allActivities;
    }
    return allActivities.filter(activity => {
      if (selectedActivityView === "regularEvents" && activity.type === "regularEvent") return true;
      if (selectedActivityView === "programs" && activity.type === "program") return true;
      if (selectedActivityView === "camps" && activity.type === "camp") return true;
      if (selectedActivityView === "training" && activity.type === "training") return true;
      return false;
    });
  }, [selectedActivityView, allActivities]);

  const handleDayLinkClick = (campTitle: string, dayLabel: string) => {
    toast.info(t('details coming soon', { campTitle, dayLabel }));
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
            <SelectItem value="all">{t('all activities')}</SelectItem>
            <SelectItem value="regularEvents">{t('regular events')}</SelectItem>
            <SelectItem value="programs">{t('programs')}</SelectItem>
            <SelectItem value="camps">{t('camps')}</SelectItem>
            <SelectItem value="training">{t('training')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <p className="text-center text-muted-foreground">{t('loading activities')}</p>
      ) : filteredActivities.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {filteredActivities.map((activity) => {
            const ActivityIcon = getIconComponent(activity.icon_name);
            return (
              <Card key={activity.id} className="p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
                <CardHeader className="pb-2 flex-grow">
                  <div className="flex items-center gap-4 mb-2">
                    {ActivityIcon && <ActivityIcon className="text-primary" size={40} />}
                    <CardTitle className="text-2xl font-semibold">{activity.title}</CardTitle>
                  </div>
                  {/* Display date/schedule based on type */}
                  {activity.type === 'regularEvent' && activity.schedule && (
                    <CardDescription className="text-primary font-medium">
                      {formatDisplayDateTime(activity.schedule)}
                    </CardDescription>
                  )}
                  {(activity.type === 'camp' || activity.type === 'training') && activity.dates && (
                    <CardDescription className="text-primary font-medium">
                      {formatDisplayDate(activity.dates)}
                    </CardDescription>
                  )}
                  {activity.type === 'program' && activity.schedule && (
                    <CardDescription className="text-primary font-medium">
                      {formatDisplayDateTime(activity.schedule)}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent className="p-0 pt-2">
                  <div
                    className="prose dark:prose-invert max-w-none text-muted-foreground"
                    dangerouslySetInnerHTML={{ __html: activity.description }}
                  />

                  {/* Program specific details */}
                  {activity.type === 'program' && (
                    <>
                      {activity.registration_fee && (
                        <p className="text-md text-foreground mt-4 flex items-center gap-2">
                          {t('registration fee label')}: <span className="font-medium">{activity.registration_fee}</span>
                        </p>
                      )}
                      {activity.price && (
                        <p className="text-md text-foreground mb-4 flex items-center gap-2">
                          {t('price label')}: <span className="font-medium">{activity.price}</span>
                        </p>
                      )}
                      {!activity.price && activity.program_price_tiers && activity.program_price_tiers.length > 0 && (
                        <div className="mt-4">
                          <h3 className="text-lg font-semibold text-primary mb-2">{t('price details')}</h3>
                          <Card className="mb-4 shadow-sm">
                            <CardContent className="p-0">
                              <Table className="w-full">
                                <TableHeader>
                                  <TableRow>
                                    <TableHead className="w-[150px]">{t('number of meetings')}</TableHead>
                                    <TableHead className="text-right">{t('price')}</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {activity.program_price_tiers.map((row, rowIndex) => (
                                    <TableRow key={rowIndex}>
                                      <TableCell className="font-medium">{row.participants_key}</TableCell>
                                      <TableCell className="text-right">{row.price}</TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </CardContent>
                          </Card>
                        </div>
                      )}
                      {activity.program_topics && activity.program_topics.length > 0 && (
                        <div className="mt-4">
                          <h3 className="text-lg font-semibold text-primary mb-4">{t('topics included')}</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {activity.program_topics.map((topic, topicIdx) => {
                              const TopicIcon = getIconComponent(topic.icon_name);
                              return (
                                <Card key={topicIdx} className="p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
                                  <CardHeader className="p-0 pb-2 flex flex-row items-center gap-3">
                                    {TopicIcon && <TopicIcon size={24} className="text-primary flex-shrink-0" />}
                                    <CardTitle className="text-base font-semibold">{topic.title}</CardTitle>
                                  </CardHeader>
                                  <CardContent className="p-0 text-sm text-muted-foreground">
                                    {topic.description}
                                  </CardContent>
                                </Card>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {/* Camp specific details */}
                  {activity.type === 'camp' && activity.camp_day_links && activity.camp_day_links.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {activity.camp_day_links.map((day, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          onClick={() => handleDayLinkClick(activity.title, day.label)}
                          className="hover:bg-accent hover:text-accent-foreground"
                        >
                          {day.label}
                        </Button>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <p className="text-center text-muted-foreground mt-8 text-lg">{t('no activities available')}</p>
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