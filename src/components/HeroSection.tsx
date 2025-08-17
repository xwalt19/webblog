import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import HeroImageCarousel from "./HeroImageCarousel"; // Import the new carousel component

const HeroSection: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section
      className="relative py-24 md:py-36 text-white overflow-hidden" // Removed bg-cover and bg-center, added overflow-hidden
    >
      <HeroImageCarousel /> {/* Use the new carousel component here */}
      <div className="absolute inset-0 bg-black opacity-60"></div>
      <div className="container mx-auto relative z-10 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
          {t('hero section title')}
        </h1>
        <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto">
          {t('hero section subtitle')}
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/blog">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg">
              {t('visit blog button')}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;