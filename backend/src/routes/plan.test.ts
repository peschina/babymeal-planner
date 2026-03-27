import { describe, it, expect, beforeAll } from 'vitest';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildApp } from '../app.js';
import { loadCereals, loadProteins, loadVegetables, loadRules } from '../services/dataLoader.js';
import { generatePlan } from '../services/planGenerator.js';
import type { MealPlan, PlanDay } from '../types/index.js';

const dataDir = resolve(dirname(fileURLToPath(import.meta.url)), '../data');

let plan: MealPlan;

beforeAll(async () => {
  const [cereals, proteins, vegetables, rules] = await Promise.all([
    loadCereals(dataDir),
    loadProteins(dataDir),
    loadVegetables(dataDir),
    loadRules(dataDir),
  ]);
  plan = generatePlan({ cereals, proteins, vegetables, rules });
});

describe('GET /api/plan', () => {
  it('returns 200 with totalDays 30 and 30 day entries', async () => {
    const app = await buildApp({ plan });
    const response = await app.inject({ method: 'GET', url: '/api/plan' });
    expect(response.statusCode).toBe(200);
    const body = response.json<MealPlan>();
    expect(body.totalDays).toBe(30);
    expect(body.days.length).toBe(30);
    await app.close();
  });

  it('returns identical response on consecutive calls (deterministic in-memory plan)', async () => {
    const app = await buildApp({ plan });
    const r1 = await app.inject({ method: 'GET', url: '/api/plan' });
    const r2 = await app.inject({ method: 'GET', url: '/api/plan' });
    expect(r1.body).toBe(r2.body);
    await app.close();
  });
});

describe('GET /api/plan/:day', () => {
  it('returns 200 with day 1 data including lunch and dinner', async () => {
    const app = await buildApp({ plan });
    const response = await app.inject({ method: 'GET', url: '/api/plan/1' });
    expect(response.statusCode).toBe(200);
    const body = response.json<PlanDay>();
    expect(body.day).toBe(1);
    expect(body.lunch).toBeDefined();
    expect(body.dinner).toBeDefined();
    await app.close();
  });

  it('returns 200 with day 30 data', async () => {
    const app = await buildApp({ plan });
    const response = await app.inject({ method: 'GET', url: '/api/plan/30' });
    expect(response.statusCode).toBe(200);
    expect(response.json<PlanDay>().day).toBe(30);
    await app.close();
  });

  it('returns 400 with INVALID_DAY for day 0', async () => {
    const app = await buildApp({ plan });
    const response = await app.inject({ method: 'GET', url: '/api/plan/0' });
    expect(response.statusCode).toBe(400);
    expect(response.json().error.code).toBe('INVALID_DAY');
    await app.close();
  });

  it('returns 400 with INVALID_DAY for day 31', async () => {
    const app = await buildApp({ plan });
    const response = await app.inject({ method: 'GET', url: '/api/plan/31' });
    expect(response.statusCode).toBe(400);
    expect(response.json().error.code).toBe('INVALID_DAY');
    await app.close();
  });

  it('returns 400 for non-numeric day', async () => {
    const app = await buildApp({ plan });
    const response = await app.inject({ method: 'GET', url: '/api/plan/abc' });
    expect(response.statusCode).toBe(400);
    await app.close();
  });
});

describe('GET /api/unknown', () => {
  it('returns 404 with NOT_FOUND error envelope', async () => {
    const app = await buildApp({ plan });
    const response = await app.inject({ method: 'GET', url: '/api/unknown' });
    expect(response.statusCode).toBe(404);
    expect(response.json().error.code).toBe('NOT_FOUND');
    await app.close();
  });
});
