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
    titleKey: "fixed items.f1 title",
    descriptionKey: "fixed items.f1 desc",
    dateTime: "2024-04-01T09:00:00",
  },
  {
    id: "f2",
    type: "news",
    titleKey: "fixed items.f2 title",
    descriptionKey: "fixed items.f2 desc",
    dateTime: "2024-03-10T00:00:00",
  },
  {
    id: "f3",
    type: "schedule",
    titleKey: "fixed items.f3 title",
    descriptionKey: "fixed items.f3 desc",
    dateTime: "2024-04-20T14:00:00",
  },
  {
    id: "f4",
    type: "news",
    titleKey: "fixed items.f4 title",
    descriptionKey: "fixed items.f4 desc",
    dateTime: "2024-04-01T00:00:00",
  },
];