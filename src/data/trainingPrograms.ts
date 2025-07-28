import React from "react";
import { CalendarDays, Code, Gamepad, Smartphone } from "lucide-react";

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
    titleKey: "training data.training1 title",
    dates: "10 - 12 Des 2014",
    descriptionKey: "training data.training1 desc",
    icon: Gamepad,
  },
  {
    id: "2",
    titleKey: "training data.training2 title",
    dates: "18 Maret 2015",
    descriptionKey: "training data.training2 desc",
    icon: Smartphone,
  },
  {
    id: "3",
    titleKey: "training data.training3 title",
    dates: "7 April 2015",
    descriptionKey: "training data.training3 desc",
    icon: Code,
  },
];