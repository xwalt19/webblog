import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Handshake, Building, Users } from "lucide-react"; // Keep imports for potential future use or if icons are still desired elsewhere
import { useTranslation } from "react-i18next";
import { dummyPartners, Partner } from "@/data/partners";
import ResponsiveImage from "@/components/ResponsiveImage"; // Import ResponsiveImage

const Partners: React.FC = () => {
  const { t } = useTranslation();

  // Removed getIconForPartnerType as we are now using images directly

  return (
    <div className="container mx-auto py-10 px-4">
      <section className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground capitalize">{t('our partners page title')}</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          {t('our partners page subtitle')}
        </p>
      </section>

      <section className="mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dummyPartners.map((partner) => (
            <Card key={partner.id} className="flex flex-col items-center text-center p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="mb-4">
                {/* Replaced icon with ResponsiveImage for logo */}
                <ResponsiveImage 
                  src={partner.logoUrl} 
                  alt={t(partner.nameKey)} 
                  containerClassName="w-32 h-32 flex items-center justify-center" // Container for centering/sizing
                  className="object-contain" // Ensure image fits within bounds
                />
              </div>
              <CardTitle className="text-xl mb-2">{t(partner.nameKey)}</CardTitle>
              <CardDescription className="text-muted-foreground">{t(partner.descriptionKey)}</CardDescription>
            </Card>
          ))}
        </div>
      </section>

      <div className="text-center mt-12">
        <Link to="/">
          <Button>{t('return to home')}</Button>
        </Link>
      </div>
    </div>
  );
};

export default Partners;