import { format } from "date-fns";
import i18n from "i18next"; // Import i18n instance directly

export const formatDisplayDate = (isoString: string | null | undefined): string => {
  if (!isoString) return '-';
  const dateObj = new Date(isoString);
  if (isNaN(dateObj.getTime())) {
    return i18n.t('invalid date'); // Menggunakan i18n instance untuk terjemahan
  }
  return dateObj.toLocaleDateString(i18n.language, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const formatDisplayDateTime = (isoString: string | null | undefined): string => {
  if (!isoString) return '-';
  const dateObj = new Date(isoString);
  if (isNaN(dateObj.getTime())) {
    return i18n.t('invalid date');
  }
  return dateObj.toLocaleDateString(i18n.language, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
};