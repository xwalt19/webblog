export interface Camp {
  id: string;
  titleKey: string;
  dates: string;
  descriptionKey: string;
  dayLinks: { label: string; url: string }[];
}

export const dummyCamps: Camp[] = [
  {
    id: "1",
    titleKey: "camp 1 title",
    dates: "29 – 30 Des 2025",
    descriptionKey: "camp 1 description",
    dayLinks: [
      { label: "Day 1", url: "#" },
      { label: "Day 2", url: "#" },
      { label: "Day 3", url: "#" }, 
    ],
  },
  {
    id: "2",
    titleKey: "camp 2 title",
    dates: "28 – 30 Juni 2025",
    descriptionKey: "camp 2 description",
    dayLinks: [
      { label: "Day 1", url: "#" },
      { label: "Day 2", url: "#" },
      { label: "Day 3", url: "#" },
    ],
  },
  {
    id: "3",
    titleKey: "camp 3 title",
    dates: "6 – 8 Juli 2025",
    descriptionKey: "camp 3 description",
    dayLinks: [
      { label: "Day 1", url: "#" },
      { label: "Day 2", url: "#" },
      { label: "Day 3", url: "#" },
    ],
  },
  {
    id: "4",
    titleKey: "camp 4 title",
    dates: "9 – 11 Juli 2025",
    descriptionKey: "camp 4 description",
    dayLinks: [
      { label: "Day 1", url: "#" },
      { label: "Day 2",
      url: "#" },
      { label: "Day 3", url: "#" },
    ],
  },
  {
    id: "5",
    titleKey: "camp 5 title",
    dates: "21 -23 Des 2025",
    descriptionKey: "camp 5 description",
    dayLinks: [
      { label: "Day 1", url: "#" },
      { label: "Day 2", url: "#" },
      { label: "Day 3", url: "#" },
    ],
  },
  {
    id: "6",
    titleKey: "camp 6 title",
    dates: "25 – 27 Des 2025",
    descriptionKey: "camp 6 description",
    dayLinks: [
      { label: "Day 1", url: "#" },
      { label: "Day 2", url: "#" },
      { label: "Day 3", url: "#" },
    ],
  },
  {
    id: "7",
    titleKey: "camp 7 title",
    dates: "28 – 30 Des 2025",
    descriptionKey: "camp 7 description",
    dayLinks: [
      { label: "Day 1", url: "#" },
      { label: "Day 2", url: "#" },
      { label: "Day 3", url: "#" },
    ],
  },
];