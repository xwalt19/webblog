"use client";

import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useTranslation } from "react-i18next";
import { getYouTubeEmbedUrl } from "@/utils/youtube";

interface YouTubeVideoModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  videoUrl: string | null;
  title: string;
}

const YouTubeVideoModal: React.FC<YouTubeVideoModalProps> = ({ isOpen, onOpenChange, videoUrl, title }) => {
  const { t } = useTranslation();
  const embedUrl = videoUrl ? getYouTubeEmbedUrl(videoUrl) : null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-2xl font-bold">{title}</DialogTitle>
        </DialogHeader>
        <div className="relative w-full pt-[56.25%]"> {/* 16:9 Aspect Ratio */}
          {embedUrl ? (
            <iframe
              className="absolute top-0 left-0 w-full h-full rounded-b-lg"
              src={embedUrl}
              title={title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          ) : (
            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-muted text-muted-foreground">
              {t('invalid video url')}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default YouTubeVideoModal;