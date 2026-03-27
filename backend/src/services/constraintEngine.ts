import type { Protein, Vegetable } from '../types/index.js';

/**
 * Filters protein candidates by weekly usage limits.
 * Proteins with maxPerWeek === null are never excluded (unlimited).
 * A protein is excluded when its weekly usage count equals or exceeds maxPerWeek.
 */
export function filterByWeeklyLimit(
  candidates: Protein[],
  weeklyUsage: Record<string, number>,
): Protein[] {
  return candidates.filter((p) => {
    if (p.maxPerWeek === null) return true;
    return (weeklyUsage[p.id] ?? 0) < p.maxPerWeek;
  });
}

/**
 * Filters out items whose id appears in the usedIds list.
 */
export function excludeUsed<T extends { id: string }>(candidates: T[], usedIds: string[]): T[] {
  return candidates.filter((c) => !usedIds.includes(c.id));
}

/**
 * Randomly selects between minCount and maxCount vegetables from the candidates list.
 * The returned count is clamped to the available list length.
 */
export function selectVegetables(
  vegetables: Vegetable[],
  minCount: number,
  maxCount: number,
): Vegetable[] {
  const shuffled = [...vegetables].sort(() => Math.random() - 0.5);
  const range = maxCount - minCount + 1;
  const count = minCount + Math.floor(Math.random() * range);
  return shuffled.slice(0, Math.min(count, vegetables.length));
}

/**
 * Returns a uniformly random item from an array.
 * Throws if the array is empty.
 */
export function randomItem<T>(arr: T[]): T {
  if (arr.length === 0) {
    throw new Error('Cannot pick a random item from an empty array');
  }
  return arr[Math.floor(Math.random() * arr.length)];
}
