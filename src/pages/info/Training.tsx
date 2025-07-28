import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CalendarDays, Code, Gamepad, Smartphone } from "lucide-react";
import { useTranslation } from "react-i18next";
import { dummyTrainingPrograms, TrainingProgram } from "@/data/trainingPrograms";

const Training: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto py-10 px-4">
      <section className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary">{t('training program title')}</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          {t('training program subtitle')}
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
          <Button>{t('back to home')}</Button>
        </Link>
      </div>
    </div>
  );
};

export default Training;