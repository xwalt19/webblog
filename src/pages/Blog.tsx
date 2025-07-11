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
    titleKey: "blogposts.post1title",
    excerptKey: "blogposts.post1excerpt",
    date: "10 Oktober 2023",
    image: "https://source.unsplash.com/random/400x250/?blogging,writing",
    categoryKey: "blogposts.post1category",
    authorKey: "blogposts.post1author",
    year: 2023,
    month: 10,
    tagsKeys: ["blogposts.post1tags0", "blogposts.post1tags1", "blogposts.post1tags2"],
  },
  {
    id: "2",
    titleKey: "blogposts.post2title",
    excerptKey: "blogposts.post2excerpt",
    date: "15 November 2023",
    image: "https://source.unsplash.com/random/400x250/?content,marketing",
    categoryKey: "blogposts.post2category",
    authorKey: "blogposts.post2author",
    year: 2023,
    month: 11,
    tagsKeys: ["blogposts.post2tags0", "blogposts.post2tags1", "blogposts.post2tags2"],
  },
  {
    id: "3",
    titleKey: "blogposts.post3title",
    excerptKey: "blogposts.post3excerpt",
    date: "20 Desember 2023",
    image: "https://source.unsplash.com/random/400x250/?seo,optimization",
    categoryKey: "blogposts.post3category",
    authorKey: "blogposts.post3author",
    year: 2023,
    month: 12,
    tagsKeys: ["blogposts.post3tags0", "blogposts.post3tags1", "blogposts.post3tags2"],
  },
  {
    id: "4",
    titleKey: "blogposts.post4title",
    excerptKey: "blogposts.post4excerpt",
    date: "25 Januari 2024",
    image: "https://source.unsplash.com/random/400x250/?javascript,code",
    categoryKey: "blogposts.post4category",
    authorKey: "blogposts.post4author",
    year: 2024,
    month: 1,
    tagsKeys: ["blogposts.post4tags0", "blogposts.post4tags1", "blogposts.post4tags2"],
  },
  {
    id: "5",
    titleKey: "blogposts.post5title",
    excerptKey: "blogposts.post5excerpt",
    date: "01 Februari 2024",
    image: "https://source.unsplash.com/random/400x250/?reactjs,programming",
    categoryKey: "blogposts.post5category",
    authorKey: "blogposts.post5author",
    year: 2024,
    month: 2,
    tagsKeys: ["blogposts.post5tags0", "blogposts.post5tags1", "blogposts.post5tags2"],
  },
  {
    id: "6",
    titleKey: "blogposts.post6title",
    excerptKey: "blogposts.post6excerpt",
    date: "10 Februari 2024",
    image: "https://source.unsplash.com/random/400x250/?python,data",
    categoryKey: "blogposts.post6category",
    authorKey: "blogposts.post6author",
    year: 2024,
    month: 2,
    tagsKeys: ["blogposts.post6tags0", "blogposts.post6tags1", "blogposts.post6tags2"],
  },
  {
    id: "7",
    titleKey: "blogposts.post7title",
    excerptKey: "blogposts.post7excerpt",
    date: "05 Maret 2024",
    image: "https://source.unsplash.com/random/400x250/?tailwind,css",
    categoryKey: "blogposts.post7category",
    authorKey: "blogposts.post7author",
    year: 2024,
    month: 3,
    tagsKeys: ["blogposts.post7tags0", "blogposts.post7tags1", "blogposts.post7tags2"],
  },
  {
    id: "8",
    titleKey: "blogposts.post8title",
    excerptKey: "blogposts.post8excerpt",
    date: "12 April 2024",
    image: "https://source.unsplash.com/random/400x250/?async,javascript",
    categoryKey: "blogposts.post8category",
    authorKey: "blogposts.post8author",
    year: 2024,
    month: 4,
    tagsKeys: ["blogposts.post8tags0", "blogposts.post8tags1", "blogposts.post8tags2"],
  },
  {
    id: "9",
    titleKey: "blogposts.post9title",
    excerptKey: "blogposts.post9excerpt",
    date: "20 Mei 2025",
    image: "https://source.unsplash.com/random/400x250/?debugging,code",
    categoryKey: "blogposts.post9category",
    authorKey: "blogposts.post9author",
    year: 2025,
    month: 5,
    tagsKeys: ["blogposts.post9tags0", "blogposts.post9tags1", "blogposts.post9tags2"],
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
    "", t("monthnames.january"), t("monthnames.february"), t("monthnames.march"), t("monthnames.april"), t("monthnames.may"), t("monthnames.june"),
    t("monthnames.july"), t("monthnames.august"), t("monthnames.september"), t("monthnames.october"), t("monthnames.november"), t("monthnames.december")
  ], [i18n.language, t]); // Tambahkan i18n.language dan t sebagai dependensi

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
    if (period === "all") return t("alltime"); // Terjemahkan kunci "all"
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
  }, [selectedPeriod, selectedTag, searchTerm, i18n.language, t]); // Tetap bergantung pada i18n.language dan t untuk terjemahan konten

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
        {t('blogpagesubtitle')}
      </p>

      <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-10 flex-wrap">
        <Input
          type="text"
          placeholder={t('searchpost')}
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
            <SelectValue placeholder={t('selectperiod')} />
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
                  <Button variant="outline" className="w-full">{t('readmore')}</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground mt-8 text-lg">{t('nomatchingposts')}</p>
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