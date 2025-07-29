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

interface RegularEvent {
  id: string;
  name: string;
  schedule: string;
  description: string;
  icon_name: string | null;
  created_by: string | null;
  created_at: string;
}

const ManageRegularEvents: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { session, profile, loading: sessionLoading } = useSession();
  const isAdmin = profile?.role === 'admin';

  const [regularEvents, setRegularEvents] = useState<RegularEvent[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionLoading) {
      if (!session) {
        toast.error(t('auth.login_required'));
        navigate('/login');
      } else if (!isAdmin) {
        toast.error(t('auth.admin_required'));
        navigate('/');
      } else {
        fetchRegularEvents();
      }
    }
  }, [session, isAdmin, sessionLoading, navigate, t]);

  const fetchRegularEvents = async () => {
    setDataLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('regular_events')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }
      setRegularEvents(data || []);
    } catch (err: any) {
      console.error("Error fetching regular events:", err);
      setError(t("message.fetch_error", { error: err.message }));
    } finally {
      setDataLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(t("admin.regular_event.confirm_delete"))) {
      return;
    }
    try {
      const { error } = await supabase
        .from('regular_events')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }
      toast.success(t("success.deleted"));
      fetchRegularEvents(); // Refresh the list
    } catch (err: any) {
      console.error("Error deleting event:", err);
      toast.error(t("message.delete_error", { error: err.message }));
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
        <p className="text-foreground">{t('status.loading')}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <section className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary">{t('admin.regular_event.title')}</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          {t('admin.regular_event.subtitle')}
        </p>
      </section>

      <div className="flex justify-end mb-6">
        <Link to="/admin/regular-events/new">
          <Button>
            <PlusCircle className="h-4 w-4 mr-2" /> {t('admin.regular_event.add_new')}
          </Button>
        </Link>
      </div>

      {dataLoading ? (
        <p className="text-center text-muted-foreground">{t('status.loading')}</p>
      ) : error ? (
        <p className="text-center text-destructive">{error}</p>
      ) : regularEvents.length > 0 ? (
        <Card className="shadow-lg">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('admin.regular_event.table.name')}</TableHead>
                  <TableHead>{t('admin.regular_event.table.schedule')}</TableHead>
                  <TableHead>{t('admin.regular_event.table.icon')}</TableHead>
                  <TableHead>{t('admin.regular_event.table.date')}</TableHead>
                  <TableHead className="text-right">{t('admin.regular_event.table.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {regularEvents.map((event) => {
                  const EventIcon = getIconComponent(event.icon_name);
                  return (
                    <TableRow key={event.id}>
                      <TableCell className="font-medium">{event.name}</TableCell>
                      <TableCell>{event.schedule}</TableCell>
                      <TableCell>
                        {EventIcon ? <EventIcon className="h-5 w-5" /> : '-'}
                      </TableCell>
                      <TableCell>{formatDisplayDate(event.created_at)}</TableCell>
                      <TableCell className="text-right">
                        <Link to={`/admin/regular-events/${event.id}/edit`}>
                          <Button variant="ghost" size="icon" className="mr-2">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button variant="destructive" size="icon" onClick={() => handleDelete(event.id)}>
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
        <p className="text-center text-muted-foreground mt-8 text-lg">{t('admin.regular_event.no_events')}</p>
      )}

      <div className="text-center mt-12">
        <Link to="/">
          <Button>{t('button.back_to_list')}</Button>
        </Link>
      </div>
    </div>
  );
};

export default ManageRegularEvents;