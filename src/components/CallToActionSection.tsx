import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslation } from "react-i18next"; // Import useTranslation

const CallToActionSection: React.FC = () => {
  const { t } = useTranslation(); // Initialize useTranslation

  return (
    <section className="py-16 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 text-center">
        <Card className="bg-card text-card-foreground p-8 md:p-12 shadow-xl rounded-lg max-w-4xl mx-auto">
          <CardContent className="p-0">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t('call_to_action_title')}
            </h2>
            <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
              {t('call_to_action_subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/blog">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg">
                  {t('visit_blog')}
                </Button>
              </Link>
              <Link to="/archives">
                <Button size="lg" variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50 hover:text-blue-700 px-8 py-6 text-lg">
                  {t('view_archives')}
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default CallToActionSection;