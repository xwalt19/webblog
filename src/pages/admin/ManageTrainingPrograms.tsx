"use client";

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/components/SessionProvider";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Trash, PlusCircle } from "lucide-react";
import { getIconComponent } from "@/utils/iconMap";

interface TrainingProgram {
  id: string;
  title: string;
  dates: string;
  description: string;
  icon_name: string | null;
  created_by: string | null;
  created_at: string;
}

const ManageTrainingPrograms: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { session, profile, loading: sessionLoading } = useSession();
  const isAdmin = profile?.role === 'admin';

  const [trainingPrograms, setTrainingPrograms] = useState<TrainingProgram[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionLoading) {
      if (!session) {
        toast.error(t('auth.login required'));
        navigate('/login');
      } else if (!isAdmin) {
        toast.error(t('auth.admin access required'));
        navigate('/');
      } else {
        fetchTrainingPrograms();
      }
    }
  }, [session, isAdmin, sessionLoading, navigate, t]);

  const fetchTrainingPrograms = async () => {
    setDataLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('training_programs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }
      setTrainingPrograms(data || []);
    } catch (err: any) {
      console.error("Error fetching training programs:", err);
      setError(t("manage training programs.fetch error", { error: err.message }));
    } finally {
      setDataLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(t("manage training programs.confirm delete"))) {
      return;
    }
    try {
      const { error } = await supabase
        .from('training_programs')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }
      toast.success(t("manage training programs.program deleted successfully"));
      fetchTrainingPrograms(); // Refresh the list
    } catch (err: any) {
      console.error("Error deleting program:", err);
      toast.error(t("manage training programs.delete error", { error: err.message }));
    }
  };

  const formatDisplayDate = (isoString: string) => {
    const dateObj = new Date(isoString);
    return dateObj.toLocaleDateString(i18n.language === 'id' ? 'id-ID' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (sessionLoading || (!session && !sessionLoading) || (session && !isAdmin)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-foreground">{t('loading')}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <section className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary">{t('manage training programs.title')}</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          {t('manage training programs.subtitle')}
        </p>
      </section>

      <div className="flex justify-end mb-6">
        <Link to="/admin/training-programs/new">
          <Button>
            <PlusCircle className="h-4 w-4 mr-2" /> {t('manage training programs.add new program')}
          </Button>
        </Link>
      </div>

      {dataLoading ? (
        <p className="text-center text-muted-foreground">{t('manage training programs.loading programs')}</p>
      ) : error ? (
        <p className="text-center text-destructive">{error}</p>
      ) : trainingPrograms.length > 0 ? (
        <Card className="shadow-lg">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('manage training programs.table title')}</TableHead>
                  <TableHead>{t('manage training programs.table dates')}</TableHead>
                  <TableHead>{t('manage training programs.table icon')}</TableHead>
                  <TableHead>{t('manage training programs.table date')}</TableHead>
                  <TableHead className="text-right">{t('manage training programs.table actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trainingPrograms.map((program) => {
                  const ProgramIcon = getIconComponent(program.icon_name);
                  return (
                    <TableRow key={program.id}>
                      <TableCell className="font-medium">{program.title}</TableCell>
                      <TableCell>{program.dates}</TableCell>
                      <TableCell>
                        {ProgramIcon ? <ProgramIcon className="h-5 w-5" /> : '-'}
                      </TableCell>
                      <TableCell>{formatDisplayDate(program.created_at)}</TableCell>
                      <TableCell className="text-right">
                        <Link to={`/admin/training-programs/${program.id}/edit`}>
                          <Button variant="ghost" size="icon" className="mr-2">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button variant="destructive" size="icon" onClick={() => handleDelete(program.id)}>
                          <Trash className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <p className="text-center text-muted-foreground mt-8 text-lg">{t('manage training programs.no programs')}</p>
      )}

      <div className="text-center mt-12">
        <Link to="/">
          <Button>{t('back to home')}</Button>
        </Link>
      </div>
    </div>
  );
};

export default ManageTrainingPrograms;