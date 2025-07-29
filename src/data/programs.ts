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
    titleKey: "kids regular coding class title",
    descriptionKey: "kids regular coding class description",
    scheduleKey: "kids regular coding class schedule",
    registrationFee: "Rp50.000,-",
    icon: Code,
    type: "kids",
    priceTable: [
      {
        headerKeys: ["kids regular coding class price header1 col1", "kids regular coding class price header1 col2"],
        rows: [
          { participantsKey: "kids regular coding class price row1 col1", price: "Rp200.000" },
          { participantsKey: "kids regular coding class price row2 col1", price: "Rp180.000" },
          { participantsKey: "kids regular coding class price row3 col1", price: "Rp160.000" },
          { participantsKey: "kids regular coding class price row4 col1", price: "Rp150.000" },
        ],
      },
      {
        headerKeys: ["kids regular coding class price header2 col1", "kids regular coding class price header2 col2"],
        rows: [
          { participantsKey: "kids regular coding class price row1 col1 2", price: "Rp325.000" },
          { participantsKey: "kids regular coding class price row2 col1 2", price: "Rp305.000" },
          { participantsKey: "kids regular coding class price row3 col1 2", price: "Rp285.000" },
          { participantsKey: "kids regular coding class price row4 col1 2", price: "Rp275.000" },
        ],
      },
    ],
  },
  {
    id: "kids-weekday-coding-class",
    titleKey: "kids weekday coding class title",
    descriptionKey: "kids weekday coding class description",
    scheduleKey: "kids weekday coding class schedule",
    registrationFee: "Rp50.000,-",
    icon: CalendarDays,
    type: "kids",
    priceTable: [
      {
        headerKeys: ["kids weekday coding class price header1 col1", "kids weekday coding class price header1 col2"],
        rows: [
          { participantsKey: "kids weekday coding class price row1 col1", price: "Rp200.000" },
          { participantsKey: "kids weekday coding class price row2 col1", price: "Rp180.000" },
          { participantsKey: "kids weekday coding class price row3 col1", price: "Rp160.000" },
          { participantsKey: "kids weekday coding class price row4 col1", price: "Rp150.000" },
        ],
      },
    ],
  },
  {
    id: "kids-coding-camp",
    titleKey: "kids coding camp title",
    descriptionKey: "kids coding camp description",
    price: "Rp950.000 - Rp2.000.000",
    icon: GraduationCap,
    type: "kids",
  },
  {
    id: "online-private-class",
    titleKey: "online private class title",
    descriptionKey: "online private class description",
    price: "Rp500.000 per jam",
    icon: Users,
    type: "private",
  },
  {
    id: "tutoring-coding-class",
    titleKey: "tutoring coding class title",
    descriptionKey: "tutoring coding class description",
    scheduleKey: "tutoring coding class schedule",
    icon: BookOpen,
    type: "private",
    priceTable: [
      {
        headerKeys: ["tutoring coding class price header1 col1", "tutoring coding class price header1 col2"],
        rows: [
          { participantsKey: "tutoring coding class price row1 col1", price: "Rp250.000" },
          { participantsKey: "tutoring coding class price row2 col1", price: "Rp230.000" },
          { participantsKey: "tutoring coding class price row3 col1", price: "Rp210.000" },
          { participantsKey: "tutoring coding class price row4 col1", price: "Rp190.000" },
          { participantsKey: "tutoring coding class price row5 col1", price: "Rp170.000" },
        ],
      },
    ],
  },
  {
    id: "crash-course-customized-training",
    titleKey: "crash course customized training title",
    descriptionKey: "crash course customized training description",
    price: "Mulai dari Rp1.000.000",
    icon: Cpu,
    type: "professional",
  },
  {
    id: "coding-mom",
    titleKey: "coding mom title",
    descriptionKey: "coding mom description",
    icon: Smartphone,
    type: "professional",
    topics: [
      { icon: BookOpen, titleKey: "topic 1 title", descriptionKey: "topic 1 description" },
      { icon: Gamepad, titleKey: "topic 2 title", descriptionKey: "topic 2 description" },
      { icon: Globe, titleKey: "topic 3 title", descriptionKey: "topic 3 description" },
      { icon: Smartphone, titleKey: "topic 4 title", descriptionKey: "topic 4 description" },
      { icon: Lock, titleKey: "topic 5 title", descriptionKey: "topic 5 description" },
      { icon: Cpu, titleKey: "topic 6 title", descriptionKey: "topic 6 description" },
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
    titleKey: "topic 1 title",
    descriptionKey: "topic 1 description",
  },
  {
    icon: Gamepad,
    titleKey: "topic 2 title",
    descriptionKey: "topic 2 description",
  },
  {
    icon: Globe,
    titleKey: "topic 3 title",
    descriptionKey: "topic 3 description",
  },
  {
    icon: Smartphone,
    titleKey: "topic 4 title",
    descriptionKey: "topic 4 description",
  },
  {
    icon: Lock,
    titleKey: "topic 5 title",
    descriptionKey: "topic 5 description",
  },
  {
    icon: Cpu,
    titleKey: "topic 6 title",
    descriptionKey: "topic 6 description",
  },
];

export const runningClasses: RunningClass[] = [
  {
    nameKey: "running class 1 name",
    scheduleKey: "running class 1 schedule",
    descriptionKey: "running class 1 description",
    icon: Code,
  },
];

export const regularEvents: RegularEvent[] = [
  {
    nameKey: "regular event 1 name",
    scheduleKey: "regular event 1 schedule",
    descriptionKey: "regular event 1 description",
    icon: Users,
  },
];