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

interface RunningClass {
  id: string;
  name: string;
  schedule: string;
  description: string;
  icon_name: string | null;
  created_by: string | null;
  created_at: string;
}

const ManageRunningClasses: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { session, profile, loading: sessionLoading } = useSession();
  const isAdmin = profile?.role === 'admin';

  const [runningClasses, setRunningClasses] = useState<RunningClass[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionLoading) {
      if (!session) {
        toast.error(t('login required'));
        navigate('/login');
      } else if (!isAdmin) {
        toast.error(t('admin required'));
        navigate('/');
      } else {
        fetchRunningClasses();
      }
    }
  }, [session, isAdmin, sessionLoading, navigate, t]);

  const fetchRunningClasses = async () => {
    setDataLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('running_classes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }
      setRunningClasses(data || []);
    } catch (err: any) {
      console.error("Error fetching running classes:", err);
      setError(t("fetch data error", { error: err.message }));
    } finally {
      setDataLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(t("confirm delete running class"))) {
      return;
    }
    try {
      const { error } = await supabase
        .from('running_classes')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }
      toast.success(t("deleted successfully"));
      fetchRunningClasses(); // Refresh the list
    } catch (err: any) {
      console.error("Error deleting class:", err);
      toast.error(t("delete error", { error: err.message }));
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
        <p className="text-foreground">{t('loading status')}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <section className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary">{t('running classes')}</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          {t('manage running classes subtitle')}
        </p>
      </section>

      <div className="flex justify-end mb-6">
        <Link to="/admin/running-classes/new">
          <Button>
            <PlusCircle className="h-4 w-4 mr-2" /> {t('add new running class')}
          </Button>
        </Link>
      </div>

      {dataLoading ? (
        <p className="text-center text-muted-foreground">{t('loading status')}</p>
      ) : error ? (
        <p className="text-center text-destructive">{error}</p>
      ) : runningClasses.length > 0 ? (
        <Card className="shadow-lg">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('name label')}</TableHead>
                  <TableHead>{t('schedule label')}</TableHead>
                  <TableHead>{t('table icon')}</TableHead>
                  <TableHead>{t('table date')}</TableHead>
                  <TableHead className="text-right">{t('table actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {runningClasses.map((cls) => {
                  const ClassIcon = getIconComponent(cls.icon_name);
                  return (
                    <TableRow key={cls.id}>
                      <TableCell className="font-medium">{cls.name}</TableCell>
                      <TableCell>{cls.schedule}</TableCell>
                      <TableCell>
                        {ClassIcon ? <ClassIcon className="h-5 w-5" /> : '-'}
                      </TableCell>
                      <TableCell>{formatDisplayDate(cls.created_at)}</TableCell>
                      <TableCell className="text-right">
                        <Link to={`/admin/running-classes/${cls.id}/edit`}>
                          <Button variant="ghost" size="icon" className="mr-2">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button variant="destructive" size="icon" onClick={() => handleDelete(cls.id)}>
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
        <p className="text-center text-muted-foreground mt-8 text-lg">{t('no running classes found')}</p>
      )}

      <div className="text-center mt-12">
        <Link to="/">
          <Button>{t('back to list button')}</Button>
        </Link>
      </div>
    </div>
  );
};

export default ManageRunningClasses;