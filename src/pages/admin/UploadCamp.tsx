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
import { PlusCircle, MinusCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";

// Removed unused interface Camp
// interface Camp {
//   id: string;
//   title: string;
//   dates: string;
//   description: string;
//   created_by: string | null;
//   created_at: string;
// }

interface CampDayLink {
  id?: string; // Optional for new links
  label: string;
  url: string;
}

const UploadCamp: React.FC = () => {
  const { id: campId } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { session, profile, loading: sessionLoading } = useSession();
  
  const [title, setTitle] = useState("");
  const [dates, setDates] = useState("");
  const [description, setDescription] = useState("");
  const [dayLinks, setDayLinks] = useState<CampDayLink[]>([]);
  const [uploading, setUploading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!sessionLoading) {
      if (!session) {
        toast.error(t('login required'));
        navigate('/login');
      } else if (profile?.role !== 'admin') {
        toast.error(t('admin required'));
        navigate('/');
      } else {
        if (campId) {
          fetchCampData(campId);
        } else {
          setDataLoading(false);
        }
      }
    }
  }, [session, profile, sessionLoading, navigate, t, campId]);

  const fetchCampData = async (id: string) => {
    setDataLoading(true);
    try {
      const { data: campData, error: campError } = await supabase
        .from('camps')
        .select('*')
        .eq('id', id)
        .single();

      if (campError) throw campError;

      if (campData) {
        setTitle(campData.title || "");
        setDates(campData.dates || "");
        setDescription(campData.description || "");

        const { data: linksData, error: linksError } = await supabase
          .from('camp_day_links')
          .select('*')
          .eq('camp_id', id)
          .order('label', { ascending: true }); // Order by label for consistent display

        if (linksError) throw linksError;
        setDayLinks(linksData || []);
      }
    } catch (err: any) {
      console.error("Error fetching camp data:", err);
      toast.error(t("fetch data error", { error: err.message }));
      navigate('/admin/manage-camps');
    } finally {
      setDataLoading(false);
    }
  };

  const handleAddDayLink = () => {
    setDayLinks([...dayLinks, { label: "", url: "" }]);
  };

  const handleRemoveDayLink = (index: number) => {
    const newDayLinks = dayLinks.filter((_, i) => i !== index);
    setDayLinks(newDayLinks);
  };

  const handleDayLinkChange = (index: number, field: keyof CampDayLink, value: string) => {
    const newDayLinks = [...dayLinks];
    newDayLinks[index] = { ...newDayLinks[index], [field]: value };
    setDayLinks(newDayLinks);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setUploading(true);

    if (!title || !dates || !description) {
      toast.error(t("required fields missing"));
      setUploading(false);
      return;
    }

    try {
      const campData = {
        title,
        dates,
        description,
        ...(campId ? {} : { created_by: session?.user?.id, created_at: new Date().toISOString() }),
      };

      let currentCampId = campId;
      let error;

      if (campId) {
        const { error: updateError } = await supabase
          .from('camps')
          .update(campData)
          .eq('id', campId);
        error = updateError;
      } else {
        const { data, error: insertError } = await supabase
          .from('camps')
          .insert([campData])
          .select('id')
          .single();
        error = insertError;
        if (data) currentCampId = data.id;
      }

      if (error) throw error;
      if (!currentCampId) throw new Error("Camp ID not found after save.");

      // Handle day links
      // Delete existing links for this camp
      await supabase.from('camp_day_links').delete().eq('camp_id', currentCampId);
      // Insert new/updated links
      if (dayLinks.length > 0) {
        const linksToInsert = dayLinks.map(link => ({
          ...link,
          camp_id: currentCampId,
          created_by: session?.user?.id,
          created_at: new Date().toISOString(),
        }));
        const { error: linksError } = await supabase.from('camp_day_links').insert(linksToInsert);
        if (linksError) throw linksError;
      }

      toast.success(campId ? t("updated successfully") : t("added successfully"));
      navigate('/admin/manage-camps');

    } catch (err: any) {
      console.error("Error saving camp:", err);
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
          {campId ? t('edit camp') : t('add camp')}
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          {campId ? t('edit camp subtitle') : t('add camp subtitle')}
        </p>
      </section>

      <Card className="max-w-3xl mx-auto p-6 md:p-8 shadow-lg">
        <CardHeader className="text-center pb-6">
          <CardTitle className="text-2xl font-bold mb-2">
            {campId ? t('edit camp form') : t('add camp form')}
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            {campId ? t('edit camp form description') : t('add camp form description')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="title">{t('title label')}</Label>
              <Input
                id="title"
                type="text"
                placeholder={t('title placeholder')}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="dates">{t('dates label')}</Label>
              <Input
                id="dates"
                type="text"
                placeholder={t('dates placeholder')}
                value={dates}
                onChange={(e) => setDates(e.target.value)}
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

            <Separator className="my-6" />
            <h3 className="text-lg font-semibold mb-4">{t('day links')}</h3>
            {dayLinks.map((link, index) => (
              <Card key={index} className="p-4 mb-4 border border-border">
                <div className="flex justify-end mb-2">
                  <Button variant="destructive" size="sm" onClick={() => handleRemoveDayLink(index)}>
                    <MinusCircle className="h-4 w-4 mr-2" /> {t('remove link button')}
                  </Button>
                </div>
                <div className="space-y-2">
                  <div>
                    <Label>{t('link label')}</Label>
                    <Input
                      placeholder={t('link label placeholder')}
                      value={link.label}
                      onChange={(e) => handleDayLinkChange(index, 'label', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>{t('url label')}</Label>
                    <Input
                      placeholder={t('link url placeholder')}
                      value={link.url}
                      onChange={(e) => handleDayLinkChange(index, 'url', e.target.value)}
                    />
                  </div>
                </div>
              </Card>
            ))}
            <Button type="button" variant="secondary" onClick={handleAddDayLink}>
              <PlusCircle className="h-4 w-4 mr-2" /> {t('add day link button')}
            </Button>

            <Button type="submit" className="w-full" disabled={uploading}>
              {uploading ? t('uploading status') : (campId ? t('save changes button') : t('submit button'))}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="text-center mt-12">
        <Link to="/admin/manage-camps">
          <Button>{t('back to list button')}</Button>
        </Link>
      </div>
    </div>
  );
};

export default UploadCamp;