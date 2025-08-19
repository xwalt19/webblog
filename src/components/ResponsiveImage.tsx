"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface ResponsiveImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string; // Class for the div wrapper
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down'; // New prop for object-fit
}

const ResponsiveImage: React.FC<ResponsiveImageProps> = ({
  src,
  alt,
  className,
  containerClassName,
  objectFit = 'cover', // Default to cover
  ...props
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  const objectFitClass = `object-${objectFit}`;

  return (
    <div className={cn("relative overflow-hidden", containerClassName)}>
      {!imageLoaded && (
        <Skeleton className="absolute inset-0 w-full h-full bg-muted" />
      )}
      <img
        src={src}
        alt={alt}
        className={cn(
          "w-full h-full transition-opacity duration-300",
          objectFitClass, // Apply object-fit class
          imageLoaded ? "opacity-100" : "opacity-0",
          className
        )}
        onLoad={() => setImageLoaded(true)}
        onError={(e) => {
          setImageLoaded(true); // Still set to true to hide skeleton even if image fails
          console.error("Failed to load image:", e.currentTarget.src);
        }}
        loading="lazy" // Enable lazy loading
        {...props}
      />
    </div>
  );
};

export default ResponsiveImage;