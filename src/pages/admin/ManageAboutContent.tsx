"use client";

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/components/SessionProvider";

const ABOUT_PAGE_CONTENT_ID = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'; // ID konten halaman About Us

const ManageAboutContent: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { session, profile, loading: sessionLoading } = useSession();
  const isAdmin = profile?.role === 'admin';

  const [htmlContent, setHtmlContent] = useState("");
  const [loadingContent, setLoadingContent] = useState(true);
  const [errorContent, setErrorContent] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!sessionLoading) {
      if (!session) {
        toast.error(t('login required'));
        navigate('/login');
      } else if (!isAdmin) {
        toast.error(t('admin required'));
        navigate('/');
      } else {
        fetchAboutContent();
      }
    }
  }, [session, isAdmin, sessionLoading, navigate, t]);

  const fetchAboutContent = async () => {
    setLoadingContent(true);
    setErrorContent(null);
    try {
      const { data, error } = await supabase
        .from('content')
        .select('html_content')
        .eq('id', ABOUT_PAGE_CONTENT_ID)
        .single();

      if (error) {
        throw error;
      }
      setHtmlContent(data?.html_content || "");
    } catch (err: any) {
      console.error("Error fetching about page content:", err);
      setErrorContent(t("fetch data error", { error: err.message }));
    } finally {
      setLoadingContent(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('content')
        .upsert(
          { id: ABOUT_PAGE_CONTENT_ID, html_content: htmlContent },
          { onConflict: 'id' }
        );

      if (error) {
        throw error;
      }
      toast.success(t("content updated successfully"));
    } catch (err: any) {
      console.error("Error saving about page content:", err);
      toast.error(t("save failed", { error: err.message }));
    } finally {
      setIsSaving(false);
    }
  };

  if (sessionLoading || (!session && !sessionLoading) || (session && !isAdmin)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-foreground">{t('loading status')}</p>
      </div>
    );
  }

  if (loadingContent) {
    return (
      <div className="container mx-auto py-10 px-4">
        <p className="text-center text-muted-foreground">{t('loading content')}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <section className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary">{t('manage about content')}</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          {t('manage about content subtitle')}
        </p>
      </section>

      <Card className="max-w-3xl mx-auto p-6 md:p-8 shadow-lg">
        <CardHeader className="text-center pb-6">
          <CardTitle className="text-2xl font-bold mb-2">{t('edit about page content')}</CardTitle>
          <CardDescription className="text-muted-foreground">
            {t('edit about page content description')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {errorContent ? (
            <p className="text-center text-destructive mb-4">{errorContent}</p>
          ) : (
            <div className="space-y-6">
              <div>
                <Label htmlFor="html-content">{t('html content label')}</Label>
                <Textarea
                  id="html-content"
                  placeholder={t('html content placeholder')}
                  value={htmlContent}
                  onChange={(e) => setHtmlContent(e.target.value)}
                  className="mt-1 min-h-[300px] font-mono text-sm"
                />
                <p className="text-sm text-muted-foreground mt-2">
                  {t('html content hint')}
                </p>
              </div>
              <Button type="button" onClick={handleSave} className="w-full" disabled={isSaving}>
                {isSaving ? t('saving status') : t('save changes button')}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="text-center mt-12">
        <Link to="/admin">
          <Button>{t('back to dashboard')}</Button>
        </Link>
      </div>
    </div>
  );
};

export default ManageAboutContent;