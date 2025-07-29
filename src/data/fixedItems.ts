export interface FixedItem {
  id: string;
  type: "news" | "schedule";
  titleKey: string;
  descriptionKey: string;
  dateTime: string;
}

export const dummyFixedItems: FixedItem[] = [
  {
    id: "f1",
    type: "schedule",
    titleKey: "beginner coding workshop title",
    descriptionKey: "beginner coding workshop description",
    dateTime: "2024-04-01T09:00:00",
  },
  {
    id: "f2",
    type: "news",
    titleKey: "new partnership tech innovators title",
    descriptionKey: "new partnership tech innovators description",
    dateTime: "2024-03-10T00:00:00",
  },
  {
    id: "f3",
    type: "schedule",
    titleKey: "advanced python class registration open title",
    descriptionKey: "advanced python class registration open description",
    dateTime: "2024-04-20T14:00:00",
  },
  {
    id: "f4",
    type: "news",
    titleKey: "procodecg featured magazine title",
    descriptionKey: "procodecg featured magazine description",
    dateTime: "2024-04-01T00:00:00",
  },
];