import type { PlanDay } from './types.js';

/**
 * Formats a day number (1–30) to an ordinal string.
 * E.g. 1 → "Day 1", 30 → "Day 30"
 */
export function formatDay(day: number): string {
  return `Day ${day}`;
}

/**
 * Formats grams quantity for display.
 * E.g. 20 → "20g"
 */
export function formatGrams(quantityG: number): string {
  return `${quantityG}g`;
}

/**
 * Formats millilitres quantity for display.
 * E.g. 150 → "150ml"
 */
export function formatMl(quantityMl: number): string {
  return `${quantityMl}ml`;
}

// ── Calendar building ──────────────────────────────────────────────────────────

const WEEKDAY_LABELS = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'] as const;
const MONTH_NAMES = [
  'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
  'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre',
] as const;

export interface CalendarCell {
  planDay: PlanDay | null; // null = outside plan range (filler day)
  dayOfMonth: number;
  isToday: boolean;
}

export interface CalendarWeek {
  cells: (CalendarCell | null)[]; // length 7; null = padding before/after the month span
  monthLabel: string | null; // non-null on the first week of each calendar month
}

export interface CalendarData {
  readonly weekdayLabels: readonly string[];
  weeks: CalendarWeek[];
  title: string; // e.g. "Marzo – Aprile 2026"
}

/**
 * Builds a 7-column (Mon–Sun) calendar grid for a 30-day meal plan.
 *
 * @param days     - The ordered plan days (day 1 = startDate, day 30 = startDate+29)
 * @param startDate - The real-world date corresponding to plan day 1 (today)
 */
export function buildCalendar(days: PlanDay[], startDate: Date): CalendarData {
  // Normalize to midnight to avoid DST surprises
  const start = toMidnight(startDate);
  const planEnd = addDays(start, days.length - 1);

  // Build date-key → PlanDay lookup
  const planMap = new Map<string, PlanDay>();
  for (const day of days) {
    planMap.set(toDateKey(addDays(start, day.day - 1)), day);
  }

  // Grid starts on the Monday of the week containing plan day 1
  // Grid ends on the Sunday of the week containing the last plan day
  const gridStart = getMondayOf(start);
  const gridEnd = getSundayOf(planEnd);

  const weeks: CalendarWeek[] = [];
  let seenMonths = new Set<string>();
  let cursor = new Date(gridStart);

  while (cursor <= gridEnd) {
    const week: CalendarWeek = { cells: [], monthLabel: null };

    for (let i = 0; i < 7; i++) {
      const cellDate = new Date(cursor);
      const monthKey = `${cellDate.getFullYear()}-${cellDate.getMonth()}`;

      // Set monthLabel on the first week a new month appears
      if (!seenMonths.has(monthKey)) {
        seenMonths.add(monthKey);
        week.monthLabel = `${MONTH_NAMES[cellDate.getMonth()]} ${cellDate.getFullYear()}`;
      }

      const dateKey = toDateKey(cellDate);
      const planDay = planMap.get(dateKey) ?? null;
      const isToday = dateKey === toDateKey(start);

      week.cells.push({ planDay, dayOfMonth: cellDate.getDate(), isToday });
      cursor = addDays(cursor, 1);
    }

    weeks.push(week);
  }

  // Title: "Marzo 2026" or "Marzo – Aprile 2026"
  const startMonthName = MONTH_NAMES[start.getMonth()];
  const endMonthName = MONTH_NAMES[planEnd.getMonth()];
  const title =
    start.getMonth() === planEnd.getMonth() && start.getFullYear() === planEnd.getFullYear()
      ? `${startMonthName} ${start.getFullYear()}`
      : `${startMonthName} – ${endMonthName} ${planEnd.getFullYear()}`;

  return { weekdayLabels: WEEKDAY_LABELS, weeks, title };
}

function toMidnight(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function toDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function getMondayOf(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay(); // 0=Sun, 1=Mon…
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return d;
}

function getSundayOf(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? 0 : 7 - day;
  d.setDate(d.getDate() + diff);
  return d;
}
