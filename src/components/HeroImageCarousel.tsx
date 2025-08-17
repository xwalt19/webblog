"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface HeroImage {
  id: string;
  image_url: string;
  order_index: number;
}

const HeroImageCarousel: React.FC = () => {
  const [images, setImages] = useState<HeroImage[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageLoaded, setImageLoaded] = useState<boolean[]>([]);

  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase
          .from('hero_images')
          .select('*')
          .order('order_index', { ascending: true });

        if (error) throw error;
        setImages(data || []);
        setImageLoaded(new Array(data?.length || 0).fill(false));
      } catch (err: any) {
        console.error("Error fetching hero images:", err);
        setError("Failed to load hero images.");
      } finally {
        setLoading(false);
      }
    };

    fetchImages();

    const channel = supabase
      .channel('hero_images_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'hero_images' },
        () => {
          fetchImages(); // Re-fetch images on any change
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    if (images.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, 7000); // Change image every 7 seconds
      return () => clearInterval(interval);
    }
  }, [images]);

  const handleImageLoad = (index: number) => {
    setImageLoaded(prev => {
      const newState = [...prev];
      newState[index] = true;
      return newState;
    });
  };

  if (loading) {
    return (
      <div className="absolute inset-0 bg-gray-300 flex items-center justify-center">
        <Skeleton className="w-full h-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="absolute inset-0 bg-red-100 text-red-700 flex items-center justify-center p-4">
        <p>{error}</p>
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="absolute inset-0 bg-gray-600 flex items-center justify-center">
        {/* Fallback if no images are uploaded */}
        <p className="text-white text-lg">{/*t('no hero images available')*/}</p>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 overflow-hidden">
      {images.map((image, index) => (
        <div
          key={image.id}
          className={cn(
            "absolute inset-0 transition-opacity duration-1000 ease-in-out",
            index === currentIndex ? "opacity-100" : "opacity-0"
          )}
        >
          {!imageLoaded[index] && (
            <Skeleton className="absolute inset-0 w-full h-full bg-muted" />
          )}
          <img
            src={image.image_url}
            alt={`Hero Image ${index + 1}`}
            className={cn(
              "w-full h-full object-cover transition-opacity duration-300",
              imageLoaded[index] ? "opacity-100" : "opacity-0"
            )}
            onLoad={() => handleImageLoad(index)}
            onError={(e) => {
              handleImageLoad(index); // Still hide skeleton even if image fails
              console.error("Failed to load hero image:", e.currentTarget.src);
            }}
            loading="eager" // Eager load for hero section
          />
        </div>
      ))}
    </div>
  );
};

export default HeroImageCarousel;