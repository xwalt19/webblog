"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { getIconComponent } from "@/utils/iconMap";
import { CalendarDays, Code, Users, GraduationCap, BellRing, Tent, Cpu } from "lucide-react";

interface Program {
  id: string;
  title: string;
  description: string;
  schedule: string | null;
  type: "kids" | "private" | "professional";
  icon_name: string | null;
  created_at: string;
}

interface Camp {
  id: string;
  title: string;
  description: string;
  dates: string; // This is a string like "June 10-15, 2025"
  created_at: string;
}

interface RegularEvent {
  id: string;
  name: string;
  description: string;
  schedule: string; // This is a time string like "14:30"
  icon_name: string | null;
  created_at: string;
}

interface TrainingProgram {
  id: string;
  title: string;
  description: string;
  dates: string; // This is a string like "July 2025"
  icon_name: string | null;
  created_at: string;
}

interface ActivityItem {
  id: string;
  title: string;
  description: string;
  displayDate: string; // Formatted date/time for display
  sortDate: Date; // Date object for sorting
  type: 'program' | 'camp' | 'regular_event' | 'training_program';
  icon?: React.ElementType;
  originalUrl: string; // Link to original detail page if applicable
}

const ACTIVITIES_PER_PAGE = 9;

const AllActivities: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [allActivities, setAllActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const formatDate = (isoString: string) => {
    const dateObj = new Date(isoString);
    return dateObj.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const formatDateTime = (isoString: string) => {
    const dateObj = new Date(isoString);
    return dateObj.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false });
  };

  const getIconForActivityType = (type: ActivityItem['type'], iconName?: string | null) => {
    if (iconName) {
      const IconComponent = getIconComponent(iconName);
      if (IconComponent) return IconComponent;
    }
    switch (type) {
      case 'program': return GraduationCap;
      case 'camp': return Tent;
      case 'regular_event': return BellRing;
      case 'training_program': return Cpu;
      default: return Code; // Default icon
    }
  };

  useEffect(() => {
    const fetchAllActivities = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data: programsData, error: programsError } = await supabase.from('programs').select('*');
        if (programsError) throw programsError;

        const { data: campsData, error: campsError } = await supabase.from('camps').select('*');
        if (campsError) throw campsError;

        const { data: regularEventsData, error: regularEventsError } = await supabase.from('regular_events').select('*');
        if (regularEventsError) throw regularEventsError;

        const { data: trainingProgramsData, error: trainingProgramsError } = await supabase.from('training_programs').select('*');
        if (trainingProgramsError) throw trainingProgramsError;

        const combined: ActivityItem[] = [];

        programsData.forEach((p: Program) => {
          combined.push({
            id: p.id,
            title: p.title,
            description: p.description,
            displayDate: p.schedule ? formatDateTime(p.schedule) : formatDate(p.created_at),
            sortDate: p.schedule ? new Date(p.schedule) : new Date(p.created_at),
            type: 'program',
            icon: getIconForActivityType('program', p.icon_name),
            originalUrl: `/info/programs`, // Link to general programs page
          });
        });

        campsData.forEach((c: Camp) => {
          combined.push({
            id: c.id,
            title: c.title,
            description: c.description,
            displayDate: c.dates, // Dates string is already formatted
            sortDate: new Date(c.created_at), // Use created_at for sorting if dates is not parseable
            type: 'camp',
            icon: getIconForActivityType('camp'),
            originalUrl: `/info/camps`, // Link to general camps page
          });
        });

        regularEventsData.forEach((re: RegularEvent) => {
          // For regular events, combine created_at date with schedule time for sorting
          const eventDate = new Date(re.created_at);
          const [hours, minutes] = re.schedule.split(':').map(Number);
          eventDate.setHours(hours, minutes, 0, 0);

          combined.push({
            id: re.id,
            title: re.name,
            description: re.description,
            displayDate: `${formatDate(re.created_at)} ${re.schedule}`,
            sortDate: eventDate,
            type: 'regular_event',
            icon: getIconForActivityType('regular_event', re.icon_name),
            originalUrl: `/info/regular-events-classes`, // Link to general regular events page
          });
        });

        trainingProgramsData.forEach((tp: TrainingProgram) => {
          combined.push({
            id: tp.id,
            title: tp.title,
            description: tp.description,
            displayDate: tp.dates, // Dates string is already formatted
            sortDate: new Date(tp.created_at), // Use created_at for sorting if dates is not parseable
            type: 'training_program',
            icon: getIconForActivityType('training_program', tp.icon_name),
            originalUrl: `/info/training`, // Link to general training page
          });
        });

        // Sort all activities by their sortDate (most recent first)
        combined.sort((a, b) => b.sortDate.getTime() - a.sortDate.getTime());
        setAllActivities(combined);

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
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return allActivities.filter(activity => {
      const matchesSearch = activity.title.toLowerCase().includes(lowerCaseSearchTerm) ||
                            activity.description.toLowerCase().includes(lowerCaseSearchTerm);
      const matchesType = selectedType === "all" || activity.type === selectedType;
      return matchesSearch && matchesType;
    });
  }, [allActivities, searchTerm, selectedType]);

  const totalPages = Math.ceil(filteredActivities.length / ACTIVITIES_PER_PAGE);
  const currentActivities = useMemo(() => {
    const startIndex = (currentPage - 1) * ACTIVITIES_PER_PAGE;
    const endIndex = startIndex + ACTIVITIES_PER_PAGE;
    return filteredActivities.slice(startIndex, endIndex);
  }, [filteredActivities, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    setCurrentPage(1); // Reset page when filters or search term changes
  }, [searchTerm, selectedType]);

  if (error) {
    return (
      <div className="container mx-auto py-10 px-4 bg-muted/40 rounded-lg shadow-inner">
        <p className="text-center text-destructive">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4 bg-muted/40 rounded-lg shadow-inner">
      <section className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary">{t('all activities title')}</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          {t('all activities subtitle')}
        </p>
      </section>

      <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-10 flex-wrap">
        <Input
          type="text"
          placeholder={t('search activity')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:max-w-xs"
        />
        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder={t('filter by type')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('all types')}</SelectItem>
            <SelectItem value="program">{t('program type')}</SelectItem>
            <SelectItem value="camp">{t('camp type')}</SelectItem>
            <SelectItem value="regular_event">{t('regular event type')}</SelectItem>
            <SelectItem value="training_program">{t('training program type')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <p className="text-center text-muted-foreground">{t('loading activities')}</p>
      ) : currentActivities.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentActivities.map((activity) => {
            const ActivityIcon = activity.icon;
            return (
              <Card key={activity.id} className="flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="pb-4 flex-grow">
                  <div className="flex items-center gap-3 mb-2">
                    {ActivityIcon && <ActivityIcon className="text-primary" size={28} />}
                    <CardTitle className="text-xl font-semibold">{activity.title}</CardTitle>
                  </div>
                  <CardDescription className="text-sm text-muted-foreground">
                    {activity.displayDate}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 pt-0">
                  <p className="text-muted-foreground mb-4 line-clamp-3">{activity.description}</p>
                  {activity.originalUrl && (
                    <Link to={activity.originalUrl}>
                      <Button variant="outline" className="w-full">
                        {t('view details')}
                      </Button>
                    </Link>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <p className="text-center text-muted-foreground mt-8 text-lg">{t('no matching activities found')}</p>
      )}

      {totalPages > 1 && (
        <Pagination className="mt-12">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => handlePageChange(currentPage - 1)}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : undefined}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  onClick={() => handlePageChange(page)}
                  isActive={currentPage === page}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={() => handlePageChange(currentPage + 1)}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : undefined}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      <div className="text-center mt-12">
        <Link to="/">
          <Button>{t('return to home')}</Button>
        </Link>
      </div>
    </div>
  );
};

export default AllActivities;