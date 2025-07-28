"use client";

import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { Image, FileText, CalendarDays } from "lucide-react";
import { useSession } from "@/components/SessionProvider"; // Import useSession
import { toast } from "sonner";

interface ContentItem {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  created_at: string;
}

const ContentList: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { session, profile, loading } = useSession();
  const [content, setContent] = useState<ContentItem[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading) {
      if (!session) {
        toast.error(t('auth.login required'));
        navigate('/login');
      } else if (profile?.role !== 'admin') {
        toast.error(t('auth.admin access required'));
        navigate('/');
      } else {
        fetchContent();
      }
    }
  }, [session, profile, loading, navigate, t]);

  const fetchContent = async () => {
    setDataLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('content')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }
      setContent(data || []);
    } catch (err: any) {
      console.error("Error fetching content:", err);
      setError(t("content list.fetch error", { error: err.message }));
    } finally {
      setDataLoading(false);
    }
  };

  const formatDateTime = (isoString: string) => {
    const dateObj = new Date(isoString);
    const dateOptions: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    };
    return dateObj.toLocaleDateString(i18n.language === 'id' ? 'id-ID' : 'en-US', dateOptions);
  };

  if (loading || (!session && !loading) || (session && profile?.role !== 'admin')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-foreground">{t('loading')}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <section className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary">{t('content list.title')}</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          {t('content list.subtitle')}
        </p>
      </section>

      {dataLoading ? (
        <p className="text-center text-muted-foreground">{t('content list.loading')}</p>
      ) : error ? (
        <p className="text-center text-destructive">{error}</p>
      ) : content.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {content.map((item) => (
            <Card key={item.id} className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
              {item.image_url && (
                <div className="relative w-full h-48 bg-gray-200 flex items-center justify-center">
                  <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                </div>
              )}
              <CardHeader className="flex-grow">
                <CardTitle className="text-xl">{item.title}</CardTitle>
                <CardDescription className="text-sm text-muted-foreground flex items-center gap-1">
                  <CalendarDays size={14} /> {formatDateTime(item.created_at)}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <p className="text-muted-foreground mb-4 line-clamp-3">{item.description}</p>
                {/* You might want a detail page for each content item later */}
                {/* <Link to={`/content/${item.id}`}>
                  <Button variant="outline" className="w-full">{t('view details')}</Button>
                </Link> */}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground mt-8 text-lg">{t('content list.no content')}</p>
      )}

      <div className="text-center mt-12">
        <Link to="/">
          <Button>{t('back to home')}</Button>
        </Link>
      </div>
    </div>
  );
};

export default ContentList;