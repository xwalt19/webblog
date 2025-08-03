"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import ResponsiveImage from "@/components/ResponsiveImage";

interface BlogPostMediaUploadProps {
  imageFile: File | null;
  setImageFile: (file: File | null) => void;
  pdfFile: File | null;
  setPdfFile: (file: File | null) => void;
  initialImageUrl: string | null;
  initialPdfLink: string | null;
  MAX_IMAGE_SIZE_BYTES: number;
  MAX_PDF_SIZE_BYTES: number;
}

const BlogPostMediaUpload: React.FC<BlogPostMediaUploadProps> = ({
  imageFile,
  setImageFile,
  pdfFile,
  setPdfFile,
  initialImageUrl,
  initialPdfLink,
  MAX_IMAGE_SIZE_BYTES,
  MAX_PDF_SIZE_BYTES,
}) => {
  const { t } = useTranslation();

  const handleImageFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (file.size > MAX_IMAGE_SIZE_BYTES) {
        toast.error(t('file size too large', { max: '10MB' }));
        event.target.value = ''; // Clear the input
        setImageFile(null);
        return;
      }
      setImageFile(file);
    } else {
      setImageFile(null);
    }
  };

  const handlePdfFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (file.size > MAX_PDF_SIZE_BYTES) {
        toast.error(t('file size too large', { max: '10MB' }));
        event.target.value = ''; // Clear the input
        setPdfFile(null);
        return;
      }
      setPdfFile(file);
    } else {
      setPdfFile(null);
    }
  };

  return (
    <>
      <div>
        <Label htmlFor="image-upload">{t('image label')}</Label>
        <Input
          id="image-upload"
          type="file"
          accept="image/*"
          onChange={handleImageFileChange}
          className="mt-1"
        />
        {imageFile ? (
          <p className="text-sm text-muted-foreground mt-2">
            {t('selected image')}: {imageFile.name}
          </p>
        ) : initialImageUrl && (
          <div className="mt-2">
            <ResponsiveImage 
              src={initialImageUrl} 
              alt={t('current image')} 
              containerClassName="w-32 h-20 rounded-md" 
              className="object-cover" 
            />
            <p className="text-sm text-muted-foreground mt-1">
              {t('current image')}: <a href={initialImageUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{initialImageUrl.split('/').pop()}</a>
            </p>
          </div>
        )}
      </div>
      <div>
        <Label htmlFor="pdf-upload">{t('pdf file label')}</Label>
        <Input
          id="pdf-upload"
          type="file"
          accept="application/pdf"
          onChange={handlePdfFileChange}
          className="mt-1"
        />
        {pdfFile ? (
          <p className="text-sm text-muted-foreground mt-2">
            {t('selected pdf')}: {pdfFile.name}
          </p>
        ) : initialPdfLink && (
          <p className="text-sm text-muted-foreground mt-2">
            {t('current pdf')}: <a href={initialPdfLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{initialPdfLink.split('/').pop()}</a>
          </p>
        )}
      </div>
    </>
  );
};

export default BlogPostMediaUpload;