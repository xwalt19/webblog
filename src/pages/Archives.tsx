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
    titleKey: "archive posts.archive1 title",
    excerptKey: "archive posts.archive1 excerpt",
    date: "10 Oktober 2023",
    image: "https://source.unsplash.com/random/400x250/?html,css,project",
    categoryKey: "archive posts.archive1 category",
    authorKey: "archive posts.archive1 author",
    year: 2023,
    month: 10,
    pdfLink: "https://docs.google.com/document/d/1_Galeri_Proyek_HTML_CSS/edit?usp=sharing",
    tagsKeys: ["archive posts.archive1 tags0", "archive posts.archive1 tags1", "archive posts.archive1 tags2", "archive posts.archive1 tags3"],
  },
  {
    id: "2",
    titleKey: "archive posts.archive2 title",
    excerptKey: "archive posts.archive2 excerpt",
    date: "15 November 2023",
    image: "https://source.unsplash.com/random/400x250/?javascript,learning,fun",
    categoryKey: "archive posts.archive2 category",
    authorKey: "archive posts.archive2 author",
    year: 2023,
    month: 11,
    pdfLink: "https://docs.google.com/document/d/1_Momen_Seru_JavaScript/edit?usp=sharing",
    tagsKeys: ["archive posts.archive2 tags0", "archive posts.archive2 tags1", "archive posts.archive2 tags2", "archive posts.archive2 tags3"],
  },
  {
    id: "3",
    titleKey: "archive posts.archive3 title",
    excerptKey: "archive posts.archive3 excerpt",
    date: "20 Desember 2023",
    image: "https://source.unsplash.com/random/400x250/?reactjs,app,showcase",
    categoryKey: "archive posts.archive3 category",
    authorKey: "archive posts.archive3 author",
    year: 2023,
    month: 12,
    pdfLink: "https://docs.google.com/document/d/1_Pameran_Aplikasi_React/edit?usp=sharing",
    tagsKeys: ["archive posts.archive3 tags0", "archive posts.archive3 tags1", "archive posts.archive3 tags2", "archive posts.archive3 tags3"],
  },
  {
    id: "4",
    titleKey: "archive posts.archive4 title",
    excerptKey: "archive posts.archive4 excerpt",
    date: "25 Januari 2024",
    image: "https://source.unsplash.com/random/400x250/?python,data,reflection",
    categoryKey: "archive posts.archive4 category",
    authorKey: "archive posts.archive4 author",
    year: 2024,
    month: 1,
    pdfLink: "https://docs.google.com/document/d/1_Refleksi_Python_Data_Science/edit?usp=sharing",
    tagsKeys: ["archive posts.archive4 tags0", "archive posts.archive4 tags1", "archive posts.archive4 tags2", "archive posts.archive4 tags3"],
  },
  {
    id: "5",
    titleKey: "archive posts.archive5 title",
    excerptKey: "archive posts.archive5 excerpt",
    date: "01 Februari 2024",
    image: "https://source.unsplash.com/random/400x250/?tailwind,uiux,workshop",
    categoryKey: "archive posts.archive5 category",
    authorKey: "archive posts.archive5 author",
    year: 2024,
    month: 2,
    pdfLink: "https://docs.google.com/document/d/1_Workshop_UIUX_Tailwind/edit?usp=sharing",
    tagsKeys: ["archive posts.archive5 tags0", "archive posts.archive5 tags1", "archive posts.archive5 tags2", "archive posts.archive5 tags3"],
  },
  {
    id: "6",
    titleKey: "archive posts.archive6 title",
    excerptKey: "archive posts.archive6 excerpt",
    date: "10 Februari 2024",
    image: "https://source.unsplash.com/random/400x250/?debugging,problemsolving",
    categoryKey: "archive posts.archive6 category",
    authorKey: "archive posts.archive6 author",
    year: 2024,
    month: 2,
    pdfLink: "https://docs.google.com/document/d/1_Debugging_Kode/edit?usp=sharing",
    tagsKeys: ["archive posts.archive6 tags0", "archive posts.archive6 tags1", "archive posts.archive6 tags2", "archive posts.archive6 tags3"],
  },
  {
    id: "7",
    titleKey: "archive posts.archive7 title",
    excerptKey: "archive posts.archive7 excerpt",
    date: "05 Maret 2024",
    image: "https://source.unsplash.com/random/400x250/?startup,industry,visit",
    categoryKey: "archive posts.archive7 category",
    authorKey: "archive posts.archive7 author",
    year: 2024,
    month: 3,
    pdfLink: "https://docs.google.com/document/d/1_Kunjungan_Industri_Startup/edit?usp=sharing",
    tagsKeys: ["archive posts.archive7 tags0", "archive posts.archive7 tags1", "archive posts.archive7 tags2", "archive posts.archive7 tags3"],
  },
  {
    id: "8",
    titleKey: "archive posts.archive8 title",
    excerptKey: "archive posts.archive8 excerpt",
    date: "12 April 2024",
    image: "https://source.unsplash.com/random/400x250/?hackathon,coding,challenge",
    categoryKey: "archive posts.archive8 category",
    authorKey: "archive posts.archive8 author",
    year: 2024,
    month: 4,
    pdfLink: "https://docs.google.com/document/d/1_Hackathon_Mini_Coding/edit?usp=sharing",
    tagsKeys: ["archive posts.archive8 tags0", "archive posts.archive8 tags1", "archive posts.archive8 tags2", "archive posts.archive8 tags3"],
  },
  {
    id: "9",
    titleKey: "archive posts.archive9 title",
    excerptKey: "archive posts.archive9 excerpt",
    date: "20 Mei 2025",
    image: "https://source.unsplash.com/random/400x250/?graduation,certificate,celebration",
    categoryKey: "archive posts.archive9 category",
    authorKey: "archive posts.archive9 author",
    year: 2025,
    month: 5,
    pdfLink: "https://docs.google.com/document/d/1_Sertifikasi_Kelulusan/edit?usp=sharing",
    tagsKeys: ["archive posts.archive9 tags0", "archive posts.archive9 tags1", "archive posts.archive9 tags2", "archive posts.archive9 tags3"],
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
    "", t("month names.january"), t("month names.february"), t("month names.march"), t("month names.april"), t("month names.may"), t("month names.june"),
    t("month names.july"), t("month names.august"), t("month names.september"), t("month names.october"), t("month names.november"), t("month names.december")
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
        {t('archives page subtitle')}
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
                {post.pdfLink ? (
                  <a href={post.pdfLink} target="_blank" rel="noopener noreferrer" className="w-full">
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

export default Archives;