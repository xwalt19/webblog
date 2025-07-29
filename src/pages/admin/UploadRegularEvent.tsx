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

interface RegularEvent {
  id: string;
  name: string;
  schedule: string;
  description: string;
  icon_name: string | null;
  created_by: string | null;
  created_at: string;
}

const UploadRegularEvent: React.FC = () => {
  const { id: eventId } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { session, profile, loading: sessionLoading } = useSession();
  
  const [name, setName] = useState("");
  const [schedule, setSchedule] = useState("");
  const [description, setDescription] = useState("");
  const [iconName, setIconName] = useState("");
  const [uploading, setUploading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);

  const availableIcons = Object.keys(iconMap);

  useEffect(() => {
    if (!sessionLoading) {
      if (!session) {
        toast.error(t('auth.login_required'));
        navigate('/login');
      } else if (profile?.role !== 'admin') {
        toast.error(t('auth.admin_required'));
        navigate('/');
      } else {
        if (eventId) {
          fetchEventData(eventId);
        } else {
          setDataLoading(false);
        }
      }
    }
  }, [session, profile, sessionLoading, navigate, t, eventId]);

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
        setSchedule(data.schedule || "");
        setDescription(data.description || "");
        setIconName(data.icon_name || "");
      }
    } catch (err: any) {
      console.error("Error fetching regular event data:", err);
      toast.error(t("message.fetch_error", { error: err.message }));
      navigate('/admin/manage-regular-events');
    } finally {
      setDataLoading(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setUploading(true);

    if (!name || !schedule || !description) {
      toast.error(t("message.required_fields_missing"));
      setUploading(false);
      return;
    }

    try {
      const eventData = {
        name,
        schedule,
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

      toast.success(eventId ? t("success.updated") : t("success.added"));
      navigate('/admin/manage-regular-events');

    } catch (err: any) {
      console.error("Error saving regular event:", err);
      toast.error(t("message.save_failed", { error: err.message }));
    } finally {
      setUploading(false);
    }
  };

  if (sessionLoading || dataLoading || (!session && !sessionLoading) || (session && profile?.role !== 'admin')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-foreground">{t('status.loading')}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <section className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary">
          {eventId ? t('admin.regular_event.edit_title') : t('admin.regular_event.add_title')}
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          {eventId ? t('admin.regular_event.edit_subtitle') : t('admin.regular_event.add_subtitle')}
        </p>
      </section>

      <Card className="max-w-3xl mx-auto p-6 md:p-8 shadow-lg">
        <CardHeader className="text-center pb-6">
          <CardTitle className="text-2xl font-bold mb-2">
            {eventId ? t('admin.regular_event.edit_form_title') : t('admin.regular_event.add_form_title')}
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            {eventId ? t('admin.regular_event.edit_form_desc') : t('admin.regular_event.add_form_desc')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="name">{t('label.name')}</Label>
              <Input
                id="name"
                type="text"
                placeholder={t('placeholder.name')}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="schedule">{t('label.schedule')}</Label>
              <Input
                id="schedule"
                type="text"
                placeholder={t('placeholder.schedule')}
                value={schedule}
                onChange={(e) => setSchedule(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="description">{t('label.description')}</Label>
              <Textarea
                id="description"
                placeholder={t('placeholder.description')}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1 min-h-[80px]"
              />
            </div>
            <div>
              <Label htmlFor="iconName">{t('label.icon')}</Label>
              <Select value={iconName} onValueChange={setIconName}>
                <SelectTrigger className="w-full mt-1">
                  <SelectValue placeholder={t('placeholder.select_icon')} />
                </SelectTrigger>
                <SelectContent>
                  {availableIcons.map(icon => (
                    <SelectItem key={icon} value={icon}>{icon}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {iconName && (
                <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
                  {t('message.selected_icon_preview')}: {React.createElement(iconMap[iconName], { className: "h-4 w-4" })} {iconName}
                </p>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={uploading}>
              {uploading ? t('status.uploading') : (eventId ? t('button.save_changes') : t('button.submit'))}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="text-center mt-12">
        <Link to="/admin/manage-regular-events">
          <Button>{t('button.back_to_list')}</Button>
        </Link>
      </div>
    </div>
  );
};

export default UploadRegularEvent;