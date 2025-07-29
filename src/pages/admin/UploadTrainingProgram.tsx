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
        toast.error(t('auth.login required'));
        navigate('/login');
      } else if (profile?.role !== 'admin') {
        toast.error(t('auth.admin access required'));
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
      toast.error(t("upload training program.fetch error", { error: err.message }));
      navigate('/admin/manage-training-programs');
    } finally {
      setDataLoading(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setUploading(true);

    if (!title || !dates || !description) {
      toast.error(t("upload training program.required fields missing"));
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

      toast.success(programId ? t("upload training program.program updated successfully") : t("upload training program.program added successfully"));
      navigate('/admin/manage-training-programs');

    } catch (err: any) {
      console.error("Error saving training program:", err);
      toast.error(t("upload training program.save failed", { error: err.message }));
    } finally {
      setUploading(false);
    }
  };

  if (sessionLoading || dataLoading || (!session && !sessionLoading) || (session && profile?.role !== 'admin')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-foreground">{t('loading')}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <section className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary">
          {programId ? t('upload training program.edit program title') : t('upload training program.add program title')}
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          {programId ? t('upload training program.edit program subtitle') : t('upload training program.add program subtitle')}
        </p>
      </section>

      <Card className="max-w-3xl mx-auto p-6 md:p-8 shadow-lg">
        <CardHeader className="text-center pb-6">
          <CardTitle className="text-2xl font-bold mb-2">
            {programId ? t('upload training program.edit program') : t('add new training program')}
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            {programId ? t('upload training program.fill form to edit program') : t('fill form to add new program')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="title">{t('upload training program.title label')}</Label>
              <Input
                id="title"
                type="text"
                placeholder={t('upload training program.title placeholder')}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="dates">{t('upload training program.dates label')}</Label>
              <Input
                id="dates"
                type="text"
                placeholder={t('upload training program.dates placeholder')}
                value={dates}
                onChange={(e) => setDates(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="description">{t('upload training program.description label')}</Label>
              <Textarea
                id="description"
                placeholder={t('upload training program.description placeholder')}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1 min-h-[80px]"
              />
            </div>
            <div>
              <Label htmlFor="iconName">{t('upload training program.icon label')}</Label>
              <Select value={iconName} onValueChange={setIconName}>
                <SelectTrigger className="w-full mt-1">
                  <SelectValue placeholder={t('upload training program.select icon')} />
                </SelectTrigger>
                <SelectContent>
                  {availableIcons.map(icon => (
                    <SelectItem key={icon} value={icon}>{icon}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {iconName && (
                <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
                  {t('upload training program.selected icon preview')}: {React.createElement(iconMap[iconName], { className: "h-4 w-4" })} {iconName}
                </p>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={uploading}>
              {uploading ? t('uploading') : (programId ? t('upload training program.save changes') : t('upload training program.submit button'))}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="text-center mt-12">
        <Link to="/admin/manage-training-programs">
          <Button>{t('back to training programs list')}</Button>
        </Link>
      </div>
    </div>
  );
};

export default UploadTrainingProgram;