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
import { Edit, Trash, PlusCircle, Link as LinkIcon } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { formatDisplayDate } from "@/utils/dateUtils"; // Import from dateUtils

interface CampDayLink {
  id: string;
  camp_id: string;
  label: string;
  url: string;
}

interface Camp {
  id: string;
  title: string;
  dates: string;
  description: string;
  created_by: string | null;
  created_at: string;
  camp_day_links: CampDayLink[]; // Joined data
}

const ManageCamps: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { session, profile, loading: sessionLoading } = useSession();
  const isAdmin = profile?.role === 'admin';
  const queryClient = useQueryClient();

  // Query to fetch camps
  const { data: camps, isLoading: isCampsLoading, isError: isCampsError, error: campsError, isFetching: isCampsFetching } = useQuery<Camp[], Error>({
    queryKey: ['camps'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('camps')
        .select('*, camp_day_links(*)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!session && isAdmin, // Only run query if session exists and user is admin
  });

  // Mutation for deleting a camp
  const deleteCampMutation = useMutation<void, Error, string>({
    mutationFn: async (id) => {
      // Delete related camp day links first due to foreign key constraints
      const { error: deleteLinksError } = await supabase.from('camp_day_links').delete().eq('camp_id', id);
      if (deleteLinksError) throw deleteLinksError;

      const { error: deleteCampError } = await supabase
        .from('camps')
        .delete()
        .eq('id', id);

      if (deleteCampError) throw deleteCampError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['camps'] }); // Invalidate the query to refetch the list
      toast.success(t("deleted successfully"));
    },
    onError: (err) => {
      console.error("Error deleting camp:", err);
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

  // Real-time subscription for camps and camp_day_links
  useEffect(() => {
    if (!session || !isAdmin) {
      return;
    }

    const campChannel = supabase
      .channel('camps_admin_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'camps' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['camps'] });
        }
      )
      .subscribe();

    const campDayLinksChannel = supabase
      .channel('camp_day_links_admin_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'camp_day_links' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['camps'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(campChannel);
      supabase.removeChannel(campDayLinksChannel);
    };
  }, [session, isAdmin, queryClient]);

  const handleDelete = (id: string) => {
    if (!window.confirm(t("confirm delete camp"))) {
      return;
    }
    deleteCampMutation.mutate(id);
  };

  if (sessionLoading || (!session && !sessionLoading) || (session && !isAdmin)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-foreground">{t('loading status')}</p>
      </div>
    );
  }

  if (isCampsLoading) {
    return (
      <div className="container mx-auto py-10 px-4">
        <p className="text-center text-muted-foreground">{t('loading status')}</p>
      </div>
    );
  }

  if (isCampsError) {
    return (
      <div className="container mx-auto py-10 px-4">
        <p className="text-center text-destructive">{t("fetch data error", { error: campsError?.message })}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <section className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary capitalize">{t('manage camps')}</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          {t('manage camps subtitle')}
        </p>
      </section>

      <div className="flex justify-end mb-6">
        <Link to="/admin/camps/new">
          <Button>
            <PlusCircle className="h-4 w-4 mr-2" /> {t('add new camp')}
          </Button>
        </Link>
      </div>

      {camps && camps.length > 0 ? (
        <Card className="shadow-lg">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('table title')}</TableHead>
                  <TableHead>{t('dates label')}</TableHead>
                  <TableHead>{t('table description')}</TableHead>
                  <TableHead>{t('day links')}</TableHead>
                  <TableHead className="text-right">{t('table actions')}</TableHead>
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
                        <LinkIcon className="h-4 w-4" /> {t('view links')} ({camp.camp_day_links.length})
                      </Link>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link to={`/admin/camps/${camp.id}/edit`}>
                        <Button variant="ghost" size="icon" className="mr-2">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button variant="destructive" size="icon" onClick={() => handleDelete(camp.id)} disabled={deleteCampMutation.isPending}>
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
        <p className="text-center text-muted-foreground mt-8 text-lg">{t('no camps found')}</p>
      )}

      {isCampsFetching && camps && camps.length > 0 && (
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

export default ManageCamps;