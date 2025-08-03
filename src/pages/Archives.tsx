"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { useTranslatedTag, cleanTagForStorage } from "@/utils/i18nUtils";
import { useSession } from "@/components/SessionProvider";
import ResponsiveImage from "@/components/ResponsiveImage";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  created_at: string;
  image_url: string;
  category: string;
  author: string;
  tags: string[];
  content?: string;
  pdf_link?: string;
}

const POSTS_PER_PAGE = 6;

const Archives: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { getTranslatedTag } = useTranslatedTag();
  const { loading: sessionLoading } = useSession();
  const [searchParams] = useSearchParams();

  const [allArchivePosts, setAllArchivePosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState("all");
  const [selectedTag, setSelectedTag] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Effect to set initial filters from URL params
  useEffect(() => {
    const urlYear = searchParams.get('year');
    const urlMonth = searchParams.get('month');

    if (urlYear && urlMonth) {
      setSelectedPeriod(`${urlYear}-${urlMonth}`);
    } else if (urlYear) {
      setSelectedPeriod(urlYear); // If only year is provided
    } else {
      setSelectedPeriod("all"); // Default if no params
    }
    setSelectedTag("all"); // Reset tag filter when navigating via date
    setSearchTerm(""); // Reset search term when navigating via date
    setCurrentPage(1); // Always reset to first page
  }, [searchParams]); // Depend on searchParams to re-run when URL changes

  useEffect(() => {
    const fetchArchivePosts = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .not('pdf_link', 'is', null) // Only fetch posts with a PDF link
          .order('created_at', { ascending: false });

        if (error) {
          throw error;
        }
        setAllArchivePosts(data || []);
      } catch (err: any) {
        console.error("Error fetching archive posts:", err);
        setError(t("failed to load archives", { error: err.message }));
      } finally {
        setLoading(false);
      }
    };

    if (!sessionLoading) {
      fetchArchivePosts();
    }
  }, [t, sessionLoading]);

  const allTags: string[] = useMemo(() => {
    const tags = new Set<string>();
    allArchivePosts.forEach(post => {
      post.tags?.forEach(tag => tags.add(cleanTagForStorage(tag)));
    });
    return ["all", ...Array.from(tags)];
  }, [allArchivePosts]);

  const monthNames = useMemo(() => [
    "", t("january month name"), t("february month name"), t("march month name"), t("april month name"), t("may month name"), t("june month name"),
    t("july month name"), t("august month name"), t("september month name"), t("october month name"), t("november month name"), t("december month name")
  ], [i18n.language]);

  const allPeriods: string[] = useMemo(() => {
    const periods = new Set<string>();
    allArchivePosts.forEach(post => {
      const date = new Date(post.created_at);
      periods.add(`${date.getFullYear()}-${date.getMonth() + 1}`);
      periods.add(`${date.getFullYear()}`); // Add just the year as an option
    });
    const sortedPeriods = Array.from(periods).sort((a, b) => {
      // Sort by year descending, then by month descending
      const [yearA, monthA] = a.split('-').map(Number);
      const [yearB, monthB] = b.split('-').map(Number);

      if (yearA !== yearB) return yearB - yearA;
      if (monthA && monthB) return monthB - monthA; // Both are months
      if (monthA) return -1; // A is month, B is year
      if (monthB) return 1; // B is month, A is year
      return 0; // Both are years or invalid
    });
    return ["all", ...sortedPeriods];
  }, [allArchivePosts]);

  const getPeriodDisplayName = (period: string) => {
    if (period === "all") return t("all time period");
    const parts = period.split('-');
    if (parts.length === 2) { // YYYY-MM format
      const [year, month] = parts.map(Number);
      return monthNames[month]; // Just the month name
    }
    // If it's just a year (e.g., "2024")
    return period; // Returns "2024"
  };

  const filteredPosts = useMemo(() => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return allArchivePosts.filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(lowerCaseSearchTerm) ||
                            post.excerpt.toLowerCase().includes(lowerCaseSearchTerm);
      
      let matchesPeriod = true;
      if (selectedPeriod !== "all") {
        const postDate = new Date(post.created_at);
        const [filterYear, filterMonth] = selectedPeriod.split('-').map(Number);
        
        if (filterMonth) { // Filter by year and month
          matchesPeriod = postDate.getFullYear() === filterYear && (postDate.getMonth() + 1) === filterMonth;
        } else { // Filter by year only
          matchesPeriod = postDate.getFullYear() === filterYear;
        }
      }

      const matchesTag = selectedTag === "all" || post.tags?.map(cleanTagForStorage).includes(selectedTag);

      return matchesSearch && matchesPeriod && matchesTag;
    });
  }, [allArchivePosts, selectedPeriod, selectedTag, searchTerm, i18n.language]);

  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const currentPosts = useMemo(() => {
    const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
    const endIndex = startIndex + POSTS_PER_PAGE;
    return filteredPosts.slice(startIndex, endIndex);
  }, [filteredPosts, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const formatDate = (isoString: string) => {
    const dateObj = new Date(isoString);
    return dateObj.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false });
  };

  if (error) {
    return (
      <div className="container mx-auto py-10 px-4 bg-muted/40 rounded-lg shadow-inner">
        <p className="text-center text-destructive">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4 bg-muted/40 rounded-lg shadow-inner">
      <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">{t('archives')}</h1>
      <p className="text-lg text-muted-foreground text-center mb-10 max-w-2xl mx-auto">
        {t('archives page subtitle')}
      </p>

      <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-10 flex-wrap">
        <Input
          type="text"
          placeholder={t('search post placeholder')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:max-w-xs"
        />

        <Select
          value={selectedTag}
          onValueChange={(value) => setSelectedTag(value)}
        >
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder={t('tag placeholder')} />
          </SelectTrigger>
          <SelectContent>
            {allTags.map(tag => (
              <SelectItem key={tag} value={tag}>
                {tag === "all" ? t("tag placeholder") : getTranslatedTag(tag)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={selectedPeriod}
          onValueChange={(value) => setSelectedPeriod(value)}
        >
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder={t('select period placeholder')} />
          </SelectTrigger>
          <SelectContent>
            {allPeriods.map(period => (
              <SelectItem key={period} value={period}>
                {getPeriodDisplayName(period)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <p className="text-center text-muted-foreground">{t('loading archives')}</p>
      ) : currentPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentPosts.map((post) => (
            <Card key={post.id} className="flex flex-col overflow-hidden">
              <ResponsiveImage 
                src={post.image_url} 
                alt={post.title} 
                containerClassName="w-full h-48" 
                className="object-cover" 
              />
              <CardHeader className="flex-grow">
                <div className="flex justify-between items-center mb-2">
                  <Badge variant="secondary">{post.category}</Badge>
                  <span className="text-sm text-muted-foreground">{formatDate(post.created_at)}</span>
                </div>
                <CardTitle className="text-xl">{post.title}</CardTitle>
                <CardDescription className="text-sm text-muted-foreground">{t('by')} {post.author}</CardDescription>
                <div className="flex flex-wrap gap-1 mt-2">
                  {post.tags?.map(tag => (
                    <Badge key={tag} variant="outline" className="text-xs">{getTranslatedTag(tag)}</Badge>
                  ))}
                </div>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <p className="text-muted-foreground mb-4 line-clamp-2">{post.excerpt}</p>
                {post.pdf_link ? (
                  <a href={post.pdf_link} target="_blank" rel="noopener noreferrer" className="w-full">
                    <Button variant="outline" className="w-full">{t('read more pdf')}</Button>
                  </a>
                ) : (
                  <Link to={`/posts/${post.id}`}>
                    <Button variant="outline" className="w-full">{t('read more')}</Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground mt-8 text-lg">{t('no matching archives found')}</p>
      )}

      {totalPages > 1 && (
        <Pagination className="mt-12">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => handlePageChange(currentPage - 1)}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : undefined}
                />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  onClick={() => handlePageChange(page)}
                  isActive={currentPage === page}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={() => handlePageChange(currentPage + 1)}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : undefined}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default Archives;