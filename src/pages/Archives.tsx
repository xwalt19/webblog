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
    titleKey: "archiveposts.archive1title",
    excerptKey: "archiveposts.archive1excerpt",
    date: "10 Oktober 2023",
    image: "https://source.unsplash.com/random/400x250/?html,css,project",
    categoryKey: "archiveposts.archive1category",
    authorKey: "archiveposts.archive1author",
    year: 2023,
    month: 10,
    pdfLink: "https://docs.google.com/document/d/1_Galeri_Proyek_HTML_CSS/edit?usp=sharing",
    tagsKeys: ["archiveposts.archive1tags0", "archiveposts.archive1tags1", "archiveposts.archive1tags2", "archiveposts.archive1tags3"],
  },
  {
    id: "2",
    titleKey: "archiveposts.archive2title",
    excerptKey: "archiveposts.archive2excerpt",
    date: "15 November 2023",
    image: "https://source.unsplash.com/random/400x250/?javascript,learning,fun",
    categoryKey: "archiveposts.archive2category",
    authorKey: "archiveposts.archive2author",
    year: 2023,
    month: 11,
    pdfLink: "https://docs.google.com/document/d/1_Momen_Seru_JavaScript/edit?usp=sharing",
    tagsKeys: ["archiveposts.archive2tags0", "archiveposts.archive2tags1", "archiveposts.archive2tags2", "archiveposts.archive2tags3"],
  },
  {
    id: "3",
    titleKey: "archiveposts.archive3title",
    excerptKey: "archiveposts.archive3excerpt",
    date: "20 Desember 2023",
    image: "https://source.unsplash.com/random/400x250/?reactjs,app,showcase",
    categoryKey: "archiveposts.archive3category",
    authorKey: "archiveposts.archive3author",
    year: 2023,
    month: 12,
    pdfLink: "https://docs.google.com/document/d/1_Pameran_Aplikasi_React/edit?usp=sharing",
    tagsKeys: ["archiveposts.archive3tags0", "archiveposts.archive3tags1", "archiveposts.archive3tags2", "archiveposts.archive3tags3"],
  },
  {
    id: "4",
    titleKey: "archiveposts.archive4title",
    excerptKey: "archiveposts.archive4excerpt",
    date: "25 Januari 2024",
    image: "https://source.unsplash.com/random/400x250/?python,data,reflection",
    categoryKey: "archiveposts.archive4category",
    authorKey: "archiveposts.archive4author",
    year: 2024,
    month: 1,
    pdfLink: "https://docs.google.com/document/d/1_Refleksi_Python_Data_Science/edit?usp=sharing",
    tagsKeys: ["archiveposts.archive4tags0", "archiveposts.archive4tags1", "archiveposts.archive4tags2", "archiveposts.archive4tags3"],
  },
  {
    id: "5",
    titleKey: "archiveposts.archive5title",
    excerptKey: "archiveposts.archive5excerpt",
    date: "01 Februari 2024",
    image: "https://source.unsplash.com/random/400x250/?tailwind,uiux,workshop",
    categoryKey: "archiveposts.archive5category",
    authorKey: "archiveposts.archive5author",
    year: 2024,
    month: 2,
    pdfLink: "https://docs.google.com/document/d/1_Workshop_UIUX_Tailwind/edit?usp=sharing",
    tagsKeys: ["archiveposts.archive5tags0", "archiveposts.archive5tags1", "archiveposts.archive5tags2", "archiveposts.archive5tags3"],
  },
  {
    id: "6",
    titleKey: "archiveposts.archive6title",
    excerptKey: "archiveposts.archive6excerpt",
    date: "10 Februari 2024",
    image: "https://source.unsplash.com/random/400x250/?debugging,problemsolving",
    categoryKey: "archiveposts.archive6category",
    authorKey: "archiveposts.archive6author",
    year: 2024,
    month: 2,
    pdfLink: "https://docs.google.com/document/d/1_Debugging_Kode/edit?usp=sharing",
    tagsKeys: ["archiveposts.archive6tags0", "archiveposts.archive6tags1", "archiveposts.archive6tags2", "archiveposts.archive6tags3"],
  },
  {
    id: "7",
    titleKey: "archiveposts.archive7title",
    excerptKey: "archiveposts.archive7excerpt",
    date: "05 Maret 2024",
    image: "https://source.unsplash.com/random/400x250/?startup,industry,visit",
    categoryKey: "archiveposts.archive7category",
    authorKey: "archiveposts.archive7author",
    year: 2024,
    month: 3,
    pdfLink: "https://docs.google.com/document/d/1_Kunjungan_Industri_Startup/edit?usp=sharing",
    tagsKeys: ["archiveposts.archive7tags0", "archiveposts.archive7tags1", "archiveposts.archive7tags2", "archiveposts.archive7tags3"],
  },
  {
    id: "8",
    titleKey: "archiveposts.archive8title",
    excerptKey: "archiveposts.archive8excerpt",
    date: "12 April 2024",
    image: "https://source.unsplash.com/random/400x250/?hackathon,coding,challenge",
    categoryKey: "archiveposts.archive8category",
    authorKey: "archiveposts.archive8author",
    year: 2024,
    month: 4,
    pdfLink: "https://docs.google.com/document/d/1_Hackathon_Mini_Coding/edit?usp=sharing",
    tagsKeys: ["archiveposts.archive8tags0", "archiveposts.archive8tags1", "archiveposts.archive8tags2", "archiveposts.archive8tags3"],
  },
  {
    id: "9",
    titleKey: "archiveposts.archive9title",
    excerptKey: "archiveposts.archive9excerpt",
    date: "20 Mei 2025",
    image: "https://source.unsplash.com/random/400x250/?graduation,certificate,celebration",
    categoryKey: "archiveposts.archive9category",
    authorKey: "archiveposts.archive9author",
    year: 2025,
    month: 5,
    pdfLink: "https://docs.google.com/document/d/1_Sertifikasi_Kelulusan/edit?usp=sharing",
    tagsKeys: ["archiveposts.archive9tags0", "archiveposts.archive9tags1", "archiveposts.archive9tags2", "archiveposts.archive9tags3"],
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
      <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">{t('archives')}</h1>
      <p className="text-lg text-muted-foreground text-center mb-10 max-w-2xl mx-auto">
        {t('archivespagesubtitle')}
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
                {post.pdfLink ? (
                  <a href={post.pdfLink} target="_blank" rel="noopener noreferrer" className="w-full">
                    <Button variant="outline" className="w-full">{t('readmorepdf')}</Button>
                  </a>
                ) : (
                  <Link to={`/posts/${post.id}`}>
                    <Button variant="outline" className="w-full">{t('readmore')}</Button>
                  </Link>
                )}
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

export default Archives;