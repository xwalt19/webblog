"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface ResponsiveImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string; // Class for the div wrapper
}

const ResponsiveImage: React.FC<ResponsiveImageProps> = ({
  src,
  alt,
  className,
  containerClassName,
  ...props
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div className={cn("relative overflow-hidden", containerClassName)}>
      {!imageLoaded && (
        <Skeleton className="absolute inset-0 w-full h-full bg-muted" />
      )}
      <img
        src={src}
        alt={alt}
        className={cn(
          "w-full h-full object-cover transition-opacity duration-300",
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