import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, Users, GraduationCap } from "lucide-react";
import { useTranslation } from "react-i18next"; // Import useTranslation

const WhyProCodeCG: React.FC = () => {
  const { t } = useTranslation(); // Initialize useTranslation

  return (
    <section className="py-12 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">{t('why procodecg title')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="text-center p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="pb-4">
              <GraduationCap className="mx-auto mb-4 text-primary" size={48} />
              <CardTitle className="text-xl mb-2">{t('relevant curriculum')}</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground p-0">
              {t('relevant curriculum desc')}
            </CardContent>
          </Card>
          <Card className="text-center p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <Lightbulb className="mx-auto mb-4 text-yellow-500" size={48} />
            <CardTitle className="text-xl mb-2">{t('fun learning')}</CardTitle>
            <CardContent className="text-muted-foreground p-0">
              {t('fun learning desc')}
            </CardContent>
          </Card>
          <Card className="text-center p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <Users className="mx-auto mb-4 text-blue-500" size={48} />
            <CardTitle className="text-xl mb-2">{t('active community')}</CardTitle>
            <CardContent className="text-muted-foreground p-0">
              {t('active community desc')}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default WhyProCodeCG;