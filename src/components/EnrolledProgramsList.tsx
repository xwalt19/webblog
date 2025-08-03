"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/components/SessionProvider";
import { getIconComponent } from "@/utils/iconMap";
import { CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

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
  const { t, i18n } = useTranslation();
  const { session, loading: sessionLoading } = useSession();
  const [enrolledPrograms, setEnrolledPrograms] = useState<EnrolledProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEnrolledPrograms = async () => {
      if (!session?.user) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
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
        setEnrolledPrograms(data || []);
      } catch (err: any) {
        console.error("Error fetching enrolled programs:", err);
        setError(t("fetch data error", { error: err.message }));
      } finally {
        setLoading(false);
      }
    };

    if (!sessionLoading) {
      fetchEnrolledPrograms();
    }
  }, [session, sessionLoading, t]);

  const handleUnenroll = async (enrollmentId: string, programTitle: string) => {
    if (!window.confirm(t('confirm unenroll', { programTitle }))) {
      return;
    }

    const toastId = toast.loading(t('unenrolling from program', { programTitle }));

    try {
      const { error } = await supabase
        .from('user_programs')
        .delete()
        .eq('id', enrollmentId)
        .eq('user_id', session?.user?.id);

      if (error) {
        throw error;
      }

      setEnrolledPrograms(prev => prev.filter(p => p.id !== enrollmentId));
      toast.success(t('unenrolled successfully', { programTitle }), { id: toastId });
    } catch (err: any) {
      console.error("Error unenrolling:", err);
      toast.error(t('unenrollment failed', { error: err.message }), { id: toastId });
    }
  };

  const formatEnrolledDate = (isoString: string) => {
    const dateObj = new Date(isoString);
    return dateObj.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  if (loading) {
    return <p className="text-center text-muted-foreground">{t('loading enrolled programs')}</p>;
  }

  if (error) {
    return <p className="text-center text-destructive">{error}</p>;
  }

  if (enrolledPrograms.length === 0) {
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
                  <span>{t('enrolled on')} {formatEnrolledDate(enrollment.enrolled_at)}</span>
                </div>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                {program.schedule && (
                  <p className="text-md text-foreground mb-2">
                    {t('schedule label')}: <span className="font-medium">{program.schedule}</span>
                  </p>
                )}
                {program.price && (
                  <p className="text-md text-foreground mb-4">
                    {t('price label')}: <span className="font-medium">{program.price}</span>
                  </p>
                )}
                <Button
                  variant="destructive"
                  className="w-full mt-4"
                  onClick={() => handleUnenroll(enrollment.id, program.title)}
                >
                  {t('unenroll button')}
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