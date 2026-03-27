import { describe, it, expect } from 'vitest';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { generatePlan } from './planGenerator.js';
import { loadCereals, loadProteins, loadVegetables, loadRules } from './dataLoader.js';
import type { PlanData } from './planGenerator.js';

const dataDir = resolve(dirname(fileURLToPath(import.meta.url)), '../data');

async function loadData(): Promise<PlanData> {
  const [cereals, proteins, vegetables, rules] = await Promise.all([
    loadCereals(dataDir),
    loadProteins(dataDir),
    loadVegetables(dataDir),
    loadRules(dataDir),
  ]);
  return { cereals, proteins, vegetables, rules };
}

describe('generatePlan', () => {
  it('returns MealPlan with totalDays === 30 and 30 day entries', async () => {
    const plan = generatePlan(await loadData());
    expect(plan.totalDays).toBe(30);
    expect(plan.days.length).toBe(30);
  });

  it('every day: lunch.cereal !== dinner.cereal', async () => {
    const plan = generatePlan(await loadData());
    for (const day of plan.days) {
      expect(day.lunch.cereal.name).not.toBe(day.dinner.cereal.name);
    }
  });

  it('every day: lunch.protein !== dinner.protein', async () => {
    const plan = generatePlan(await loadData());
    for (const day of plan.days) {
      expect(day.lunch.protein.name).not.toBe(day.dinner.protein.name);
    }
  });

  it('all meals include oliveOil 5g and broth 150ml', async () => {
    const plan = generatePlan(await loadData());
    for (const day of plan.days) {
      expect(day.lunch.oliveOil.quantityG).toBe(5);
      expect(day.lunch.broth.quantityMl).toBe(150);
      expect(day.dinner.oliveOil.quantityG).toBe(5);
      expect(day.dinner.broth.quantityMl).toBe(150);
    }
  });

  it('fish count across plan does not exceed weekly limit (≤2/week × 5 weeks = 10)', async () => {
    const plan = generatePlan(await loadData());
    const count = plan.days
      .flatMap((d) => [d.lunch, d.dinner])
      .filter((m) => m.protein.name === 'Fish').length;
    expect(count).toBeLessThanOrEqual(10);
  });

  it('eggs count across plan does not exceed weekly limit (≤1/week × 5 weeks = 5)', async () => {
    const plan = generatePlan(await loadData());
    const count = plan.days
      .flatMap((d) => [d.lunch, d.dinner])
      .filter((m) => m.protein.name === 'Eggs').length;
    expect(count).toBeLessThanOrEqual(5);
  });

  it('throws when required data is missing', () => {
    expect(() => generatePlan({} as PlanData)).toThrow(
      'generatePlan: missing required data',
    );
  });
});
