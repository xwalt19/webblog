"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

interface UploadHeroImageDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (file: File) => Promise<void>;
  MAX_IMAGE_SIZE_BYTES: number;
}

const UploadHeroImageDialog: React.FC<UploadHeroImageDialogProps> = ({
  isOpen,
  onOpenChange,
  onSave,
  MAX_IMAGE_SIZE_BYTES,
}) => {
  const { t } = useTranslation();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setImageFile(null); // Reset file input when dialog closes
      setUploading(false);
    }
  }, [isOpen]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (file.size > MAX_IMAGE_SIZE_BYTES) {
        toast.error(t('file size too large', { max: '5MB' }));
        event.target.value = ''; // Clear the input
        setImageFile(null);
        return;
      }
      setImageFile(file);
    } else {
      setImageFile(null);
    }
  };

  const handleSubmit = async () => {
    if (!imageFile) {
      toast.error(t("no image selected"));
      return;
    }

    setUploading(true);
    try {
      await onSave(imageFile);
      onOpenChange(false); // Close dialog on success
    } catch (error) {
      // Error handled by onSave in parent, just ensure loading state is reset
      console.error("Error in UploadHeroImageDialog handleSubmit:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('add new hero image')}</DialogTitle>
          <DialogDescription>
            {t('add new hero image description')}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="image-upload" className="text-right">
              {t('image file label')}
            </Label>
            <Input
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="col-span-3"
            />
          </div>
          {imageFile && (
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="col-span-1"></span>
              <p className="col-span-3 text-sm text-muted-foreground">
                {t('selected file')}: {imageFile.name}
              </p>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={uploading}>
            {t('cancel button')}
          </Button>
          <Button onClick={handleSubmit} disabled={uploading || !imageFile}>
            {uploading ? t('uploading status') : t('upload button')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UploadHeroImageDialog;