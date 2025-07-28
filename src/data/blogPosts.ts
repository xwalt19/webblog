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
    titleKey: "blog posts.post1 title",
    excerptKey: "blog posts.post1 excerpt",
    date: "2024-05-15",
    image: "https://source.unsplash.com/random/800x600/?coding,education",
    categoryKey: "blog posts.category programming",
    authorKey: "blog posts.author procodecg",
    tagsKeys: ["blog posts.tag javascript", "blog posts.tag webdev"],
    contentKey: "blog posts.post1 content",
  },
  {
    id: "2",
    titleKey: "blog posts.post2 title",
    excerptKey: "blog posts.post2 excerpt",
    date: "2024-05-10",
    image: "https://source.unsplash.com/random/800x600/?ai,future",
    categoryKey: "blog posts.category technology",
    authorKey: "blog posts.author procodecg",
    tagsKeys: ["blog posts.tag ai", "blog posts.tag innovation"],
    contentKey: "blog posts.post2 content",
  },
  {
    id: "3",
    titleKey: "blog posts.post3 title",
    excerptKey: "blog posts.post3 excerpt",
    date: "2024-05-01",
    image: "https://source.unsplash.com/random/800x600/?kids,coding",
    categoryKey: "blog posts.category education",
    authorKey: "blog posts.author procodecg",
    tagsKeys: ["blog posts.tag kids", "blog posts.tag learning"],
    contentKey: "blog posts.post3 content",
  },
  {
    id: "4",
    titleKey: "blog posts.post4 title",
    excerptKey: "blog posts.post4 excerpt",
    date: "2024-04-25",
    image: "https://source.unsplash.com/random/800x600/?data,science",
    categoryKey: "blog posts.category data science",
    authorKey: "blog posts.author procodecg",
    tagsKeys: ["blog posts.tag data", "blog posts.tag analytics"],
    contentKey: "blog posts.post4 content",
  },
  {
    id: "5",
    titleKey: "blog posts.post5 title",
    excerptKey: "blog posts.post5 excerpt",
    date: "2024-04-20",
    image: "https://source.unsplash.com/random/800x600/?cybersecurity,network",
    categoryKey: "blog posts.category cybersecurity",
    authorKey: "blog posts.author procodecg",
    tagsKeys: ["blog posts.tag security", "blog posts.tag network"],
    contentKey: "blog posts.post5 content",
  },
  {
    id: "6",
    titleKey: "blog posts.post6 title",
    excerptKey: "blog posts.post6 excerpt",
    date: "2024-04-15",
    image: "https://source.unsplash.com/random/800x600/?mobile,app",
    categoryKey: "blog posts.category mobile development",
    authorKey: "blog posts.author procodecg",
    tagsKeys: ["blog posts.tag mobile", "blog posts.tag android", "blog posts.tag ios"],
    contentKey: "blog posts.post6 content",
  },
  {
    id: "7",
    titleKey: "blog posts.post7 title",
    excerptKey: "blog posts.post7 excerpt",
    date: "2024-04-10",
    image: "https://source.unsplash.com/random/800x600/?cloud,computing",
    categoryKey: "blog posts.category cloud computing",
    authorKey: "blog posts.author procodecg",
    tagsKeys: ["blog posts.tag cloud", "blog posts.tag aws", "blog posts.tag azure"],
    contentKey: "blog posts.post7 content",
  },
];

export const dummyArchivePosts: BlogPost[] = [
  {
    id: "a1",
    titleKey: "archives.archive1 title",
    excerptKey: "archives.archive1 excerpt",
    date: "2023-12-01",
    image: "https://source.unsplash.com/random/800x600/?old,document",
    categoryKey: "archives.category history",
    authorKey: "archives.author procodecg",
    tagsKeys: ["archives.tag old", "archives.tag classic"],
    contentKey: "archives.archive1 content",
    pdfLink: "https://www.africau.edu/images/default/sample.pdf", // Contoh link PDF
  },
  {
    id: "a2",
    titleKey: "archives.archive2 title",
    excerptKey: "archives.archive2 excerpt",
    date: "2023-11-15",
    image: "https://source.unsplash.com/random/800x600/?vintage,tech",
    categoryKey: "archives.category retro tech",
    authorKey: "archives.author procodecg",
    tagsKeys: ["archives.tag retro", "archives.tag tech history"],
    contentKey: "archives.archive2 content",
    pdfLink: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", // Contoh link PDF
  },
  {
    id: "a3",
    titleKey: "archives.archive3 title",
    excerptKey: "archives.archive3 excerpt",
    date: "2023-10-20",
    image: "https://source.unsplash.com/random/800x600/?ancient,code",
    categoryKey: "archives.category programming history",
    authorKey: "archives.author procodecg",
    tagsKeys: ["archives.tag history", "archives.tag programming"],
    contentKey: "archives.archive3 content",
    pdfLink: "https://www.africau.edu/images/default/sample.pdf", // Contoh link PDF
  },
];