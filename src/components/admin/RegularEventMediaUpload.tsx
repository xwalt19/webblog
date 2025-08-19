"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import ResponsiveImage from "@/components/ResponsiveImage";

interface RegularEventMediaUploadProps {
  bannerImageFile: File | null;
  setBannerImageFile: (file: File | null) => void;
  initialBannerImageUrl: string | null;
  MAX_BANNER_IMAGE_SIZE_BYTES: number;
}

const RegularEventMediaUpload: React.FC<RegularEventMediaUploadProps> = ({
  bannerImageFile,
  setBannerImageFile,
  initialBannerImageUrl,
  MAX_BANNER_IMAGE_SIZE_BYTES,
}) => {
  const { t } = useTranslation();

  const handleBannerImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (file.size > MAX_BANNER_IMAGE_SIZE_BYTES) {
        toast.error(t('file size too large', { max: '5MB' }));
        event.target.value = ''; // Clear the input
        setBannerImageFile(null);
        return;
      }
      setBannerImageFile(file);
    } else {
      setBannerImageFile(null);
    }
  };

  return (
    <div>
      <Label htmlFor="banner-image-upload">{t('banner image label')}</Label>
      <Input
        id="banner-image-upload"
        type="file"
        accept="image/*"
        onChange={handleBannerImageChange}
        className="mt-1"
      />
      {bannerImageFile ? (
        <p className="text-sm text-muted-foreground mt-2">
          {t('selected image')}: {bannerImageFile.name}
        </p>
      ) : initialBannerImageUrl && (
        <div className="mt-2">
          <ResponsiveImage 
            src={initialBannerImageUrl} 
            alt={t('current banner image')} 
            containerClassName="w-32 h-20 rounded-md" 
            className="object-cover" 
          />
          <p className="text-sm text-muted-foreground mt-1">
            {t('current image')}: <a href={initialBannerImageUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{initialBannerImageUrl.split('/').pop()}</a>
          </p>
        </div>
      )}
    </div>
  );
};

export default RegularEventMediaUpload;