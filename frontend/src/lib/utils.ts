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
