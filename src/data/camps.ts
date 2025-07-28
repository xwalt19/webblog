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
    titleKey: "camps data.camp1 title",
    dates: "29 – 30 Des 2014",
    descriptionKey: "camps data.camp1 desc",
    dayLinks: [
      { label: "Day 1", url: "#" },
      { label: "Day 2", url: "#" },
      { label: "Day 3", url: "#" }, 
    ],
  },
  {
    id: "2",
    titleKey: "camps data.camp2 title",
    dates: "28 – 30 Juni 2015",
    descriptionKey: "camps data.camp2 desc",
    dayLinks: [
      { label: "Day 1", url: "#" },
      { label: "Day 2", url: "#" },
      { label: "Day 3", url: "#" },
    ],
  },
  {
    id: "3",
    titleKey: "camps data.camp3 title",
    dates: "6 – 8 Juli 2015",
    descriptionKey: "camps data.camp3 desc",
    dayLinks: [
      { label: "Day 1", url: "#" },
      { label: "Day 2", url: "#" },
      { label: "Day 3", url: "#" },
    ],
  },
  {
    id: "4",
    titleKey: "camps data.camp4 title",
    dates: "9 – 11 Juli 2015",
    descriptionKey: "camps data.camp4 desc",
    dayLinks: [
      { label: "Day 1", url: "#" },
      { label: "Day 2",
      url: "#" },
      { label: "Day 3", url: "#" },
    ],
  },
  {
    id: "5",
    titleKey: "camps data.camp5 title",
    dates: "21 -23 Des 2015",
    descriptionKey: "camps data.camp5 desc",
    dayLinks: [
      { label: "Day 1", url: "#" },
      { label: "Day 2", url: "#" },
      { label: "Day 3", url: "#" },
    ],
  },
  {
    id: "6",
    titleKey: "camps data.camp6 title",
    dates: "25 – 27 Des 2015",
    descriptionKey: "camps data.camp6 desc",
    dayLinks: [
      { label: "Day 1", url: "#" },
      { label: "Day 2", url: "#" },
      { label: "Day 3", url: "#" },
    ],
  },
  {
    id: "7",
    titleKey: "camps data.camp7 title",
    dates: "28 – 30 Des 2015",
    descriptionKey: "camps data.camp7 desc",
    dayLinks: [
      { label: "Day 1", url: "#" },
      { label: "Day 2", url: "#" },
      { label: "Day 3", url: "#" },
    ],
  },
];