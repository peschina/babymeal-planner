import { describe, it, expect } from 'vitest';
import { filterByWeeklyLimit, excludeUsed, selectVegetables } from './constraintEngine.js';
import type { Protein, Vegetable } from '../types/index.js';

const fish: Protein = { id: 'fish', name: 'Fish', defaultQuantityG: 30, maxPerWeek: 2, type: 'fish' };
const eggs: Protein = { id: 'eggs', name: 'Eggs', defaultQuantityG: 30, maxPerWeek: 1, type: 'egg' };
const lentils: Protein = { id: 'lentils', name: 'Lentils', defaultQuantityG: 30, maxPerWeek: null, type: 'legume' };
const chicken: Protein = { id: 'chicken', name: 'Chicken', defaultQuantityG: 30, maxPerWeek: 3, type: 'meat' };

describe('filterByWeeklyLimit', () => {
  it('excludes fish when usage equals maxPerWeek (2)', () => {
    expect(filterByWeeklyLimit([fish], { fish: 2 })).toEqual([]);
  });

  it('excludes eggs when usage equals maxPerWeek (1)', () => {
    expect(filterByWeeklyLimit([eggs], { eggs: 1 })).toEqual([]);
  });

  it('keeps lentils regardless of usage count because maxPerWeek is null', () => {
    expect(filterByWeeklyLimit([lentils], { lentils: 5 })).toEqual([lentils]);
  });

  it('keeps fish when usage is below maxPerWeek', () => {
    expect(filterByWeeklyLimit([fish], { fish: 1 })).toEqual([fish]);
  });

  it('keeps protein when not used at all this week', () => {
    expect(filterByWeeklyLimit([chicken], {})).toEqual([chicken]);
  });
});

describe('excludeUsed', () => {
  it('removes proteins matching usedIds', () => {
    expect(excludeUsed([fish, chicken], ['fish'])).toEqual([chicken]);
  });

  it('returns full array when usedIds is empty', () => {
    expect(excludeUsed([fish, chicken], [])).toEqual([fish, chicken]);
  });
});

describe('selectVegetables', () => {
  const vegetables: Vegetable[] = Array.from({ length: 13 }, (_, i) => ({
    id: `veg${i}`,
    name: `Veg ${i}`,
    defaultQuantityG: 30,
  }));

  it('always returns 1 or 2 items (never 0 or 3+)', () => {
    for (let i = 0; i < 100; i++) {
      const result = selectVegetables(vegetables, 2);
      expect(result.length).toBeGreaterThanOrEqual(1);
      expect(result.length).toBeLessThanOrEqual(2);
    }
  });

  it('never returns more than maxCount items', () => {
    for (let i = 0; i < 50; i++) {
      expect(selectVegetables(vegetables, 2).length).toBeLessThanOrEqual(2);
    }
  });
});
