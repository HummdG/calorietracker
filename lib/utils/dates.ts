import { format, subDays, eachDayOfInterval, startOfMonth, endOfMonth, parseISO } from "date-fns";

export function formatDateISO(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

export function formatDateDisplay(date: Date | string): string {
  const d = typeof date === "string" ? parseISO(date) : date;
  return format(d, "EEE d MMM");
}

export function formatDateShort(date: Date | string): string {
  const d = typeof date === "string" ? parseISO(date) : date;
  return format(d, "d MMM");
}

export function formatDateFull(date: Date | string): string {
  const d = typeof date === "string" ? parseISO(date) : date;
  return format(d, "EEEE d MMMM yyyy");
}

export function formatDateSlug(date: Date): string {
  return format(date, "dd-MM-yyyy");
}

export function parseSlugDate(slug: string): Date {
  // expects DD-MM-YYYY
  const [day, month, year] = slug.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function getLastNDays(n: number): Date[] {
  const today = new Date();
  return Array.from({ length: n }, (_, i) => subDays(today, n - 1 - i));
}

export function getDaysInMonth(date: Date): Date[] {
  return eachDayOfInterval({
    start: startOfMonth(date),
    end: endOfMonth(date),
  });
}

export function isToday(date: Date | string): boolean {
  const d = typeof date === "string" ? parseISO(date) : date;
  return formatDateISO(d) === formatDateISO(new Date());
}
