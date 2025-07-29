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

interface TrainingProgram {
  id: string;
  title: string;
  dates: string;
  description: string;
  icon_name: string | null;
  created_by: string | null;
  created_at: string;
}

const UploadTrainingProgram: React.FC = () => {
  const { id: programId } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { session, profile, loading: sessionLoading } = useSession();
  
  const [title, setTitle] = useState("");
  const [dates, setDates] = useState("");
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
        if (programId) {
          fetchProgramData(programId);
        } else {
          setDataLoading(false);
        }
      }
    }
  }, [session, profile, sessionLoading, navigate, t, programId]);

  const fetchProgramData = async (id: string) => {
    setDataLoading(true);
    try {
      const { data, error } = await supabase
        .from('training_programs')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      if (data) {
        setTitle(data.title || "");
        setDates(data.dates || "");
        setDescription(data.description || "");
        setIconName(data.icon_name || "");
      }
    } catch (err: any) {
      console.error("Error fetching training program data:", err);
      toast.error(t("message.fetch_error", { error: err.message }));
      navigate('/admin/manage-training-programs');
    } finally {
      setDataLoading(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setUploading(true);

    if (!title || !dates || !description) {
      toast.error(t("message.required_fields_missing"));
      setUploading(false);
      return;
    }

    try {
      const programData = {
        title,
        dates,
        description,
        icon_name: iconName || null,
        ...(programId ? {} : { created_by: session?.user?.id, created_at: new Date().toISOString() }),
      };

      let error;
      if (programId) {
        const { error: updateError } = await supabase
          .from('training_programs')
          .update(programData)
          .eq('id', programId);
        error = updateError;
      } else {
        const { error: insertError } = await supabase
          .from('training_programs')
          .insert([programData]);
        error = insertError;
      }

      if (error) throw error;

      toast.success(programId ? t("success.updated") : t("success.added"));
      navigate('/admin/manage-training-programs');

    } catch (err: any) {
      console.error("Error saving training program:", err);
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
          {programId ? t('admin.training_program.edit_title') : t('admin.training_program.add_title')}
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          {programId ? t('admin.training_program.edit_subtitle') : t('admin.training_program.add_subtitle')}
        </p>
      </section>

      <Card className="max-w-3xl mx-auto p-6 md:p-8 shadow-lg">
        <CardHeader className="text-center pb-6">
          <CardTitle className="text-2xl font-bold mb-2">
            {programId ? t('admin.training_program.edit_form_title') : t('admin.training_program.add_form_title')}
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            {programId ? t('admin.training_program.edit_form_desc') : t('admin.training_program.add_form_desc')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="title">{t('label.title')}</Label>
              <Input
                id="title"
                type="text"
                placeholder={t('placeholder.title')}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="dates">{t('label.dates')}</Label>
              <Input
                id="dates"
                type="text"
                placeholder={t('placeholder.dates')}
                value={dates}
                onChange={(e) => setDates(e.target.value)}
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
              {uploading ? t('status.uploading') : (programId ? t('button.save_changes') : t('button.submit'))}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="text-center mt-12">
        <Link to="/admin/manage-training-programs">
          <Button>{t('button.back_to_list')}</Button>
        </Link>
      </div>
    </div>
  );
};

export default UploadTrainingProgram;