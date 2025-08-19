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
import { formatDisplayDateTime } from "@/utils/dateUtils";

interface RegularEvent {
  id: string;
  name: string;
  schedule: string; // Now an ISO string
  description: string;
  icon_name: string | null;
  banner_image_url: string | null; // New
  quota: number | null; // New
  registration_link: string | null; // New
  created_by: string | null;
  created_at: string;
}

const ManageRegularEvents: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { session, profile, loading: sessionLoading } = useSession();
  const isAdmin = profile?.role === 'admin';

  const [regularEvents, setRegularEvents] = useState<RegularEvent[]>([]);
  const [isInitialDataLoaded, setIsInitialDataLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState(false);

  const fetchRegularEvents = async () => {
    setIsFetching(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('regular_events')
        .select('*') // Select all columns including new ones
        .order('name', { ascending: true }) // Order by name first
        .order('created_at', { ascending: false }); // Then by created_at

      if (error) {
        throw error;
      }
      setRegularEvents(data || []);
    } catch (err: any) {
      console.error("Error fetching regular events:", err);
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

    fetchRegularEvents();

  }, [session, isAdmin, sessionLoading, navigate, t]);

  const handleDelete = async (id: string) => {
    if (!window.confirm(t("confirm delete regular event"))) {
      return;
    }
    try {
      // Delete related rundowns and FAQs first due to foreign key constraints
      await supabase.from('regular_event_rundowns').delete().eq('event_id', id);
      await supabase.from('regular_event_faqs').delete().eq('event_id', id);

      const { error } = await supabase
        .from('regular_events')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }
      toast.success(t("deleted successfully"));
      fetchRegularEvents();
    }
    catch (err: any) {
      console.error("Error deleting event:", err);
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
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary">{t('regular events')}</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          {t('manage regular events subtitle')}
        </p>
      </section>

      <div className="flex justify-end mb-6">
        <Link to="/admin/regular-events/new">
          <Button>
            <PlusCircle className="h-4 w-4 mr-2" /> {t('add new regular event')}
          </Button>
        </Link>
      </div>

      {error ? (
        <p className="text-center text-destructive">{error}</p>
      ) : regularEvents.length > 0 ? (
        <Card className="shadow-lg">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('name label')}</TableHead>
                  <TableHead>{t('schedule label')}</TableHead>
                  <TableHead>{t('table icon')}</TableHead>
                  <TableHead>{t('quota label')}</TableHead> {/* New TableHead */}
                  <TableHead>{t('table date')}</TableHead>
                  <TableHead className="text-right">{t('table actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {regularEvents.map((event) => {
                  const EventIcon = getIconComponent(event.icon_name);
                  return (
                    <TableRow key={event.id}>
                      <TableCell className="font-medium">{event.name}</TableCell>
                      <TableCell>{formatDisplayDateTime(event.schedule)}</TableCell>
                      <TableCell>
                        {EventIcon ? <EventIcon className="h-5 w-5" /> : '-'}
                      </TableCell>
                      <TableCell>{event.quota !== null ? event.quota : t('unlimited')}</TableCell> {/* Display quota */}
                      <TableCell>{formatDisplayDateTime(event.created_at)}</TableCell>
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
        <p className="text-center text-muted-foreground mt-8 text-lg">{t('no regular events found')}</p>
      )}

      {isFetching && regularEvents.length > 0 && (
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

export default ManageRegularEvents;