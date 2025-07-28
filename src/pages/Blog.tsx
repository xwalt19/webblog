import React, { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
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

const BlogPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [allPosts, setAllPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState("all");
  const [selectedTag, setSelectedTag] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchBlogPosts = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .is('pdf_link', null) // Hanya ambil postingan blog (yang tidak punya pdf_link)
          .order('created_at', { ascending: false });

        if (error) {
          throw error;
        }
        setAllPosts(data || []);
      } catch (err: any) {
        console.error("Error fetching blog posts:", err);
        setError(t("failed to load posts", { error: err.message }));
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPosts();
  }, [t]);

  useEffect(() => {
    setSelectedPeriod("all");
    setSelectedTag("all");
    setSearchTerm("");
    setCurrentPage(1);
  }, [i18n.language, allPosts]);

  const allTags: string[] = useMemo(() => {
    const tags = new Set<string>();
    allPosts.forEach(post => {
      post.tags?.forEach(tag => tags.add(tag));
    });
    return ["all", ...Array.from(tags)];
  }, [allPosts]);

  const monthNames = useMemo(() => [
    "", t("month names.january"), t("month names.february"), t("month names.march"), t("month names.april"), t("month names.may"), t("month names.june"),
    t("month names.july"), t("month names.august"), t("month names.september"), t("month names.october"), t("month names.november"), t("month names.december")
  ], [i18n.language]);

  const allPeriods: string[] = useMemo(() => {
    const periods = new Set<string>();
    allPosts.forEach(post => {
      const date = new Date(post.created_at);
      periods.add(`${date.getFullYear()}-${date.getMonth() + 1}`);
    });
    const sortedPeriods = Array.from(periods).sort((a, b) => {
      const [yearA, monthA] = a.split('-').map(Number);
      const [yearB, monthB] = b.split('-').map(Number);
      if (yearA !== yearB) return yearB - yearA;
      return monthB - monthA;
    });
    return ["all", ...sortedPeriods];
  }, [allPosts]);

  const getPeriodDisplayName = (period: string) => {
    if (period === "all") return t("all time");
    const [year, month] = period.split('-').map(Number);
    return `${year} - ${monthNames[month]}`;
  };

  const filteredPosts = useMemo(() => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return allPosts.filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(lowerCaseSearchTerm) ||
                            post.excerpt.toLowerCase().includes(lowerCaseSearchTerm);
      
      let matchesPeriod = true;
      if (selectedPeriod !== "all") {
        const [filterYear, filterMonth] = selectedPeriod.split('-').map(Number);
        const postDate = new Date(post.created_at);
        matchesPeriod = postDate.getFullYear() === filterYear && (postDate.getMonth() + 1) === filterMonth;
      }

      const matchesTag = selectedTag === "all" || post.tags?.includes(selectedTag);

      return matchesSearch && matchesPeriod && matchesTag;
    });
  }, [allPosts, selectedPeriod, selectedTag, searchTerm, i18n.language]);

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
    return dateObj.toLocaleDateString(i18n.language === 'id' ? 'id-ID' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  if (loading) {
    return (
      <div className="container mx-auto py-10 px-4 bg-muted/40 rounded-lg shadow-inner">
        <p className="text-center text-muted-foreground">{t('loading posts')}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-10 px-4 bg-muted/40 rounded-lg shadow-inner">
        <p className="text-center text-destructive">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4 bg-muted/40 rounded-lg shadow-inner">
      <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">{t('blog')}</h1>
      <p className="text-lg text-muted-foreground text-center mb-10 max-w-2xl mx-auto">
        {t('blog page subtitle')}
      </p>

      <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-10 flex-wrap">
        <Input
          type="text"
          placeholder={t('search post')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:max-w-xs"
        />

        <Select
          value={selectedTag}
          onValueChange={(value) => setSelectedTag(value)}
        >
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder={t('tag')} />
          </SelectTrigger>
          <SelectContent>
            {allTags.map(tag => (
              <SelectItem key={tag} value={tag}>
                {tag === "all" ? t("tag") : tag}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={selectedPeriod}
          onValueChange={(value) => setSelectedPeriod(value)}
        >
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder={t('select period')} />
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

      {currentPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentPosts.map((post) => (
            <Card key={post.id} className="flex flex-col overflow-hidden">
              <img src={post.image_url} alt={post.title} className="w-full h-48 object-cover" />
              <CardHeader className="flex-grow">
                <div className="flex justify-between items-center mb-2">
                  <Badge variant="secondary">{post.category}</Badge>
                  <span className="text-sm text-muted-foreground">{formatDate(post.created_at)}</span>
                </div>
                <CardTitle className="text-xl">{post.title}</CardTitle>
                <CardDescription className="text-sm text-muted-foreground">{t('by')} {post.author}</CardDescription>
                <div className="flex flex-wrap gap-1 mt-2">
                  {post.tags?.map(tag => (
                    <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                  ))}
                </div>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <p className="text-muted-foreground mb-4 line-clamp-2">{post.excerpt}</p>
                <Link to={`/posts/${post.id}`}>
                  <Button variant="outline" className="w-full">{t('read more')}</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground mt-8 text-lg">{t('no matching posts')}</p>
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

export default BlogPage;