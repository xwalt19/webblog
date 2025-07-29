"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, PlusCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cleanTagForStorage, useTranslatedTag } from "@/utils/i18nUtils";

interface MultiSelectTagsProps {
  initialTags: string[];
  onTagsChange: (tags: string[]) => void;
  allAvailableTags: string[]; // All unique tags from DB
}

const MultiSelectTags: React.FC<MultiSelectTagsProps> = ({
  initialTags,
  onTagsChange,
  allAvailableTags,
}) => {
  const { t } = useTranslation();
  const { getTranslatedTag } = useTranslatedTag();
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [currentSelectValue, setCurrentSelectValue] = useState<string>("");

  useEffect(() => {
    // Ensure initialTags are cleaned before setting
    setSelectedTags(initialTags.map(cleanTagForStorage));
  }, [initialTags]);

  const handleAddTag = () => {
    if (currentSelectValue && !selectedTags.includes(currentSelectValue)) {
      const newTags = [...selectedTags, currentSelectValue];
      setSelectedTags(newTags);
      onTagsChange(newTags);
      setCurrentSelectValue(""); // Reset select
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const newTags = selectedTags.filter((tag) => tag !== tagToRemove);
    setSelectedTags(newTags);
    onTagsChange(newTags);
  };

  // Filter out tags already selected from the available options
  const filteredAvailableTags = allAvailableTags.filter(
    (tag) => !selectedTags.includes(tag)
  );

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Select value={currentSelectValue} onValueChange={setCurrentSelectValue}>
          <SelectTrigger className="flex-grow">
            <SelectValue placeholder={t('select tag placeholder')} />
          </SelectTrigger>
          <SelectContent>
            {filteredAvailableTags.length > 0 ? (
              filteredAvailableTags.map((tag) => (
                <SelectItem key={tag} value={tag}>
                  {getTranslatedTag(tag)}
                </SelectItem>
              ))
            ) : (
              <SelectItem value="" disabled>
                {t('no more tags available')}
              </SelectItem>
            )}
          </SelectContent>
        </Select>
        <Button type="button" onClick={handleAddTag} disabled={!currentSelectValue}>
          <PlusCircle className="h-4 w-4 mr-2" /> {t('add tag button')}
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {selectedTags.map((tag) => (
          <Badge key={tag} variant="secondary" className="flex items-center gap-1">
            {getTranslatedTag(tag)}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-4 w-4 p-0 ml-1"
              onClick={() => handleRemoveTag(tag)}
            >
              <X className="h-3 w-3" />
              <span className="sr-only">{t('remove tag')}</span>
            </Button>
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default MultiSelectTags;