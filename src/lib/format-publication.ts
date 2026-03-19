const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

export type PublicationParts = {
  publishedDay: number | null;
  publishedMonth: number | null; // 1–12
  publishedYear: number | null;
};

/** Ex.: 20 February 1928 · February 1928 · 1928 */
export function formatPublicationDate(parts: PublicationParts): string | null {
  const { publishedDay, publishedMonth, publishedYear } = parts;
  if (publishedYear == null) return null;

  const monthName =
    publishedMonth != null && publishedMonth >= 1 && publishedMonth <= 12
      ? MONTHS[publishedMonth - 1]
      : null;

  if (publishedDay != null && monthName) {
    return `${publishedDay} ${monthName} ${publishedYear}`;
  }
  if (monthName) {
    return `${monthName} ${publishedYear}`;
  }
  return String(publishedYear);
}
