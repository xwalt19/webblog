export interface ExternalArticle {
  id: string;
  titleKey: string;
  sourceKey: string;
  date: string;
  url: string;
  excerptKey: string;
}

export const dummyExternalArticles: ExternalArticle[] = [
  {
    id: "ea1",
    titleKey: "external articles.ea1 title",
    sourceKey: "external articles.ea1 source",
    date: "10 Mei 2024",
    url: "https://www.example.com/tech-trends-2024",
    excerptKey: "external articles.ea1 desc",
  },
  {
    id: "ea2",
    titleKey: "external articles.ea2 title",
    sourceKey: "external articles.ea2 source",
    date: "05 Mei 2024",
    url: "https://www.example.com/coding-for-kids-future",
    excerptKey: "external articles.ea2 desc",
  },
  {
    id: "ea3",
    titleKey: "external articles.ea3 title",
    sourceKey: "external articles.ea3 source",
    date: "01 Mei 2024",
    url: "https://www.example.com/data-science-career-guide",
    excerptKey: "external articles.ea3 desc",
  },
  {
    id: "ea4",
    titleKey: "external articles.ea4 title",
    sourceKey: "external articles.ea4 source",
    date: "28 April 2024",
    url: "https://www.example.com/cybersecurity-threats",
    excerptKey: "external articles.ea4 desc",
  },
];