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

// Removed unused interface RunningClass
// interface RunningClass {
//   id: string;
//   name: string;
//   schedule: string;
//   description: string;
//   icon_name: string | null;
//   created_by: string | null;
//   created_at: string;
// }

const UploadRunningClass: React.FC = () => {
  const { id: classId } = useParams<{ id: string }>();
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
        toast.error(t('login required'));
        navigate('/login');
      } else if (profile?.role !== 'admin') {
        toast.error(t('admin required'));
        navigate('/');
      } else {
        if (classId) {
          fetchClassData(classId);
        } else {
          setDataLoading(false);
        }
      }
    }
  }, [session, profile, sessionLoading, navigate, t, classId]);

  const fetchClassData = async (id: string) => {
    setDataLoading(true);
    try {
      const { data, error } = await supabase
        .from('running_classes')
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
      console.error("Error fetching running class data:", err);
      toast.error(t("fetch data error", { error: err.message }));
      navigate('/admin/manage-running-classes');
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
      const classData = {
        name,
        schedule,
        description,
        icon_name: iconName || null,
        ...(classId ? {} : { created_by: session?.user?.id, created_at: new Date().toISOString() }),
      };

      let error;
      if (classId) {
        const { error: updateError } = await supabase
          .from('running_classes')
          .update(classData)
          .eq('id', classId);
        error = updateError;
      } else {
        const { error: insertError } = await supabase
          .from('running_classes')
          .insert([classData]);
        error = insertError;
      }

      if (error) throw error;

      toast.success(classId ? t("updated successfully") : t("added successfully"));
      navigate('/admin/manage-running-classes');

    } catch (err: any) {
      console.error("Error saving running class:", err);
      toast.error(t("save failed", { error: err.message }));
    } finally {
      setUploading(false);
    }
  };

  if (sessionLoading || dataLoading || (!session && !sessionLoading) || (session && profile?.role !== 'admin')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-foreground">{t('loading status')}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <section className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary">
          {classId ? t('edit running class') : t('add running class')}
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          {classId ? t('edit running class subtitle') : t('add running class subtitle')}
        </p>
      </section>

      <Card className="max-w-3xl mx-auto p-6 md:p-8 shadow-lg">
        <CardHeader className="text-center pb-6">
          <CardTitle className="text-2xl font-bold mb-2">
            {classId ? t('edit running class form') : t('add running class form')}
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            {classId ? t('edit running class form description') : t('add running class form description')}
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
              <Input
                id="schedule"
                type="text"
                placeholder={t('schedule placeholder')}
                value={schedule}
                onChange={(e) => setSchedule(e.target.value)}
                className="mt-1"
              />
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
              {uploading ? t('uploading status') : (classId ? t('save changes button') : t('submit button'))}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="text-center mt-12">
        <Link to="/admin/manage-running-classes">
          <Button>{t('back to list button')}</Button>
        </Link>
      </div>
    </div>
  );
};

export default UploadRunningClass;