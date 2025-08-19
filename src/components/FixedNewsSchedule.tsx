"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CalendarDays, BellRing } from "lucide-react";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { formatDisplayDate, formatDisplayDateTime } from "@/utils/dateUtils";
import { getIconComponent } from "@/utils/iconMap";
import { useQuery } from "@tanstack/react-query";

interface CombinedFixedItem {
  id: string;
  type: "news" | "schedule"; // Corresponds to blog_post (news) or regular_event (schedule)
  title: string;
  description: string;
  dateTime: string; // ISO string for sorting
  iconName?: string | null; // For regular events
}

const FixedNewsSchedule: React.FC = () => {
  const { t } = useTranslation();

  const { data: fixedItems, isLoading, isError, error } = useQuery<CombinedFixedItem[], Error>({
    queryKey: ['fixedNewsSchedule'],
    queryFn: async () => {
      // Fetch regular events
      const { data: regularEventsData, error: regularEventsError } = await supabase
        .from('regular_events')
        .select('id, name, description, schedule, icon_name')
        .order('schedule', { ascending: false })
        .limit(4); // Fetch up to 4 latest regular events

      if (regularEventsError) throw regularEventsError;

      // Fetch latest blog posts (non-archive)
      const { data: blogPostsData, error: blogPostsError } = await supabase
        .from('blog_posts')
        .select('id, title, excerpt, created_at')
        .is('pdf_link', null) // Only non-archive blog posts
        .order('created_at', { ascending: false })
        .limit(4); // Fetch up to 4 latest blog posts

      if (blogPostsError) throw blogPostsError;

      const combined: CombinedFixedItem[] = [
        ...(regularEventsData || []).map(event => ({
          id: event.id,
          type: 'schedule' as 'schedule',
          title: event.name,
          description: event.description,
          dateTime: event.schedule,
          iconName: event.icon_name,
        })),
        ...(blogPostsData || []).map(post => ({
          id: post.id,
          type: 'news' as 'news',
          title: post.title,
          description: post.excerpt,
          dateTime: post.created_at,
          iconName: null, // News items don't have specific icons from DB, will use default
        })),
      ];

      // Sort all combined items by dateTime descending and take the top 4
      const sortedAndLimited = combined
        .sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime())
        .slice(0, 4); // Display top 4 latest items

      return sortedAndLimited;
    },
    staleTime: 5 * 60 * 1000, // Data considered fresh for 5 minutes
  });

  // Helper function to format date/time based on type
  const formatDateTime = (isoString: string, type: "news" | "schedule") => {
    const dateObj = new Date(isoString);
    if (type === "schedule" && (dateObj.getHours() !== 0 || dateObj.getMinutes() !== 0 || dateObj.getSeconds() !== 0)) {
      return formatDisplayDateTime(isoString);
    }
    return formatDisplayDate(isoString);
  };

  if (isLoading) {
    return (
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 text-foreground">{t('fixed news schedule title')}</h2>
          <p className="text-center text-muted-foreground">{t('loading data')}</p>
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 text-foreground">{t('fixed news schedule title')}</h2>
          <p className="text-center text-destructive">{error?.message}</p>
        </div>
      </section>
    );
  }

  if (!fixedItems || fixedItems.length === 0) {
    return (
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 text-foreground">{t('fixed news schedule title')}</h2>
          <p className="text-center text-muted-foreground mt-8 text-lg">{t('no news or events available')}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 text-foreground">{t('fixed news schedule title')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {fixedItems.map((item) => {
            const ItemIcon = item.type === "schedule" 
              ? (getIconComponent(item.iconName) || CalendarDays) // Use specific icon if available, else CalendarDays
              : BellRing; // Default to BellRing for news
            return (
              <Card key={item.id} className="flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3 mb-2">
                    <ItemIcon className="text-primary" size={28} />
                    <CardTitle className="text-xl font-semibold">{item.title}</CardTitle>
                  </div>
                  <CardDescription className="text-sm text-muted-foreground">
                    {formatDateTime(item.dateTime, item.type)}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow p-6 pt-0">
                  <div 
                    className="prose dark:prose-invert max-w-none text-muted-foreground"
                    dangerouslySetInnerHTML={{ __html: item.description }}
                  />
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FixedNewsSchedule;