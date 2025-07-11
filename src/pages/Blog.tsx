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

interface BlogPost {
  id: string;
  titleKey: string;
  excerptKey: string;
  date: string;
  image: string;
  categoryKey: string;
  authorKey: string;
  year: number;
  month: number;
  tagsKeys: string[];
}

const dummyBlogPosts: BlogPost[] = [
  {
    id: "1",
    titleKey: "blog_posts.post1_title",
    excerptKey: "blog_posts.post1_excerpt",
    date: "10 Oktober 2023",
    image: "https://source.unsplash.com/random/400x250/?blogging,writing",
    categoryKey: "blog_posts.post1_category",
    authorKey: "blog_posts.post1_author",
    year: 2023,
    month: 10,
    tagsKeys: ["blog_posts.post1_tags.0", "blog_posts.post1_tags.1", "blog_posts.post1_tags.2"],
  },
  {
    id: "2",
    titleKey: "blog_posts.post2_title",
    excerptKey: "blog_posts.post2_excerpt",
    date: "15 November 2023",
    image: "https://source.unsplash.com/random/400x250/?content,marketing",
    categoryKey: "blog_posts.post2_category",
    authorKey: "blog_posts.post2_author",
    year: 2023,
    month: 11,
    tagsKeys: ["blog_posts.post2_tags.0", "blog_posts.post2_tags.1", "blog_posts.post2_tags.2"],
  },
  {
    id: "3",
    titleKey: "blog_posts.post3_title",
    excerptKey: "blog_posts.post3_excerpt",
    date: "20 Desember 2023",
    image: "https://source.unsplash.com/random/400x250/?seo,optimization",
    categoryKey: "blog_posts.post3_category",
    authorKey: "blog_posts.post3_author",
    year: 2023,
    month: 12,
    tagsKeys: ["blog_posts.post3_tags.0", "blog_posts.post3_tags.1", "blog_posts.post3_tags.2"],
  },
  {
    id: "4",
    titleKey: "blog_posts.post4_title",
    excerptKey: "blog_posts.post4_excerpt",
    date: "25 Januari 2024",
    image: "https://source.unsplash.com/random/400x250/?javascript,code",
    categoryKey: "blog_posts.post4_category",
    authorKey: "blog_posts.post4_author",
    year: 2024,
    month: 1,
    tagsKeys: ["blog_posts.post4_tags.0", "blog_posts.post4_tags.1", "blog_posts.post4_tags.2"],
  },
  {
    id: "5",
    titleKey: "blog_posts.post5_title",
    excerptKey: "blog_posts.post5_excerpt",
    date: "01 Februari 2024",
    image: "https://source.unsplash.com/random/400x250/?reactjs,programming",
    categoryKey: "blog_posts.post5_category",
    authorKey: "blog_posts.post5_author",
    year: 2024,
    month: 2,
    tagsKeys: ["blog_posts.post5_tags.0", "blog_posts.post5_tags.1", "blog_posts.post5_tags.2"],
  },
  {
    id: "6",
    titleKey: "blog_posts.post6_title",
    excerptKey: "blog_posts.post6_excerpt",
    date: "10 Februari 2024",
    image: "https://source.unsplash.com/random/400x250/?python,data",
    categoryKey: "blog_posts.post6_category",
    authorKey: "blog_posts.post6_author",
    year: 2024,
    month: 2,
    tagsKeys: ["blog_posts.post6_tags.0", "blog_posts.post6_tags.1", "blog_posts.post6_tags.2"],
  },
  {
    id: "7",
    titleKey: "blog_posts.post7_title",
    excerptKey: "blog_posts.post7_excerpt",
    date: "05 Maret 2024",
    image: "https://source.unsplash.com/random/400x250/?tailwind,css",
    categoryKey: "blog_posts.post7_category",
    authorKey: "blog_posts.post7_author",
    year: 2024,
    month: 3,
    tagsKeys: ["blog_posts.post7_tags.0", "blog_posts.post7_tags.1", "blog_posts.post7_tags.2"],
  },
  {
    id: "8",
    titleKey: "blog_posts.post8_title",
    excerptKey: "blog_posts.post8_excerpt",
    date: "12 April 2024",
    image: "https://source.unsplash.com/random/400x250/?async,javascript",
    categoryKey: "blog_posts.post8_category",
    authorKey: "blog_posts.post8_author",
    year: 2024,
    month: 4,
    tagsKeys: ["blog_posts.post8_tags.0", "blog_posts.post8_tags.1", "blog_posts.post8_tags.2"],
  },
  {
    id: "9",
    titleKey: "blog_posts.post9_title",
    excerptKey: "blog_posts.post9_excerpt",
    date: "20 Mei 2025",
    image: "https://source.unsplash.com/random/400x250/?debugging,code",
    categoryKey: "blog_posts.post9_category",
    authorKey: "blog_posts.post9_author",
    year: 2025,
    month: 5,
    tagsKeys: ["blog_posts.post9_tags.0", "blog_posts.post9_tags.1", "blog_posts.post9_tags.2"],
  },
];

const POSTS_PER_PAGE = 6;

const BlogPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  // Mengubah nilai awal agar sesuai dengan terjemahan "All"
  const [selectedPeriod, setSelectedPeriod] = useState(t("all_time"));
  const [selectedTag, setSelectedTag] = useState(t("tag"));
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const allTags: string[] = useMemo(() => {
    const tags = new Set<string>();
    dummyBlogPosts.forEach(post => {
      post.tagsKeys.forEach(tagKey => tags.add(t(tagKey)));
    });
    return [t("tag"), ...Array.from(tags)];
  }, [i18n.language]); // Re-calculate when language changes

  const monthNames = [
    "", t("month_names.january"), t("month_names.february"), t("month_names.march"), t("month_names.april"), t("month_names.may"), t("month_names.june"),
    t("month_names.july"), t("month_names.august"), t("month_names.september"), t("month_names.october"), t("month_names.november"), t("month_names.december")
  ];

  const allPeriods: string[] = useMemo(() => {
    const periods = new Set<string>();
    dummyBlogPosts.forEach(post => {
      periods.add(`${post.year}-${post.month}`);
    });
    const sortedPeriods = Array.from(periods).sort((a, b) => {
      const [yearA, monthA] = a.split('-').map(Number);
      const [yearB, monthB] = b.split('-').map(Number);
      if (yearA !== yearB) return yearB - yearA;
      return monthB - monthA;
    });
    return [t("all_time"), ...sortedPeriods];
  }, [i18n.language]);

  const getPeriodDisplayName = (period: string) => {
    if (period === t("all_time")) return t("all_time");
    const [year, month] = period.split('-').map(Number);
    return `${year} - ${monthNames[month]}`;
  };

  const filteredPosts = useMemo(() => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return dummyBlogPosts.filter(post => {
      const matchesSearch = t(post.titleKey).toLowerCase().includes(lowerCaseSearchTerm) ||
                            t(post.excerptKey).toLowerCase().includes(lowerCaseSearchTerm);
      
      let matchesPeriod = true;
      if (selectedPeriod !== t("all_time")) {
        const [filterYear, filterMonth] = selectedPeriod.split('-').map(Number);
        matchesPeriod = post.year === filterYear && post.month === filterMonth;
      }

      const matchesTag = selectedTag === t("tag") || post.tagsKeys.map(key => t(key)).includes(selectedTag);

      return matchesSearch && matchesPeriod && matchesTag;
    });
  }, [selectedPeriod, selectedTag, searchTerm, i18n.language]);

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

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedPeriod, selectedTag, searchTerm, i18n.language]);

  return (
    <div className="container mx-auto py-10 px-4 bg-muted/40 rounded-lg shadow-inner">
      <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">{t('blog')}</h1>
      <p className="text-lg text-muted-foreground text-center mb-10 max-w-2xl mx-auto">
        {t('blog_page_subtitle')}
      </p>

      <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-10 flex-wrap">
        <Input
          type="text"
          placeholder={t('search_post')}
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
                {tag === t("tag") ? t("tag") : tag}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={selectedPeriod}
          onValueChange={(value) => setSelectedPeriod(value)}
        >
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder={t('select_period')} />
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
              <img src={post.image} alt={t(post.titleKey)} className="w-full h-48 object-cover" />
              <CardHeader className="flex-grow">
                <div className="flex justify-between items-center mb-2">
                  <Badge variant="secondary">{t(post.categoryKey)}</Badge>
                  <span className="text-sm text-muted-foreground">{post.date}</span>
                </div>
                <CardTitle className="text-xl">{t(post.titleKey)}</CardTitle>
                <CardDescription className="text-sm text-muted-foreground">{t('by')} {t(post.authorKey)}</CardDescription>
                <div className="flex flex-wrap gap-1 mt-2">
                  {post.tagsKeys.map(tagKey => (
                    <Badge key={tagKey} variant="outline" className="text-xs">{t(tagKey)}</Badge>
                  ))}
                </div>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <p className="text-muted-foreground mb-4 line-clamp-2">{t(post.excerptKey)}</p>
                <Link to={`/posts/${post.id}`}>
                  <Button variant="outline" className="w-full">{t('read_more')}</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground mt-8 text-lg">{t('no_matching_posts')}</p>
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