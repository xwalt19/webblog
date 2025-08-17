"use client";

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea"; // Keep Textarea for other uses if any, but it's not used for description anymore
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/components/SessionProvider";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Calendar as CalendarIcon, Edit, Trash } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAdminPageLogic } from "@/hooks/use-admin-page-logic";
import { formatDisplayDateTime } from "@/utils/dateUtils";
import RichTextEditor from "@/components/RichTextEditor"; // Import RichTextEditor

export interface CalendarEvent {
  id: string;
  title: string;
  description: string | null;
  date: string; // ISO string from database
  created_by: string;
  created_at: string;
  program_id: string | null;
}

const ManageCalendar: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { session } = useSession();
  const queryClient = useQueryClient();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<CalendarEvent | null>(null);
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formDate, setFormDate] = useState<Date | undefined>(undefined);

  const [shouldFetchData, setShouldFetchData] = useState(false);

  const { isLoadingAuth, isAuthenticatedAndAuthorized } = useAdminPageLogic({
    isAdminRequired: true,
    onAuthSuccess: () => setShouldFetchData(true),
  });

  const { data: events, isLoading: isEventsLoading, isError: isEventsError, error: eventsError } = useQuery<CalendarEvent[], Error>({
    queryKey: ['calendarEvents'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('calendar_events')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: shouldFetchData,
  });

  const saveEventMutation = useMutation<void, Error, Omit<CalendarEvent, 'created_at' | 'created_by' | 'program_id'> & { id?: string, program_id?: string | null }>({
    mutationFn: async (eventData) => {
      const dataToSave = {
        title: eventData.title,
        description: eventData.description || null,
        date: eventData.date,
        created_by: session?.user?.id,
        program_id: eventData.program_id || null,
      };

      if (eventData.id) {
        const { error } = await supabase
          .from('calendar_events')
          .update(dataToSave)
          .eq('id', eventData.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('calendar_events')
          .insert([dataToSave]);
        if (error) throw error;
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['calendarEvents'] });
      toast.success(variables.id ? t("updated successfully") : t("added successfully"));
      setIsDialogOpen(false);
    },
    onError: (err) => {
      console.error("Error saving event:", err);
      toast.error(t("save failed", { error: err.message }));
    },
  });

  const deleteEventMutation = useMutation<void, Error, string>({
    mutationFn: async (id) => {
      const { error } = await supabase
        .from('calendar_events')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calendarEvents'] });
      toast.success(t("deleted successfully"));
    },
    onError: (err) => {
      console.error("Error deleting event:", err);
      toast.error(t("delete error", { error: err.message }));
    },
  });

  useEffect(() => {
    if (!isAuthenticatedAndAuthorized) {
      return;
    }

    const channel = supabase
      .channel('calendar_events_admin_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'calendar_events' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['calendarEvents'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isAuthenticatedAndAuthorized, queryClient]);

  const handleAddEdit = () => {
    if (!formTitle || !formDate) {
      toast.error(t("required fields missing"));
      return;
    }

    saveEventMutation.mutate({
      id: currentEvent?.id,
      title: formTitle,
      description: formDescription,
      date: formDate.toISOString(),
      program_id: currentEvent?.program_id,
    });
  };

  const handleDelete = (id: string) => {
    if (!window.confirm(t("confirm delete calendar event"))) {
      return;
    }
    deleteEventMutation.mutate(id);
  };

  const openDialogForAdd = () => {
    setCurrentEvent(null);
    setFormTitle("");
    setFormDescription("");
    setFormDate(undefined);
    setIsDialogOpen(true);
  };

  const openDialogForEdit = (event: CalendarEvent) => {
    setCurrentEvent(event);
    setFormTitle(event.title);
    setFormDescription(event.description || "");
    setFormDate(new Date(event.date));
    setIsDialogOpen(true);
  };

  if (isLoadingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-foreground">{t('loading status')}</p>
      </div>
    );
  }

  if (!isAuthenticatedAndAuthorized) {
    return null;
  }

  if (isEventsLoading) {
    return (
      <div className="container mx-auto py-10 px-4">
        <p className="text-center text-muted-foreground">{t('loading status')}</p>
      </div>
    );
  }

  if (isEventsError) {
    return (
      <div className="container mx-auto py-10 px-4">
        <p className="text-center text-destructive">{t("fetch data error", { error: eventsError?.message })}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <section className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary capitalize">{t('manage calendar events')}</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          {t('manage calendar events subtitle')}
        </p>
      </section>

      <div className="flex justify-end mb-6">
        <Button onClick={openDialogForAdd}>{t('add new calendar event')}</Button>
      </div>

      {events && events.length > 0 ? (
        <Card className="shadow-lg">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('table title')}</TableHead>
                  <TableHead>{t('table date')}</TableHead>
                  <TableHead>{t('table description')}</TableHead>
                  <TableHead className="text-right">{t('table actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell className="font-medium">{event.title}</TableCell>
                    <TableCell>{formatDisplayDateTime(event.date)}</TableCell>
                    <TableCell className="max-w-xs truncate">{event.description}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => openDialogForEdit(event)} className="mr-2">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="icon" onClick={() => handleDelete(event.id)}>
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
        <p className="text-center text-muted-foreground mt-8 text-lg">{t('no calendar events found')}</p>
      )}

      {saveEventMutation.isPending || deleteEventMutation.isPending ? (
        <p className="text-center text-muted-foreground mt-4">{t('updating data')}</p>
      ) : null}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{currentEvent ? t('edit calendar event form') : t('add calendar event form')}</DialogTitle>
            <DialogDescription>
              {currentEvent ? t('edit calendar event form description') : t('add calendar event form description')}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                {t('title label')}
              </Label>
              <Input
                id="title"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                {t('description label')}
              </Label>
              <div className="col-span-3">
                <RichTextEditor
                  key={currentEvent?.id || "new-calendar-event"} // Pass key prop
                  value={formDescription}
                  onChange={setFormDescription}
                  placeholder={t('description placeholder')}
                />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date" className="text-right">
                {t('date label')}
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "col-span-3 justify-start text-left font-normal",
                      !formDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formDate ? format(formDate, "PPP") : <span>{t('pick a date button')}</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formDate}
                    onSelect={setFormDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={saveEventMutation.isPending}>
              {t('cancel button')}
            </Button>
            <Button onClick={handleAddEdit} disabled={saveEventMutation.isPending}>
              {saveEventMutation.isPending ? t('uploading status') : (currentEvent ? t('save changes button') : t('submit button'))}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="text-center mt-12">
        <Link to="/">
          <Button>{t('back to list button')}</Button>
        </Link>
      </div>
    </div>
  );
};

export default ManageCalendar;