/**
 * Format Hijri date with Arabic suffix
 */
export const formatHijriDate = (hijri: string): string => {
  return `${hijri} هـ`;
};

/**
 * Format Gregorian date with Arabic suffix
 */
export const formatGregorianDate = (gregorian: number): string => {
  return `${gregorian} م`;
};

/**
 * Format date range with both Hijri and Gregorian dates
 */
export const formatDateRange = (hijri: string, gregorian: number): string => {
  return `${formatHijriDate(hijri)} / ${formatGregorianDate(gregorian)}`;
};

/**
 * Truncate text to specified length with ellipsis
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

