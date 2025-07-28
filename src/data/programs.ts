import React from "react";
import { BookOpen, Gamepad, Globe, Smartphone, Lock, Cpu, Code, Users, GraduationCap, DollarSign, CalendarDays } from "lucide-react";

export interface PriceTier {
  participantsKey: string;
  price: string;
}

export interface Program {
  id: string;
  titleKey: string;
  descriptionKey: string;
  scheduleKey?: string;
  registrationFee?: string;
  price?: string;
  priceTable?: {
    headerKeys: string[];
    rows: PriceTier[];
  }[];
  topics?: { icon: React.ElementType; titleKey: string; descriptionKey: string }[];
  icon?: React.ElementType;
  type: "kids" | "private" | "professional";
}

export const programs: Program[] = [
  {
    id: "kids-regular-coding-class",
    titleKey: "programs data.kids regular coding class title",
    descriptionKey: "programs data.kids regular coding class desc",
    scheduleKey: "programs data.kids regular coding class schedule",
    registrationFee: "Rp50.000,-",
    icon: Code,
    type: "kids",
    priceTable: [
      {
        headerKeys: ["programs data.kids regular coding class price header1 col1", "programs data.kids regular coding class price header1 col2"],
        rows: [
          { participantsKey: "programs data.kids regular coding class price row1 col1", price: "Rp200.000" },
          { participantsKey: "programs data.kids regular coding class price row2 col1", price: "Rp180.000" },
          { participantsKey: "programs data.kids regular coding class price row3 col1", price: "Rp160.000" },
          { participantsKey: "programs data.kids regular coding class price row4 col1", price: "Rp150.000" },
        ],
      },
      {
        headerKeys: ["programs data.kids regular coding class price header2 col1", "programs data.kids regular coding class price header2 col2"],
        rows: [
          { participantsKey: "programs data.kids regular coding class price row1 col1", price: "Rp325.000" },
          { participantsKey: "programs data.kids regular coding class price row2 col1", price: "Rp305.000" },
          { participantsKey: "programs data.kids regular coding class price row3 col1", price: "Rp285.000" },
          { participantsKey: "programs data.kids regular coding class price row4 col1", price: "Rp275.000" },
        ],
      },
    ],
  },
  {
    id: "kids-weekday-coding-class",
    titleKey: "programs data.kids weekday coding class title",
    descriptionKey: "programs data.kids weekday coding class desc",
    scheduleKey: "programs data.kids weekday coding class schedule",
    registrationFee: "Rp50.000,-",
    icon: CalendarDays,
    type: "kids",
    priceTable: [
      {
        headerKeys: ["programs data.kids weekday coding class price header1 col1", "programs data.kids weekday coding class price header1 col2"],
        rows: [
          { participantsKey: "programs data.kids weekday coding class price row1 col1", price: "Rp200.000" },
          { participantsKey: "programs data.kids weekday coding class price row2 col1", price: "Rp180.000" },
          { participantsKey: "programs data.kids weekday coding class price row3 col1", price: "Rp160.000" },
          { participantsKey: "programs data.kids weekday coding class price row4 col1", price: "Rp150.000" },
        ],
      },
    ],
  },
  {
    id: "kids-coding-camp",
    titleKey: "programs data.kids coding camp title",
    descriptionKey: "programs data.kids coding camp desc",
    price: "Rp950.000 - Rp2.000.000",
    icon: GraduationCap,
    type: "kids",
  },
  {
    id: "online-private-class",
    titleKey: "programs data.online private class title",
    descriptionKey: "programs data.online private class desc",
    price: "Rp500.000 per jam",
    icon: Users,
    type: "private",
  },
  {
    id: "tutoring-coding-class",
    titleKey: "programs data.tutoring coding class title",
    descriptionKey: "programs data.tutoring coding class desc",
    scheduleKey: "programs data.tutoring coding class schedule",
    icon: BookOpen,
    type: "private",
    priceTable: [
      {
        headerKeys: ["programs data.tutoring coding class price header1 col1", "programs data.tutoring coding class price header1 col2"],
        rows: [
          { participantsKey: "programs data.tutoring coding class price row1 col1", price: "Rp250.000" },
          { participantsKey: "programs data.tutoring coding class price row2 col1", price: "Rp230.000" },
          { participantsKey: "programs data.tutoring coding class price row3 col1", price: "Rp210.000" },
          { participantsKey: "programs data.tutoring coding class price row4 col1", price: "Rp190.000" },
          { participantsKey: "programs data.tutoring coding class price row5 col1", price: "Rp170.000" },
        ],
      },
    ],
  },
  {
    id: "crash-course-customized-training",
    titleKey: "programs data.crash course customized training title",
    descriptionKey: "programs data.crash course customized training desc",
    price: "Mulai dari Rp1.000.000",
    icon: Cpu,
    type: "professional",
  },
  {
    id: "coding-mom",
    titleKey: "programs data.coding mom title",
    descriptionKey: "programs data.coding mom desc",
    icon: Smartphone,
    type: "professional",
    topics: [
      { icon: BookOpen, titleKey: "regular events classes data.topic1 title", descriptionKey: "regular events classes data.topic1 desc" },
      { icon: Gamepad, titleKey: "regular events classes data.topic2 title", descriptionKey: "regular events classes data.topic2 desc" },
      { icon: Globe, titleKey: "regular events classes data.topic3 title", descriptionKey: "regular events classes data.topic3 desc" },
      { icon: Smartphone, titleKey: "regular events classes data.topic4 title", descriptionKey: "regular events classes data.topic4 desc" },
      { icon: Lock, titleKey: "regular events classes data.topic5 title", descriptionKey: "regular events classes data.topic5 desc" },
      { icon: Cpu, titleKey: "regular events classes data.topic6 title", descriptionKey: "regular events classes data.topic6 desc" },
    ],
  },
];

export interface Topic {
  icon: React.ElementType;
  titleKey: string;
  descriptionKey: string;
}

export interface RunningClass {
  nameKey: string;
  scheduleKey: string;
  descriptionKey: string;
  icon: React.ElementType;
}

export interface RegularEvent {
  nameKey: string;
  scheduleKey: string;
  descriptionKey: string;
  icon: React.ElementType;
}

export const topics: Topic[] = [
  {
    icon: BookOpen,
    titleKey: "regular events classes data.topic1 title",
    descriptionKey: "regular events classes data.topic1 desc",
  },
  {
    icon: Gamepad,
    titleKey: "regular events classes data.topic2 title",
    descriptionKey: "regular events classes data.topic2 desc",
  },
  {
    icon: Globe,
    titleKey: "regular events classes data.topic3 title",
    descriptionKey: "regular events classes data.topic3 desc",
  },
  {
    icon: Smartphone,
    titleKey: "regular events classes data.topic4 title",
    descriptionKey: "regular events classes data.topic4 desc",
  },
  {
    icon: Lock,
    titleKey: "regular events classes data.topic5 title",
    descriptionKey: "regular events classes data.topic5 desc",
  },
  {
    icon: Cpu,
    titleKey: "regular events classes data.topic6 title",
    descriptionKey: "regular events classes data.topic6 desc",
  },
];

export const runningClasses: RunningClass[] = [
  {
    nameKey: "regular events classes data.class1 name",
    scheduleKey: "regular events classes data.class1 schedule",
    descriptionKey: "regular events classes data.class1 desc",
    icon: Code,
  },
];

export const regularEvents: RegularEvent[] = [
  {
    nameKey: "regular events classes data.event1 name",
    scheduleKey: "regular events classes data.event1 schedule",
    descriptionKey: "regular events classes data.event1 desc",
    icon: Users,
  },
];