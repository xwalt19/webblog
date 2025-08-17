"use client";

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/components/SessionProvider";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Trash, PlusCircle } from "lucide-react";
import { getIconComponent } from "@/utils/iconMap";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { formatDisplayDate } from "@/utils/dateUtils"; // Import from dateUtils

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
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { session, profile, loading: sessionLoading } = useSession();
  const isAdmin = profile?.role === 'admin';
  const queryClient = useQueryClient();

  const [trainingPrograms, setTrainingPrograms] = useState<TrainingProgram[]>([]);
  const [isInitialDataLoaded, setIsInitialDataLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState(false);

  const fetchTrainingPrograms = async () => {
    setIsFetching(true);
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
      setError(t("fetch data error", { error: err.message }));
    } finally {
      setIsFetching(false);
      setIsInitialDataLoaded(true);
    }
  };

  useEffect(() => {
    if (sessionLoading) {
      return;
    }

    if (!session) {
      toast.error(t('login required'));
      navigate('/login');
      return;
    }

    if (!isAdmin) {
      toast.error(t('admin required'));
      navigate('/');
      return;
    }

    fetchTrainingPrograms();

  }, [session, isAdmin, sessionLoading, navigate, t]);

  const handleDelete = async (id: string) => {
    if (!window.confirm(t("confirm delete training program"))) {
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
      toast.success(t("deleted successfully"));
      fetchTrainingPrograms();
    } catch (err: any) {
      console.error("Error deleting program:", err);
      toast.error(t("delete error", { error: err.message }));
    }
  };

  if (sessionLoading || (!session && !sessionLoading) || (session && !isAdmin)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-foreground">{t('loading status')}</p>
      </div>
    );
  }

  if (!isInitialDataLoaded) {
    return (
      <div className="container mx-auto py-10 px-4">
        <p className="text-center text-muted-foreground">{t('loading status')}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <section className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary capitalize">{t('training programs')}</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          {t('manage training programs subtitle')}
        </p>
      </section>

      <div className="flex justify-end mb-6">
        <Link to="/admin/training-programs/new">
          <Button>
            <PlusCircle className="h-4 w-4 mr-2" /> {t('add new training program')}
          </Button>
        </Link>
      </div>

      {error ? (
        <p className="text-center text-destructive">{error}</p>
      ) : trainingPrograms.length > 0 ? (
        <Card className="shadow-lg">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('table title')}</TableHead>
                  <TableHead>{t('dates label')}</TableHead>
                  <TableHead>{t('table icon')}</TableHead>
                  <TableHead>{t('table date')}</TableHead>
                  <TableHead className="text-right">{t('table actions')}</TableHead>
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
        <p className="text-center text-muted-foreground mt-8 text-lg">{t('no training programs found')}</p>
      )}

      {isFetching && trainingPrograms.length > 0 && (
        <p className="text-center text-muted-foreground mt-4">{t('updating data')}</p>
      )}

      <div className="text-center mt-12">
        <Link to="/">
          <Button>{t('back to list button')}</Button>
        </Link>
      </div>
    </div>
  );
};

export default ManageTrainingPrograms;