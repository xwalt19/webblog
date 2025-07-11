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
  pdfLink?: string;
  tagsKeys: string[];
}

const dummyBlogPosts: BlogPost[] = [
  {
    id: "1",
    titleKey: "archive_posts.archive1_title",
    excerptKey: "archive_posts.archive1_excerpt",
    date: "10 Oktober 2023",
    image: "https://source.unsplash.com/random/400x250/?html,css,project",
    categoryKey: "archive_posts.archive1_category",
    authorKey: "archive_posts.archive1_author",
    year: 2023,
    month: 10,
    pdfLink: "https://docs.google.com/document/d/1_Galeri_Proyek_HTML_CSS/edit?usp=sharing",
    tagsKeys: ["archive_posts.archive1_tags.0", "archive_posts.archive1_tags.1", "archive_posts.archive1_tags.2", "archive_posts.archive1_tags.3"],
  },
  {
    id: "2",
    titleKey: "archive_posts.archive2_title",
    excerptKey: "archive_posts.archive2_excerpt",
    date: "15 November 2023",
    image: "https://source.unsplash.com/random/400x250/?javascript,learning,fun",
    categoryKey: "archive_posts.archive2_category",
    authorKey: "archive_posts.archive2_author",
    year: 2023,
    month: 11,
    pdfLink: "https://docs.google.com/document/d/1_Momen_Seru_JavaScript/edit?usp=sharing",
    tagsKeys: ["archive_posts.archive2_tags.0", "archive_posts.archive2_tags.1", "archive_posts.archive2_tags.2", "archive_posts.archive2_tags.3"],
  },
  {
    id: "3",
    titleKey: "archive_posts.archive3_title",
    excerptKey: "archive_posts.archive3_excerpt",
    date: "20 Desember 2023",
    image: "https://source.unsplash.com/random/400x250/?reactjs,app,showcase",
    categoryKey: "archive_posts.archive3_category",
    authorKey: "archive_posts.archive3_author",
    year: 2023,
    month: 12,
    pdfLink: "https://docs.google.com/document/d/1_Pameran_Aplikasi_React/edit?usp=sharing",
    tagsKeys: ["archive_posts.archive3_tags.0", "archive_posts.archive3_tags.1", "archive_posts.archive3_tags.2", "archive_posts.archive3_tags.3"],
  },
  {
    id: "4",
    titleKey: "archive_posts.archive4_title",
    excerptKey: "archive_posts.archive4_excerpt",
    date: "25 Januari 2024",
    image: "https://source.unsplash.com/random/400x250/?python,data,reflection",
    categoryKey: "archive_posts.archive4_category",
    authorKey: "archive_posts.archive4_author",
    year: 2024,
    month: 1,
    pdfLink: "https://docs.google.com/document/d/1_Refleksi_Python_Data_Science/edit?usp=sharing",
    tagsKeys: ["archive_posts.archive4_tags.0", "archive_posts.archive4_tags.1", "archive_posts.archive4_tags.2", "archive_posts.archive4_tags.3"],
  },
  {
    id: "5",
    titleKey: "archive_posts.archive5_title",
    excerptKey: "archive_posts.archive5_excerpt",
    date: "01 Februari 2024",
    image: "https://source.unsplash.com/random/400x250/?tailwind,uiux,workshop",
    categoryKey: "archive_posts.archive5_category",
    authorKey: "archive_posts.archive5_author",
    year: 2024,
    month: 2,
    pdfLink: "https://docs.google.com/document/d/1_Workshop_UIUX_Tailwind/edit?usp=sharing",
    tagsKeys: ["archive_posts.archive5_tags.0", "archive_posts.archive5_tags.1", "archive_posts.archive5_tags.2", "archive_posts.archive5_tags.3"],
  },
  {
    id: "6",
    titleKey: "archive_posts.archive6_title",
    excerptKey: "archive_posts.archive6_excerpt",
    date: "10 Februari 2024",
    image: "https://source.unsplash.com/random/400x250/?debugging,problemsolving",
    categoryKey: "archive_posts.archive6_category",
    authorKey: "archive_posts.archive6_author",
    year: 2024,
    month: 2,
    pdfLink: "https://docs.google.com/document/d/1_Debugging_Kode/edit?usp=sharing",
    tagsKeys: ["archive_posts.archive6_tags.0", "archive_posts.archive6_tags.1", "archive_posts.archive6_tags.2", "archive_posts.archive6_tags.3"],
  },
  {
    id: "7",
    titleKey: "archive_posts.archive7_title",
    excerptKey: "archive_posts.archive7_excerpt",
    date: "05 Maret 2024",
    image: "https://source.unsplash.com/random/400x250/?startup,industry,visit",
    categoryKey: "archive_posts.archive7_category",
    authorKey: "archive_posts.archive7_author",
    year: 2024,
    month: 3,
    pdfLink: "https://docs.google.com/document/d/1_Kunjungan_Industri_Startup/edit?usp=sharing",
    tagsKeys: ["archive_posts.archive7_tags.0", "archive_posts.archive7_tags.1", "archive_posts.archive7_tags.2", "archive_posts.archive7_tags.3"],
  },
  {
    id: "8",
    titleKey: "archive_posts.archive8_title",
    excerptKey: "archive_posts.archive8_excerpt",
    date: "12 April 2024",
    image: "https://source.unsplash.com/random/400x250/?hackathon,coding,challenge",
    categoryKey: "archive_posts.archive8_category",
    authorKey: "archive_posts.archive8_author",
    year: 2024,
    month: 4,
    pdfLink: "https://docs.google.com/document/d/1_Hackathon_Mini_Coding/edit?usp=sharing",
    tagsKeys: ["archive_posts.archive8_tags.0", "archive_posts.archive8_tags.1", "archive_posts.archive8_tags.2", "archive_posts.archive8_tags.3"],
  },
  {
    id: "9",
    titleKey: "archive_posts.archive9_title",
    excerptKey: "archive_posts.archive9_excerpt",
    date: "20 Mei 2025",
    image: "https://source.unsplash.com/random/400x250/?graduation,certificate,celebration",
    categoryKey: "archive_posts.archive9_category",
    authorKey: "archive_posts.archive9_author",
    year: 2025,
    month: 5,
    pdfLink: "https://docs.google.com/document/d/1_Sertifikasi_Kelulusan/edit?usp=sharing",
    tagsKeys: ["archive_posts.archive9_tags.0", "archive_posts.archive9_tags.1", "archive_posts.archive9_tags.2", "archive_posts.archive9_tags.3"],
  },
];

const POSTS_PER_PAGE = 6;

const Archives: React.FC = () => {
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
    "", t("month_names.january"), t("month_names.february"), t("month_names.march"), t("month_names.april"), t("month_names.may"), t("month_names.june"),
    t("month_names.july"), t("month_names.august"), t("month_names.september"), t("month_names.october"), t("month_names.november"), t("month_names.december")
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
    if (period === "all") return t("all_time"); // Terjemahkan kunci "all"
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
      <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">{t('archives')}</h1>
      <p className="text-lg text-muted-foreground text-center mb-10 max-w-2xl mx-auto">
        {t('archives_page_subtitle')}
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
                {post.pdfLink ? (
                  <a href={post.pdfLink} target="_blank" rel="noopener noreferrer" className="w-full">
                    <Button variant="outline" className="w-full">{t('read_more_pdf')}</Button>
                  </a>
                ) : (
                  <Link to={`/posts/${post.id}`}>
                    <Button variant="outline" className="w-full">{t('read_more')}</Button>
                  </Link>
                )}
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

export default Archives;