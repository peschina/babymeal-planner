import { describe, it, expect } from 'vitest';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadCereals, loadProteins, loadVegetables, loadRules } from './dataLoader.js';

const dataDir = resolve(dirname(fileURLToPath(import.meta.url)), '../data');

describe('loadCereals', () => {
  it('returns a non-empty array', async () => {
    const cereals = await loadCereals(dataDir);
    expect(Array.isArray(cereals)).toBe(true);
    expect(cereals.length).toBeGreaterThan(0);
  });

  it('each cereal has id, name, and defaultQuantityG', async () => {
    const cereals = await loadCereals(dataDir);
    for (const c of cereals) {
      expect(typeof c.id).toBe('string');
      expect(typeof c.name).toBe('string');
      expect(typeof c.defaultQuantityG).toBe('number');
    }
  });
});

describe('loadProteins', () => {
  it('returns a non-empty array', async () => {
    const proteins = await loadProteins(dataDir);
    expect(proteins.length).toBeGreaterThan(0);
  });

  it('each protein has maxPerWeek as number or null', async () => {
    const proteins = await loadProteins(dataDir);
    for (const p of proteins) {
      expect(p.maxPerWeek === null || typeof p.maxPerWeek === 'number').toBe(true);
    }
  });
});

describe('loadVegetables', () => {
  it('returns 13 vegetables', async () => {
    const vegetables = await loadVegetables(dataDir);
    expect(vegetables.length).toBe(13);
  });
});

describe('loadRules', () => {
  it('returns rules with expected constraint keys', async () => {
    const rules = await loadRules(dataDir);
    expect(rules.constraints.minVegetablesPerMeal).toBe(3);
    expect(rules.constraints.maxVegetablesPerMeal).toBe(4);
    expect(rules.fixedIngredients.oliveOilG).toBe(5);
    expect(rules.fixedIngredients.brothMl).toBe(150);
  });
});
