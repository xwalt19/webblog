import { useTranslation } from "react-i18next";

export const useTranslatedTag = () => {
  const { t } = useTranslation();

  const getTranslatedTag = (tagKey: string) => {
    // Remove 'archives.tag ' prefix if it exists
    const cleanedTagKey = tagKey.startsWith('archives.tag ') ? tagKey.substring('archives.tag '.length) : tagKey;
    // Translate the cleaned tag key
    return t(cleanedTagKey);
  };

  return { getTranslatedTag };
};

// This function is for processing tags before saving to DB or for generating filter options
export const cleanTagForStorage = (tag: string) => {
  return tag.startsWith('archives.tag ') ? tag.substring('archives.tag '.length) : tag;
};