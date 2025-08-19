"use client";

import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CalendarDays } from "lucide-react";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { getIconComponent } from "@/utils/iconMap";
import { formatDynamicScheduleOrDates } from "@/utils/dateUtils";
import { useQuery } from "@tanstack/react-query";

interface SupabaseTrainingProgram {
  id: string;
  title: string;
  dates: string; // Now a formatted string
  description: string;
  icon_name: string | null;
  created_by: string | null;
  created_at: string;
}

const Training: React.FC = () => {
  const { t } = useTranslation();

  const { data: trainingPrograms, isLoading, isError, error } = useQuery<SupabaseTrainingProgram[], Error>({
    queryKey: ['trainingProgramsPublic'], // Unique key for public training programs
    queryFn: async () => {
      const { data, error } = await supabase
        .from('training_programs')
        .select('*')
        .order('created_at', { ascending: false });

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
        <p className="text-center text-muted-foreground">{t('loading training programs')}</p>
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

  if (!trainingPrograms || trainingPrograms.length === 0) {
    return (
      <div className="container mx-auto py-10 px-4 bg-muted/40 rounded-lg shadow-inner">
        <p className="text-center text-muted-foreground mt-8 text-lg">{t('no training programs found')}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <section className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground capitalize">{t('our training programs title')}</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          {t('our training programs subtitle')}
        </p>
      </section>

      <section className="mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trainingPrograms.map((program) => {
            const ProgramIcon = getIconComponent(program.icon_name);
            return (
              <Card key={program.id} className="flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3 mb-2">
                    {ProgramIcon && <ProgramIcon className="text-primary" size={28} />}
                    <CardTitle className="text-xl font-semibold">{program.title}</CardTitle>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CalendarDays size={16} />
                    <span>{formatDynamicScheduleOrDates(program.dates)}</span>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow p-6 pt-0">
                  <div
                    className="prose dark:prose-invert max-w-none text-muted-foreground"
                    dangerouslySetInnerHTML={{ __html: program.description }}
                  />
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      <div className="text-center mt-12">
        <Link to="/">
          <Button>{t('return to home')}</Button>
        </Link>
      </div>
    </div>
  );
};

export default Training;