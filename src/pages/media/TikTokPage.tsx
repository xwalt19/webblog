import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import TikTokUpdates from "@/components/TikTokUpdates";
import { useTranslation } from "react-i18next";

const TikTokPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto py-10 px-4">
      <section className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary">{t('tiktok page title')}</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          {t('tiktok page subtitle')}
        </p>
      </section>

      <TikTokUpdates />

      <div className="text-center mt-12">
        <Link to="/">
          <Button>{t('return to home')}</Button>
        </Link>
      </div>
    </div>
  );
};

export default TikTokPage;