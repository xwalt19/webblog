export interface BlogPost {
  id: string;
  titleKey: string;
  excerptKey: string;
  date: string;
  image: string;
  categoryKey: string;
  authorKey: string;
  tagsKeys: string[];
  contentKey?: string;
  pdfLink?: string; // Tambahkan properti pdfLink untuk arsip
}

export const dummyBlogPosts: BlogPost[] = [
  {
    id: "1",
    titleKey: "post 1 title",
    excerptKey: "post 1 excerpt",
    date: "2025-05-15",
    image: "https://source.unsplash.com/random/800x600/?coding,education",
    categoryKey: "programming category",
    authorKey: "procodecg author",
    tagsKeys: ["javascript tag", "webdev tag"],
    contentKey: "post 1 content",
  },
  {
    id: "2",
    titleKey: "post 2 title",
    excerptKey: "post 2 excerpt",
    date: "2025-05-10",
    image: "https://source.unsplash.com/random/800x600/?ai,future",
    categoryKey: "technology category",
    authorKey: "procodecg author",
    tagsKeys: ["ai tag", "innovation tag"],
    contentKey: "post 2 content",
  },
  {
    id: "3",
    titleKey: "post 3 title",
    excerptKey: "post 3 excerpt",
    date: "2025-05-01",
    image: "https://source.unsplash.com/random/800x600/?kids,coding",
    categoryKey: "education category",
    authorKey: "procodecg author",
    tagsKeys: ["kids tag", "learning tag"],
    contentKey: "post 3 content",
  },
  {
    id: "4",
    titleKey: "post 4 title",
    excerptKey: "post 4 excerpt",
    date: "2025-04-25",
    image: "https://source.unsplash.com/random/800x600/?data,science",
    categoryKey: "data science category",
    authorKey: "procodecg author",
    tagsKeys: ["data tag", "analytics tag"],
    contentKey: "post 4 content",
  },
  {
    id: "5",
    titleKey: "post 5 title",
    excerptKey: "post 5 excerpt",
    date: "2025-04-20",
    image: "https://source.unsplash.com/random/800x600/?cybersecurity,network",
    categoryKey: "cybersecurity category",
    authorKey: "procodecg author",
    tagsKeys: ["security tag", "network tag"],
    contentKey: "post 5 content",
  },
  {
    id: "6",
    titleKey: "post 6 title",
    excerptKey: "post 6 excerpt",
    date: "2025-04-15",
    image: "https://source.unsplash.com/random/800x600/?mobile,app",
    categoryKey: "mobile development category",
    authorKey: "procodecg author",
    tagsKeys: ["mobile tag", "android tag", "ios tag"],
    contentKey: "post 6 content",
  },
  {
    id: "7",
    titleKey: "post 7 title",
    excerptKey: "post 7 excerpt",
    date: "2025-04-10",
    image: "https://source.unsplash.com/random/800x600/?cloud,computing",
    categoryKey: "cloud computing category",
    authorKey: "procodecg author",
    tagsKeys: ["cloud tag", "aws tag", "azure tag"],
    contentKey: "post 7 content",
  },
];

export const dummyArchivePosts: BlogPost[] = [
  {
    id: "a1",
    titleKey: "archive 1 title",
    excerptKey: "archive 1 excerpt",
    date: "2023-12-01",
    image: "https://source.unsplash.com/random/800x600/?old,document",
    categoryKey: "history category",
    authorKey: "procodecg author",
    tagsKeys: ["old tag", "classic tag"],
    contentKey: "archive 1 content",
    pdfLink: "https://www.africau.edu/images/default/sample.pdf", // Contoh link PDF
  },
  {
    id: "a2",
    titleKey: "archive 2 title",
    excerptKey: "archive 2 excerpt",
    date: "2023-11-15",
    image: "https://source.unsplash.com/random/800x600/?vintage,tech",
    categoryKey: "retro tech category",
    authorKey: "procodecg author",
    tagsKeys: ["retro tag", "tech history tag"],
    contentKey: "archive 2 content",
    pdfLink: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", // Contoh link PDF
  },
  {
    id: "a3",
    titleKey: "archive 3 title",
    excerptKey: "archive 3 excerpt",
    date: "2023-10-20",
    image: "https://source.unsplash.com/random/800x600/?ancient,code",
    categoryKey: "programming history category",
    authorKey: "procodecg author",
    tagsKeys: ["history tag", "programming tag"],
    contentKey: "archive 3 content",
    pdfLink: "https://www.africau.edu/images/default/sample.pdf", // Contoh link PDF
  },
];