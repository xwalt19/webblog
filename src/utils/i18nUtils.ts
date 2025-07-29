import { useTranslation } from "react-i18next";

export const useTranslatedTag = () => {
  const { t } = useTranslation();

  const getTranslatedTag = (tagKey: string) => {
    // Remove known prefixes if they exist
    let cleanedTagKey = tagKey;
    if (cleanedTagKey.startsWith('archives.tag ')) {
      cleanedTagKey = cleanedTagKey.substring('archives.tag '.length);
    } else if (cleanedTagKey.startsWith('blog posts.tag ')) {
      cleanedTagKey = cleanedTagKey.substring('blog posts.tag '.length);
    }
    // Translate the cleaned tag key
    return t(cleanedTagKey);
  };

  return { getTranslatedTag };
};

// This function is for processing tags before saving to DB or for generating filter options
export const cleanTagForStorage = (tag: string) => {
  let cleanedTag = tag;
  if (cleanedTag.startsWith('archives.tag ')) {
    cleanedTag = cleanedTag.substring('archives.tag '.length);
  } else if (cleanedTag.startsWith('blog posts.tag ')) {
    cleanedTag = cleanedTag.substring('blog posts.tag '.length);
  }
  return cleanedTag;
};