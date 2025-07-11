import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CalendarDays, Code, Gamepad, Smartphone } from "lucide-react";
import { useTranslation } from "react-i18next";

interface TrainingProgram {
  id: string;
  titleKey: string;
  dates: string;
  descriptionKey: string;
  icon: React.ElementType;
}

const dummyTrainingPrograms: TrainingProgram[] = [
  {
    id: "1",
    titleKey: "training_data.training1_title",
    dates: "10 - 12 Des 2014",
    descriptionKey: "training_data.training1_desc",
    icon: Gamepad,
  },
  {
    id: "2",
    titleKey: "training_data.training2_title",
    dates: "18 Maret 2015",
    descriptionKey: "training_data.training2_desc",
    icon: Smartphone,
  },
  {
    id: "3",
    titleKey: "training_data.training3_title",
    dates: "7 April 2015",
    descriptionKey: "training_data.training3_desc",
    icon: Code,
  },
];

const Training: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto py-10 px-4">
      <section className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary">{t('training_program_title')}</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          {t('training_program_subtitle')}
        </p>
      </section>

      <section className="mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dummyTrainingPrograms.map((program) => (
            <Card key={program.id} className="flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3 mb-2">
                  <program.icon className="text-primary" size={28} />
                  <CardTitle className="text-xl font-semibold">{t(program.titleKey)}</CardTitle>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CalendarDays size={16} />
                  <span>{program.dates}</span>
                </div>
              </CardHeader>
              <CardContent className="flex-grow p-6 pt-0">
                <CardDescription className="mb-4 text-muted-foreground">
                  {t(program.descriptionKey)}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <div className="text-center mt-12">
        <Link to="/">
          <Button>{t('back_to_home')}</Button>
        </Link>
      </div>
    </div>
  );
};

export default Training;