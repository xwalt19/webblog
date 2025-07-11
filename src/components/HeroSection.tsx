import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next"; // Import useTranslation

const HeroSection: React.FC = () => {
  const { t } = useTranslation(); // Initialize useTranslation

  return (
    <section
      className="relative bg-cover bg-center py-24 md:py-36 text-white"
      style={{ backgroundImage: "url('/images/hero-background.jpg')" }}
    >
      <div className="absolute inset-0 bg-black opacity-60"></div>
      <div className="container mx-auto relative z-10 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
          {t('hero_title')}
        </h1>
        <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto">
          {t('hero_subtitle')}
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/blog">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg">
              {t('visit_our_blog')}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;