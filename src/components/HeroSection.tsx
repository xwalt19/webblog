"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import ResponsiveImage from "@/components/ResponsiveImage";
import { supabase } from "@/integrations/supabase/client"; // Import supabase client
import { useQuery } from "@tanstack/react-query"; // Import useQuery

interface HeroImage {
  id: string;
  image_url: string;
  order_index: number;
}

const HeroSection: React.FC = () => {
  const { t } = useTranslation();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Fetch hero images from Supabase
  const { data: heroImages, isLoading, isError, error } = useQuery<HeroImage[], Error>({
    queryKey: ['heroImages'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('hero_images')
        .select('id, image_url, order_index')
        .order('order_index', { ascending: true });
      if (error) throw error;
      return data || [];
    },
    staleTime: 5 * 60 * 1000, // Cache data for 5 minutes
    refetchOnWindowFocus: false, // Don't refetch on window focus
  });

  useEffect(() => {
    if (heroImages && heroImages.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
      }, 7000); // Ganti gambar setiap 7 detik
      return () => clearInterval(interval);
    }
  }, [heroImages]); // Re-run effect if heroImages changes

  // If loading or error, use a fallback or show a loading state
  if (isLoading) {
    return (
      <section className="relative py-24 md:py-36 text-white overflow-hidden h-[500px] md:h-[600px] flex items-center bg-gray-800 animate-pulse">
        <div className="container mx-auto relative z-20 text-left px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight max-w-3xl">
            {t('loading hero title')}
          </h1>
          <p className="text-lg md:text-xl mb-8 max-w-3xl">
            {t('loading hero subtitle')}
          </p>
        </div>
      </section>
    );
  }

  if (isError) {
    console.error("Failed to load hero images:", error);
    // Fallback to a static image or a message
    return (
      <section className="relative py-24 md:py-36 text-white overflow-hidden h-[500px] md:h-[600px] flex items-center bg-gray-800">
        <div className="absolute inset-0 bg-black opacity-60 z-10"></div>
        <div className="container mx-auto relative z-20 text-left px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight max-w-3xl">
            {t('hero section title fallback')}
          </h1>
          <p className="text-lg md:text-xl mb-8 max-w-3xl">
            {t('hero section subtitle fallback')}
          </p>
          <div className="flex flex-col sm:flex-row justify-start gap-4">
            <Link to="/blog">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg">
                {t('visit blog button')}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    );
  }

  // If no images are found in DB, use a default static image
  const imagesToDisplay = heroImages && heroImages.length > 0 ? heroImages : [{ id: 'default', image_url: "/assets/img_2860.jpg", order_index: 0 }];

  return (
    <section className="relative py-24 md:py-36 text-white overflow-hidden h-[500px] md:h-[600px] flex items-center">
      {imagesToDisplay.map((image, index) => (
        <div
          key={image.id}
          className={cn(
            "absolute inset-0 transition-opacity duration-1000 ease-in-out",
            index === currentImageIndex ? "opacity-100" : "opacity-0"
          )}
        >
          <ResponsiveImage
            src={image.image_url}
            alt={`Hero Image ${index + 1}`}
            containerClassName="w-full h-full"
            className="object-cover"
          />
        </div>
      ))}
      <div className="absolute inset-0 bg-black opacity-60 z-10"></div>
      <div className="container mx-auto relative z-20 text-left px-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight max-w-3xl">
          {t('hero section title')}
        </h1>
        <p className="text-lg md:text-xl mb-8 max-w-3xl">
          {t('hero section subtitle')}
        </p>
        <div className="flex flex-col sm:flex-row justify-start gap-4">
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