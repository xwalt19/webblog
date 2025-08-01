import React from "react";
import { Code, Gamepad, Smartphone } from "lucide-react"; // Removed CalendarDays

export interface TrainingProgram {
  id: string;
  titleKey: string;
  dates: string;
  descriptionKey: string;
  icon: React.ElementType;
}

export const dummyTrainingPrograms: TrainingProgram[] = [
  {
    id: "1",
    titleKey: "game development training title",
    dates: "10 - 12 Des 2025",
    descriptionKey: "game development training description",
    icon: Gamepad,
  },
  {
    id: "2",
    titleKey: "mobile app development training title",
    dates: "18 Maret 2025",
    descriptionKey: "mobile app development training description",
    icon: Smartphone,
  },
  {
    id: "3",
    titleKey: "web development training title",
    dates: "7 April 2025",
    descriptionKey: "web development training description",
    icon: Code,
  },
];