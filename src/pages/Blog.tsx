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
    titleKey: "blog posts.post1 title",
    excerptKey: "blog posts.post1 excerpt",
    date: "10 Oktober 2023",
    image: "https://source.unsplash.com/random/400x250/?blogging,writing",
    categoryKey: "blog posts.post1 category",
    authorKey: "blog posts.post1 author",
    year: 2023,
    month: 10,
    tagsKeys: ["blog posts.post1 tags0", "blog posts.post1 tags1", "blog posts.post1 tags2"],
  },
  {
    id: "2",
    titleKey: "blog posts.post2 title",
    excerptKey: "blog posts.post2 excerpt",
    date: "15 November 2023",
    image: "https://source.unsplash.com/random/400x250/?content,marketing",
    categoryKey: "blog posts.post2 category",
    authorKey: "blog posts.post2 author",
    year: 2023,
    month: 11,
    tagsKeys: ["blog posts.post2 tags0", "blog posts.post2 tags1", "blog posts.post2 tags2"],
  },
  {
    id: "3",
    titleKey: "blog posts.post3 title",
    excerptKey: "blog posts.post3 excerpt",
    date: "20 Desember 2023",
    image: "https://source.unsplash.com/random/400x250/?seo,optimization",
    categoryKey: "blog posts.post3 category",
    authorKey: "blog posts.post3 author",
    year: 2023,
    month: 12,
    tagsKeys: ["blog posts.post3 tags0", "blog posts.post3 tags1", "blog posts.post3 tags2"],
  },
  {
    id: "4",
    titleKey: "blog posts.post4 title",
    excerptKey: "blog posts.post4 excerpt",
    date: "25 Januari 2024",
    image: "https://source.unsplash.com/random/400x250/?javascript,code",
    categoryKey: "blog posts.post4 category",
    authorKey: "blog posts.post4 author",
    year: 2024,
    month: 1,
    tagsKeys: ["blog posts.post4 tags0", "blog posts.post4 tags1", "blog posts.post4 tags2"],
  },
  {
    id: "5",
    titleKey: "blog posts.post5 title",
    excerptKey: "blog posts.post5 excerpt",
    date: "01 Februari 2024",
    image: "https://source.unsplash.com/random/400x250/?reactjs,programming",
    categoryKey: "blog posts.post5 category",
    authorKey: "blog posts.post5 author",
    year: 2024,
    month: 2,
    tagsKeys: ["blog posts.post5 tags0", "blog posts.post5 tags1", "blog posts.post5 tags2"],
  },
  {
    id: "6",
    titleKey: "blog posts.post6 title",
    excerptKey: "blog posts.post6 excerpt",
    date: "10 Februari 2024",
    image: "https://source.unsplash.com/random/400x250/?python,data",
    categoryKey: "blog posts.post6 category",
    authorKey: "blog posts.post6 author",
    year: 2024,
    month: 2,
    tagsKeys: ["blog posts.post6 tags0", "blog posts.post6 tags1", "blog posts.post6 tags2"],
  },
  {
    id: "7",
    titleKey: "blog posts.post7 title",
    excerptKey: "blog posts.post7 excerpt",
    date: "05 Maret 2024",
    image: "https://source.unsplash.com/random/400x250/?tailwind,css",
    categoryKey: "blog posts.post7 category",
    authorKey: "blog posts.post7 author",
    year: 2024,
    month: 3,
    tagsKeys: ["blog posts.post7 tags0", "blog posts.post7 tags1", "blog posts.post7 tags2"],
  },
  {
    id: "8",
    titleKey: "blog posts.post8 title",
    excerptKey: "blog posts.post8 excerpt",
    date: "12 April 2024",
    image: "https://source.unsplash.com/random/400x250/?async,javascript",
    categoryKey: "blog posts.post8 category",
    authorKey: "blog posts.post8 author",
    year: 2024,
    month: 4,
    tagsKeys: ["blog posts.post8 tags0", "blog posts.post8 tags1", "blog posts.post8 tags2"],
  },
  {
    id: "9",
    titleKey: "blog posts.post9 title",
    excerptKey: "blog posts.post9 excerpt",
    date: "20 Mei 2025",
    image: "https://source.unsplash.com/random/400x250/?debugging,code",
    categoryKey: "blog posts.post9 category",
    authorKey: "blog posts.post9 author",
    year: 2025,
    month: 5,
    tagsKeys: ["blog posts.post9 tags0", "blog posts.post9 tags1", "blog posts.post9 tags2"],
  },
];

const POSTS_PER_PAGE = 6;

const BlogPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  // Mengubah nilai awal agar sesuai dengan kunci internal
  const [selectedPeriod, setSelectedPeriod] = useState("all");
  const [selectedTag, setSelectedTag] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Effect untuk mereset filter saat bahasa berubah
  useEffect(() => {
    setSelectedPeriod("all"); // Reset ke kunci internal "all"
    setSelectedTag("all");   // Reset ke kunci internal "all"
    setSearchTerm(""); // Reset search term as well
    setCurrentPage(1);
  }, [i18n.language]); // Hanya bergantung pada i18n.language

  const allTags: string[] = useMemo(() => {
    const tags = new Set<string>();
    dummyBlogPosts.forEach(post => {
      post.tagsKeys.forEach(tagKey => tags.add(tagKey)); // Simpan kunci tag asli
    });
    return ["all", ...Array.from(tags)]; // Gunakan "all" sebagai kunci internal
  }, [i18n.language]); // Tambahkan i18n.language sebagai dependensi

  const monthNames = useMemo(() => [
    "", t("month names.january"), t("month names.february"), t("month names.march"), t("month names.april"), t("month names.may"), t("month names.june"),
    t("month names.july"), t("month names.august"), t("month names.september"), t("month names.october"), t("month names.november"), t("month names.december")
  ], [i18n.language]); // Removed 't' from dependencies

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
    return ["all", ...sortedPeriods]; // Gunakan "all" sebagai kunci internal
  }, [i18n.language]); // Tambahkan i18n.language sebagai dependensi

  const getPeriodDisplayName = (period: string) => {
    if (period === "all") return t("all time"); // Terjemahkan kunci "all"
    const [year, month] = period.split('-').map(Number);
    return `${year} - ${monthNames[month]}`;
  };

  const filteredPosts = useMemo(() => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return dummyBlogPosts.filter(post => {
      const matchesSearch = t(post.titleKey).toLowerCase().includes(lowerCaseSearchTerm) ||
                            t(post.excerptKey).toLowerCase().includes(lowerCaseSearchTerm);
      
      let matchesPeriod = true;
      if (selectedPeriod !== "all") { // Bandingkan dengan kunci internal
        const [filterYear, filterMonth] = selectedPeriod.split('-').map(Number);
        matchesPeriod = post.year === filterYear && post.month === filterMonth;
      }

      const matchesTag = selectedTag === "all" || post.tagsKeys.includes(selectedTag); // Bandingkan dengan kunci internal

      return matchesSearch && matchesPeriod && matchesTag;
    });
  }, [selectedPeriod, selectedTag, searchTerm, i18n.language]); // Removed 't' from dependencies

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
            {allTags.map(tagKey => (
              <SelectItem key={tagKey} value={tagKey}>
                {tagKey === "all" ? t("tag") : t(tagKey)} {/* Tampilkan terjemahan tag */}
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