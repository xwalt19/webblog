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
import { Edit, Trash, PlusCircle, Link as LinkIcon } from "lucide-react";

interface Camp {
  id: string;
  title: string;
  dates: string;
  description: string;
  created_by: string | null;
  created_at: string;
}

const ManageCamps: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { session, profile, loading: sessionLoading } = useSession();
  const isAdmin = profile?.role === 'admin';

  const [camps, setCamps] = useState<Camp[]>([]);
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
        fetchCamps();
      }
    }
  }, [session, isAdmin, sessionLoading, navigate, t]);

  const fetchCamps = async () => {
    setDataLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('camps')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }
      setCamps(data || []);
    } catch (err: any) {
      console.error("Error fetching camps:", err);
      setError(t("manage camps.fetch error", { error: err.message }));
    } finally {
      setDataLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(t("manage camps.confirm delete"))) {
      return;
    }
    try {
      // Delete related camp day links first due to foreign key constraints
      await supabase.from('camp_day_links').delete().eq('camp_id', id);

      const { error } = await supabase
        .from('camps')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }
      toast.success(t("manage camps.camp deleted successfully"));
      fetchCamps(); // Refresh the list
    } catch (err: any) {
      console.error("Error deleting camp:", err);
      toast.error(t("manage camps.delete error", { error: err.message }));
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
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary">{t('manage camps.title')}</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          {t('manage camps.subtitle')}
        </p>
      </section>

      <div className="flex justify-end mb-6">
        <Link to="/admin/camps/new">
          <Button>
            <PlusCircle className="h-4 w-4 mr-2" /> {t('manage camps.add new camp')}
          </Button>
        </Link>
      </div>

      {dataLoading ? (
        <p className="text-center text-muted-foreground">{t('manage camps.loading camps')}</p>
      ) : error ? (
        <p className="text-center text-destructive">{error}</p>
      ) : camps.length > 0 ? (
        <Card className="shadow-lg">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('manage camps.table title')}</TableHead>
                  <TableHead>{t('manage camps.table dates')}</TableHead>
                  <TableHead>{t('manage camps.table description')}</TableHead>
                  <TableHead>{t('manage camps.table day links')}</TableHead>
                  <TableHead className="text-right">{t('manage camps.table actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {camps.map((camp) => (
                  <TableRow key={camp.id}>
                    <TableCell className="font-medium">{camp.title}</TableCell>
                    <TableCell>{camp.dates}</TableCell>
                    <TableCell className="max-w-xs truncate">{camp.description}</TableCell>
                    <TableCell>
                      <Link to={`/admin/camps/${camp.id}/edit`} className="text-blue-600 hover:underline flex items-center gap-1">
                        <LinkIcon className="h-4 w-4" /> {t('manage camps.view links')}
                      </Link>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link to={`/admin/camps/${camp.id}/edit`}>
                        <Button variant="ghost" size="icon" className="mr-2">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button variant="destructive" size="icon" onClick={() => handleDelete(camp.id)}>
                        <Trash className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <p className="text-center text-muted-foreground mt-8 text-lg">{t('manage camps.no camps')}</p>
      )}

      <div className="text-center mt-12">
        <Link to="/">
          <Button>{t('back to home')}</Button>
        </Link>
      </div>
    </div>
  );
};

export default ManageCamps;