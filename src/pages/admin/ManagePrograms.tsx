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
import { CalendarEvent } from "./ManageCalendar"; // Import CalendarEvent interface

interface Program {
  id: string;
  title: string;
  description: string;
  schedule: string | null;
  registration_fee: string | null;
  price: string | null;
  type: "kids" | "private" | "professional";
  icon_name: string | null;
  created_by: string | null;
  created_at: string;
}

const ManagePrograms: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { session, profile, loading: sessionLoading } = useSession();
  const isAdmin = profile?.role === 'admin';
  const queryClient = useQueryClient();

  // Query to fetch programs
  const { data: programs, isLoading: isProgramsLoading, isError: isProgramsError, error: programsError, isFetching: isProgramsFetching } = useQuery<Program[], Error>({
    queryKey: ['programs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('programs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!session && isAdmin, // Only run query if session exists and user is admin
  });

  // Mutation for deleting a program
  const deleteProgramMutation = useMutation<void, Error, string>({
    mutationFn: async (id) => {
      // Delete related price tiers and topics first due to foreign key constraints
      await supabase.from('program_price_tiers').delete().eq('program_id', id);
      await supabase.from('program_topics').delete().eq('program_id', id);
      // Delete associated calendar events
      await supabase.from('calendar_events').delete().eq('program_id', id);

      const { error } = await supabase
        .from('programs')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['programs'] }); // Invalidate the query to refetch the list
      queryClient.invalidateQueries({ queryKey: ['calendarEvents'] }); // Invalidate calendar events as well
      toast.success(t("deleted successfully"));
    },
    onError: (err) => {
      console.error("Error deleting program:", err);
      toast.error(t("delete error", { error: err.message }));
    },
  });

  // Authentication and authorization check
  useEffect(() => {
    if (!sessionLoading) {
      if (!session) {
        toast.error(t('login required'));
        navigate('/login');
      } else if (!isAdmin) {
        toast.error(t('admin required'));
        navigate('/');
      }
    }
  }, [session, isAdmin, sessionLoading, navigate, t]);

  // Real-time subscription for programs, price tiers, topics, and calendar events
  useEffect(() => {
    if (!session || !isAdmin) {
      return;
    }

    const programChannel = supabase
      .channel('programs_admin_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'programs' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['programs'] });
        }
      )
      .subscribe();

    const priceTiersChannel = supabase
      .channel('program_price_tiers_admin_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'program_price_tiers' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['programs'] });
        }
      )
      .subscribe();

    const topicsChannel = supabase
      .channel('program_topics_admin_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'program_topics' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['programs'] });
        }
      )
      .subscribe();

    const calendarEventsChannel = supabase
      .channel('calendar_events_program_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'calendar_events' },
        (payload) => {
          // Only invalidate if the change is related to a program_id
          const newEvent = payload.new as CalendarEvent;
          const oldEvent = payload.old as CalendarEvent;
          if (newEvent?.program_id || oldEvent?.program_id) {
            queryClient.invalidateQueries({ queryKey: ['programs'] });
            queryClient.invalidateQueries({ queryKey: ['calendarEvents'] });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(programChannel);
      supabase.removeChannel(priceTiersChannel);
      supabase.removeChannel(topicsChannel);
      supabase.removeChannel(calendarEventsChannel);
    };
  }, [session, isAdmin, queryClient]);

  const handleDelete = (id: string) => {
    if (!window.confirm(t("confirm delete program"))) {
      return;
    }
    deleteProgramMutation.mutate(id);
  };

  const formatDisplayDate = (isoString: string) => {
    const dateObj = new Date(isoString);
    return dateObj.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Render loading state based on sessionLoading OR dataLoading
  if (sessionLoading || (!session && !sessionLoading) || (session && !isAdmin)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-foreground">{t('loading status')}</p>
      </div>
    );
  }

  if (isProgramsLoading) {
    return (
      <div className="container mx-auto py-10 px-4">
        <p className="text-center text-muted-foreground">{t('loading status')}</p>
      </div>
    );
  }

  if (isProgramsError) {
    return (
      <div className="container mx-auto py-10 px-4">
        <p className="text-center text-destructive">{t("fetch data error", { error: programsError?.message })}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <section className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary">{t('manage programs')}</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          {t('manage programs subtitle')}
        </p>
      </section>

      <div className="flex justify-end mb-6">
        <Link to="/admin/programs/new">
          <Button>
            <PlusCircle className="h-4 w-4 mr-2" /> {t('add new program')}
          </Button>
        </Link>
      </div>

      {programs && programs.length > 0 ? (
        <Card className="shadow-lg">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('table title')}</TableHead>
                  <TableHead>{t('table type')}</TableHead>
                  <TableHead>{t('table icon')}</TableHead>
                  <TableHead>{t('table date')}</TableHead>
                  <TableHead className="text-right">{t('table actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {programs.map((program) => {
                  const ProgramIcon = getIconComponent(program.icon_name);
                  return (
                    <TableRow key={program.id}>
                      <TableCell className="font-medium">{program.title}</TableCell>
                      <TableCell>{program.type}</TableCell>
                      <TableCell>
                        {ProgramIcon ? <ProgramIcon className="h-5 w-5" /> : '-'}
                      </TableCell>
                      <TableCell>{formatDisplayDate(program.created_at)}</TableCell>
                      <TableCell className="text-right">
                        <Link to={`/admin/programs/${program.id}/edit`}>
                          <Button variant="ghost" size="icon" className="mr-2">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button variant="destructive" size="icon" onClick={() => handleDelete(program.id)} disabled={deleteProgramMutation.isPending}>
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
        <p className="text-center text-muted-foreground mt-8 text-lg">{t('no programs found')}</p>
      )}

      {isProgramsFetching && programs && programs.length > 0 && (
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

export default ManagePrograms;