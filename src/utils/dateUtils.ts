import { format, isValid, parse, parseISO } from "date-fns";
import { id as idLocale } from "date-fns/locale"; // Import Indonesian locale as idLocale
import i18n from "i18next"; // Import i18n instance directly

export const formatDisplayDate = (isoString: string | null | undefined): string => {
  if (!isoString) return '-';
  const dateObj = new Date(isoString);
  if (isNaN(dateObj.getTime())) {
    return i18n.t('invalid date');
  }
  return format(dateObj, 'PPP', { locale: idLocale }); // Use idLocale here
};

export const formatDisplayDateTime = (isoString: string | null | undefined): string => {
  if (!isoString) return '-';
  const dateObj = new Date(isoString);
  if (isNaN(dateObj.getTime())) {
    return i18n.t('invalid date');
  }
  return format(dateObj, 'PPP HH:mm', { locale: idLocale }); // Use idLocale here
};

export const formatDateRangeWithTime = (
  startDate: Date | undefined,
  endDate: Date | undefined,
  startTime: string | undefined,
  endTime: string | undefined,
): string => {
  if (!startDate || !isValid(startDate)) return '';

  const startPart = format(startDate, 'EEEE, dd MMMM yyyy', { locale: idLocale }); // Use idLocale
  let dateRangePart = startPart;

  if (endDate && isValid(endDate) && endDate.getTime() !== startDate.getTime()) {
    const endPart = format(endDate, 'EEEE, dd MMMM yyyy', { locale: idLocale }); // Use idLocale
    dateRangePart = `${startPart} - ${endPart}`;
  }

  let timePart = '';
  if (startTime && endTime) {
    timePart = ` (Pukul ${startTime} - ${endTime} WIB)`;
  } else if (startTime) {
    timePart = ` (Pukul ${startTime} WIB)`;
  } else if (endTime) {
    timePart = ` (Sampai Pukul ${endTime} WIB)`;
  }

  return `${dateRangePart}${timePart}`;
};

export const parseDateRangeString = (
  dateString: string | null | undefined
): { startDate?: Date; endDate?: Date; startTime?: string; endTime?: string } => {
  if (!dateString) return {};

  const result: { startDate?: Date; endDate?: Date; startTime?: string; endTime?: string } = {};

  // Regex to capture date parts and time parts
  const datePartRegex = /^(.*?)(?: - (.*?))?/;
  const timePartRegex = /(?: \(Pukul (\d{2}:\d{2})(?: - (\d{2}:\d{2}))? WIB\))?/;
  const untilTimePartRegex = /(?: \(Sampai Pukul (\d{2}:\d{2}) WIB\))?/;

  let rawStartDateStr: string | undefined;
  let rawEndDateStr: string | undefined;
  let parsedStartTime: string | undefined;
  let parsedEndTime: string | undefined;

  // Try to match the full string with start and end time
  let match = dateString.match(new RegExp(`^${datePartRegex.source}${timePartRegex.source}$`));
  if (match) {
    rawStartDateStr = match[1]?.trim();
    rawEndDateStr = match[2]?.trim();
    parsedStartTime = match[3];
    parsedEndTime = match[4];
  } else {
    // Try to match with only 'until' time
    match = dateString.match(new RegExp(`^${datePartRegex.source}${untilTimePartRegex.source}$`));
    if (match) {
      rawStartDateStr = match[1]?.trim();
      rawEndDateStr = match[2]?.trim();
      parsedEndTime = match[3];
    } else {
      // Fallback for just date parts without time
      match = dateString.match(datePartRegex);
      if (match) {
        rawStartDateStr = match[1]?.trim();
        rawEndDateStr = match[2]?.trim();
      }
    }
  }

  const dateFormat = 'EEEE, dd MMMM yyyy'; // Full format including day of week

  const parseDateSafely = (dateStr: string | undefined): Date | undefined => {
    if (!dateStr) return undefined;
    // Try parsing with full format first
    let parsedDate = parse(dateStr, dateFormat, new Date(), { locale: idLocale }); // Use idLocale
    if (isValid(parsedDate)) return parsedDate;

    // If that fails, try stripping the day of the week and parsing
    const strippedDateStr = dateStr.replace(/^(Senin|Selasa|Rabu|Kamis|Jumat|Sabtu|Minggu),\s*/, '');
    parsedDate = parse(strippedDateStr, 'dd MMMM yyyy', new Date(), { locale: idLocale }); // Use idLocale
    if (isValid(parsedDate)) return parsedDate;

    // As a last resort, try ISO parsing if it looks like an ISO string
    try {
      const isoParsed = parseISO(dateStr);
      if (isValid(isoParsed)) return isoParsed;
    } catch (e) {
      // ignore
    }
    return undefined;
  };

  result.startDate = parseDateSafely(rawStartDateStr);
  result.endDate = parseDateSafely(rawEndDateStr);

  // If only start date is present and no explicit end date, assume single day
  if (result.startDate && !rawEndDateStr && !result.endDate) {
    result.endDate = result.startDate;
  }

  result.startTime = parsedStartTime;
  result.endTime = parsedEndTime;

  return result;
};