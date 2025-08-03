"use client";

import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/components/SessionProvider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { iconMap } from "@/utils/iconMap";
import { useAdminPageLogic } from "@/hooks/use-admin-page-logic"; // Import the new hook
import { Calendar as CalendarIcon } from "lucide-react"; // Import CalendarIcon
import { format } from "date-fns"; // Import format from date-fns
import { Calendar } from "@/components/ui/calendar"; // Import Calendar component
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"; // Import Popover components
import { cn } from "@/lib/utils"; // Import cn utility

const UploadRegularEvent: React.FC = () => {
  const { id: eventId } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { session } = useSession(); // Keep session for created_by

  const [name, setName] = useState("");
  const [schedule, setSchedule] = useState<Date | undefined>(undefined); // Changed to Date | undefined
  const [description, setDescription] = useState("");
  const [iconName, setIconName] = useState("");
  const [uploading, setUploading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true); // Still needed for edit mode

  const availableIcons = Object.keys(iconMap);

  // Use the new admin page logic hook
  const { isLoadingAuth, isAuthenticatedAndAuthorized } = useAdminPageLogic({
    isAdminRequired: true,
    onAuthSuccess: () => {
      if (eventId) {
        fetchEventData(eventId);
      } else {
        // For new events, data is not loading from DB, so set dataLoading to false
        setDataLoading(false);
      }
    },
  });

  const fetchEventData = async (id: string) => {
    setDataLoading(true);
    try {
      const { data, error } = await supabase
        .from('regular_events')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      if (data) {
        setName(data.name || "");
        setSchedule(data.schedule ? new Date(data.schedule) : undefined); // Parse schedule to Date
        setDescription(data.description || "");
        setIconName(data.icon_name || "");
      }
    } catch (err: any) {
      console.error("Error fetching regular event data:", err);
      toast.error(t("fetch data error", { error: err.message }));
      navigate('/admin/manage-regular-events');
    } finally {
      setDataLoading(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setUploading(true);

    if (!name || !schedule || !description) {
      toast.error(t("required fields missing"));
      setUploading(false);
      return;
    }

    try {
      const eventData = {
        name,
        schedule: schedule ? schedule.toISOString() : null, // Convert Date to ISO string
        description,
        icon_name: iconName || null,
        ...(eventId ? {} : { created_by: session?.user?.id, created_at: new Date().toISOString() }),
      };

      let error;
      if (eventId) {
        const { error: updateError } = await supabase
          .from('regular_events')
          .update(eventData)
          .eq('id', eventId);
        error = updateError;
      } else {
        const { error: insertError } = await supabase
          .from('regular_events')
          .insert([eventData]);
        error = insertError;
      }

      if (error) throw error;

      toast.success(eventId ? t("updated successfully") : t("added successfully"));
      navigate('/admin/manage-regular-events');

    } catch (err: any) {
      console.error("Error saving regular event:", err);
      toast.error(t("save failed", { error: err.message }));
    } finally {
      setUploading(false);
    }
  };

  // Render loading state based on auth loading or data loading (only for edit mode)
  if (isLoadingAuth || (eventId && dataLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-foreground">{t('loading status')}</p>
      </div>
    );
  }

  // If not authenticated/authorized, the hook will handle navigation, so return null
  if (!isAuthenticatedAndAuthorized) {
    return null;
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <section className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary">
          {eventId ? t('edit regular event') : t('add regular event')}
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          {eventId ? t('edit regular event subtitle') : t('add regular event subtitle')}
        </p>
      </section>

      <Card className="max-w-3xl mx-auto p-6 md:p-8 shadow-lg">
        <CardHeader className="text-center pb-6">
          <CardTitle className="text-2xl font-bold mb-2">
            {eventId ? t('edit regular event form') : t('add regular event form')}
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            {eventId ? t('edit regular event form description') : t('add regular event form description')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="name">{t('name label')}</Label>
              <Input
                id="name"
                type="text"
                placeholder={t('name placeholder')}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="schedule">{t('schedule label')}</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal mt-1",
                      !schedule && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {schedule ? format(schedule, "PPP HH:mm") : <span>{t('pick date and time')}</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={schedule}
                    onSelect={setSchedule}
                    initialFocus
                  />
                  <div className="p-3 border-t border-border">
                    <Label htmlFor="time-input" className="sr-only">{t('time')}</Label>
                    <Input
                      id="time-input"
                      type="time"
                      value={schedule ? format(schedule, "HH:mm") : ""}
                      onChange={(e) => {
                        const [hours, minutes] = e.target.value.split(':').map(Number);
                        if (schedule) {
                          const newDate = new Date(schedule);
                          newDate.setHours(hours, minutes);
                          setSchedule(newDate);
                        } else {
                          const newDate = new Date();
                          newDate.setHours(hours, minutes);
                          setSchedule(newDate);
                        }
                      }}
                      className="w-full"
                    />
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <Label htmlFor="description">{t('description label')}</Label>
              <Textarea
                id="description"
                placeholder={t('description placeholder')}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1 min-h-[80px]"
              />
            </div>
            <div>
              <Label htmlFor="iconName">{t('icon label')}</Label>
              <Select value={iconName} onValueChange={setIconName}>
                <SelectTrigger className="w-full mt-1">
                  <SelectValue placeholder={t('select icon placeholder')} />
                </SelectTrigger>
                <SelectContent>
                  {availableIcons.map(icon => (
                    <SelectItem key={icon} value={icon}>{icon}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {iconName && (
                <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
                  {React.createElement(iconMap[iconName], { className: "h-4 w-4" })} {iconName}
                </p>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={uploading}>
              {uploading ? t('uploading status') : (eventId ? t('save changes button') : t('submit button'))}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="text-center mt-12">
        <Link to="/admin/manage-regular-events">
          <Button>{t('back to list button')}</Button>
        </Link>
      </div>
    </div>
  );
};

export default UploadRegularEvent;