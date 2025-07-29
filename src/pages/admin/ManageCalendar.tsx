"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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

interface CalendarEvent {
  id: string;
  title: string;
  description: string | null;
  date: string; // ISO string from database
  created_by: string;
  created_at: string;
}

const ManageCalendar: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { session, profile, loading: sessionLoading } = useSession();
  const isAdmin = profile?.role === 'admin';

  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<CalendarEvent | null>(null);
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formDate, setFormDate] = useState<Date | undefined>(undefined);

  useEffect(() => {
    if (!sessionLoading) {
      if (!session) {
        toast.error(t('login required'));
        navigate('/login');
      } else if (!isAdmin) {
        toast.error(t('admin required'));
        navigate('/');
      } else {
        fetchEvents();
      }
    }
  }, [session, isAdmin, sessionLoading, navigate, t]);

  const fetchEvents = async () => {
    setDataLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('calendar_events')
        .select('*')
        .order('date', { ascending: false });

      if (error) {
        throw error;
      }
      setEvents(data || []);
    } catch (err: any) {
      console.error("Error fetching calendar events:", err);
      setError(t("fetch data error", { error: err.message }));
    } finally {
      setDataLoading(false);
    }
  };

  const handleAddEdit = async () => {
    if (!formTitle || !formDate) {
      toast.error(t("required fields missing"));
      return;
    }

    const eventData = {
      title: formTitle,
      description: formDescription || null,
      date: formDate.toISOString(),
      created_by: session?.user?.id,
    };

    if (currentEvent) {
      // Edit existing event
      const { error } = await supabase
        .from('calendar_events')
        .update(eventData)
        .eq('id', currentEvent.id);

      if (error) {
        console.error("Error updating event:", error);
        toast.error(t("save failed", { error: error.message }));
      } else {
        toast.success(t("updated successfully"));
        fetchEvents();
        setIsDialogOpen(false);
      }
    } else {
      // Add new event
      const { error } = await supabase
        .from('calendar_events')
        .insert([eventData]);

      if (error) {
        console.error("Error adding event:", error);
        toast.error(t("save failed", { error: error.message }));
      } else {
        toast.success(t("added successfully"));
        fetchEvents();
        setIsDialogOpen(false);
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(t("confirm delete calendar event"))) {
      return;
    }
    try {
      const { error } = await supabase
        .from('calendar_events')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }
      toast.success(t("deleted successfully"));
      fetchEvents();
    } catch (err: any) {
      console.error("Error deleting event:", err);
      toast.error(t("delete error", { error: err.message }));
    }
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

  const formatDisplayDate = (isoString: string) => {
    const dateObj = new Date(isoString);
    return dateObj.toLocaleDateString(i18n.language === 'id' ? 'id-ID' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
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
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary">{t('manage calendar events')}</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          {t('manage calendar events subtitle')}
        </p>
      </section>

      <div className="flex justify-end mb-6">
        <Button onClick={openDialogForAdd}>{t('add new calendar event')}</Button>
      </div>

      {dataLoading ? (
        <p className="text-center text-muted-foreground">{t('loading status')}</p>
      ) : error ? (
        <p className="text-center text-destructive">{error}</p>
      ) : events.length > 0 ? (
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
                    <TableCell>{formatDisplayDate(event.date)}</TableCell>
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
              <Textarea
                id="description"
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                className="col-span-3"
              />
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
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              {t('cancel button')}
            </Button>
            <Button onClick={handleAddEdit}>
              {currentEvent ? t('save changes button') : t('submit button')}
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