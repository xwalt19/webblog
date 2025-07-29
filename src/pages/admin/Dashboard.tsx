"use client";

import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/components/SessionProvider";
import { BookOpen, GraduationCap, Users, Youtube, Music, CalendarDays, Archive, Code, BellRing, LayoutDashboard, Tent, Cpu } from "lucide-react";
import { toast } from "sonner";

interface Stats {
  blogPosts: number;
  archives: number;
  calendarEvents: number;
  programs: number;
  runningClasses: number;
  regularEvents: number;
  camps: number;
  trainingPrograms: number;
  youtubeVideos: number;
  tiktokVideos: number;
  totalUsers: number;
}

const AdminDashboard: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { session, profile, loading: sessionLoading } = useSession();
  const isAdmin = profile?.role === 'admin';

  const [stats, setStats] = useState<Stats | null>(null);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionLoading) {
      if (!session) {
        toast.error(t('login required'));
        navigate('/login');
      } else if (!isAdmin) {
        toast.error(t('admin required'));
        navigate('/');
      } else {
        fetchStats();
      }
    }
  }, [session, isAdmin, sessionLoading, navigate, t]);

  const fetchStats = async () => {
    setDataLoading(true);
    setError(null);
    try {
      const { count: blogPostsCount, error: blogPostsError } = await supabase
        .from('blog_posts')
        .select('*', { count: 'exact', head: true })
        .is('pdf_link', null);
      if (blogPostsError) throw blogPostsError;

      const { count: archivesCount, error: archivesError } = await supabase
        .from('blog_posts')
        .select('*', { count: 'exact', head: true })
        .not('pdf_link', 'is', null);
      if (archivesError) throw archivesError;

      const { count: calendarEventsCount, error: calendarEventsError } = await supabase
        .from('calendar_events')
        .select('*', { count: 'exact', head: true });
      if (calendarEventsError) throw calendarEventsError;

      const { count: programsCount, error: programsError } = await supabase
        .from('programs')
        .select('*', { count: 'exact', head: true });
      if (programsError) throw programsError;

      const { count: runningClassesCount, error: runningClassesError } = await supabase
        .from('running_classes')
        .select('*', { count: 'exact', head: true });
      if (runningClassesError) throw runningClassesError;

      const { count: regularEventsCount, error: regularEventsError } = await supabase
        .from('regular_events')
        .select('*', { count: 'exact', head: true });
      if (regularEventsError) throw regularEventsError;

      const { count: campsCount, error: campsError } = await supabase
        .from('camps')
        .select('*', { count: 'exact', head: true });
      if (campsError) throw campsError;

      const { count: trainingProgramsCount, error: trainingProgramsError } = await supabase
        .from('training_programs')
        .select('*', { count: 'exact', head: true });
      if (trainingProgramsError) throw trainingProgramsError;

      const { count: youtubeVideosCount, error: youtubeVideosError } = await supabase
        .from('youtube_videos')
        .select('*', { count: 'exact', head: true });
      if (youtubeVideosError) throw youtubeVideosError;

      const { count: tiktokVideosCount, error: tiktokVideosError } = await supabase
        .from('tiktok_videos')
        .select('*', { count: 'exact', head: true });
      if (tiktokVideosError) throw tiktokVideosError;

      const { count: usersCount, error: usersError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });
      if (usersError) throw usersError;

      setStats({
        blogPosts: blogPostsCount || 0,
        archives: archivesCount || 0,
        calendarEvents: calendarEventsCount || 0,
        programs: programsCount || 0,
        runningClasses: runningClassesCount || 0,
        regularEvents: regularEventsCount || 0,
        camps: campsCount || 0,
        trainingPrograms: trainingProgramsCount || 0,
        youtubeVideos: youtubeVideosCount || 0,
        tiktokVideos: tiktokVideosCount || 0,
        totalUsers: usersCount || 0,
      });
    } catch (err: any) {
      console.error("Error fetching dashboard stats:", err);
      setError(t("fetch data error", { error: err.message }));
    } finally {
      setDataLoading(false);
    }
  };

  const statCards = stats ? [
    { title: t('total blog posts'), value: stats.blogPosts, icon: BookOpen, link: "/admin/manage-blog-posts" },
    { title: t('total archives'), value: stats.archives, icon: Archive, link: "/admin/manage-archives" },
    { title: t('total calendar events'), value: stats.calendarEvents, icon: CalendarDays, link: "/admin/manage-calendar" },
    { title: t('total programs'), value: stats.programs, icon: GraduationCap, link: "/admin/manage-programs" },
    { title: t('total running classes'), value: stats.runningClasses, icon: Code, link: "/admin/manage-running-classes" },
    { title: t('total regular events'), value: stats.regularEvents, icon: BellRing, link: "/admin/manage-regular-events" },
    { title: t('total camps'), value: stats.camps, icon: Tent, link: "/admin/manage-camps" },
    { title: t('total training programs'), value: stats.trainingPrograms, icon: Cpu, link: "/admin/manage-training-programs" },
    { title: t('total youtube videos'), value: stats.youtubeVideos, icon: Youtube, link: "/admin/manage-youtube-videos" },
    { title: t('total tiktok videos'), value: stats.tiktokVideos, icon: Music, link: "/admin/manage-tiktok-videos" },
    { title: t('total users'), value: stats.totalUsers, icon: Users, link: "/admin/manage-users" }, // Link to new user management page
  ] : [];

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
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary">{t('admin dashboard title')}</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          {t('admin dashboard subtitle')}
        </p>
      </section>

      {dataLoading ? (
        <p className="text-center text-muted-foreground">{t('loading data')}</p>
      ) : error ? (
        <p className="text-center text-destructive">{error}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {statCards.map((card, index) => (
            <Link to={card.link} key={index}>
              <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 h-full flex flex-col justify-between">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                  <card.icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{card.value}</div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

      <div className="text-center mt-12">
        <Link to="/">
          <Button>{t('return to home')}</Button>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;