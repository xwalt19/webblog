import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import YouTubeUpdates from "@/components/YouTubeUpdates";
import { useTranslation } from "react-i18next";

const YouTubePage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto py-10 px-4">
      <section className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary">{t('youtube page title')}</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          {t('youtube page subtitle')}
        </p>
      </section>

      <YouTubeUpdates />

      <div className="text-center mt-12">
        <Link to="/">
          <Button>{t('return to home')}</Button>
        </Link>
      </div>
    </div>
  );
};

export default YouTubePage;