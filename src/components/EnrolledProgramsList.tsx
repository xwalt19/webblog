"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/components/SessionProvider";
import { getIconComponent } from "@/utils/iconMap";
import { CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { formatDisplayDate } from "@/utils/dateUtils";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface EnrolledProgram {
  id: string;
  program_id: string;
  enrolled_at: string;
  programs: Array<{
    id: string;
    title: string;
    description: string;
    schedule: string | null;
    registration_fee: string | null;
    price: string | null;
    type: "kids" | "private" | "professional";
    icon_name: string | null;
  }> | null;
}

const EnrolledProgramsList: React.FC = () => {
  const { t } = useTranslation();
  const { session, loading: sessionLoading } = useSession();
  const queryClient = useQueryClient();

  const { data: enrolledPrograms, isLoading, isError, error } = useQuery<EnrolledProgram[], Error>({
    queryKey: ['enrolledPrograms', session?.user?.id],
    queryFn: async () => {
      if (!session?.user) {
        return [];
      }
      const { data, error } = await supabase
        .from('user_programs')
        .select(`
            id,
            program_id,
            enrolled_at,
            programs (
              id,
              title,
              description,
              schedule,
              registration_fee,
              price,
              type,
              icon_name
            )
          `)
        .eq('user_id', session.user.id)
        .order('enrolled_at', { ascending: false });

      if (error) {
        throw error;
      }
      return data || [];
    },
    enabled: !!session?.user && !sessionLoading, // Only fetch if user is logged in and session is not loading
    staleTime: 5 * 60 * 1000, // Data considered fresh for 5 minutes
  });

  const unenrollMutation = useMutation<void, Error, { enrollmentId: string, programTitle: string }>({
    mutationFn: async ({ enrollmentId }) => {
      const { error } = await supabase
        .from('user_programs')
        .delete()
        .eq('id', enrollmentId)
        .eq('user_id', session?.user?.id);

      if (error) {
        throw error;
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['enrolledPrograms'] });
      toast.success(t('unenrolled successfully', { programTitle: variables.programTitle }));
    },
    onError: (err, variables) => {
      console.error("Error unenrolling:", err);
      toast.error(t('unenrollment failed', { error: err.message, programTitle: variables.programTitle }));
    },
  });

  const handleUnenroll = (enrollmentId: string, programTitle: string) => {
    if (!window.confirm(t('confirm unenroll', { programTitle }))) {
      return;
    }
    const toastId = toast.loading(t('unenrolling from program', { programTitle }));
    unenrollMutation.mutate({ enrollmentId, programTitle }, {
      onSettled: () => toast.dismiss(toastId)
    });
  };

  if (isLoading || sessionLoading) {
    return <p className="text-center text-muted-foreground">{t('loading enrolled programs')}</p>;
  }

  if (isError) {
    return <p className="text-center text-destructive">{error?.message}</p>;
  }

  if (!enrolledPrograms || enrolledPrograms.length === 0) {
    return <p className="text-center text-muted-foreground mt-8 text-lg">{t('no enrolled programs')}</p>;
  }

  return (
    <section className="mb-16">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">{t('my enrolled programs')}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {enrolledPrograms.map((enrollment) => {
          const program = enrollment.programs?.[0];
          if (!program) return null;

          const ProgramIcon = getIconComponent(program.icon_name);
          return (
            <Card key={enrollment.id} className="flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="pb-4 flex-grow">
                <div className="flex items-center gap-3 mb-2">
                  {ProgramIcon && <ProgramIcon className="text-primary" size={28} />}
                  <CardTitle className="text-xl font-semibold">{program.title}</CardTitle>
                </div>
                <CardDescription className="text-sm text-muted-foreground">
                  {program.description}
                </CardDescription>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                  <CalendarDays size={16} />
                  <span>{t('enrolled on')} {formatDisplayDate(enrollment.enrolled_at)}</span>
                </div>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                {program.schedule && (
                  <p className="text-md text-foreground mb-2">
                    {t('schedule label')}: <span className="font-medium">{program.schedule}</span>
                  </p>
                )}
                {program.registration_fee && (
                  <p className="text-md text-foreground mb-4">
                    {t('registration fee label')}: <span className="font-medium">{program.registration_fee}</span>
                  </p>
                )}
                <Button
                  variant="destructive"
                  className="w-full mt-4"
                  onClick={() => handleUnenroll(enrollment.id, program.title)}
                  disabled={unenrollMutation.isPending}
                >
                  {unenrollMutation.isPending ? t('unenrolling status') : t('unenroll button')}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
};

export default EnrolledProgramsList;