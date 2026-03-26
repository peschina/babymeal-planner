import { describe, it, expect, vi } from 'vitest';
import { getPlan, getDay } from './api.js';

describe('getPlan', () => {
  it('returns parsed MealPlan on success', async () => {
    const mockPlan = { generatedAt: '2026-01-01T00:00:00.000Z', totalDays: 30, days: [] };
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockPlan),
    });

    const result = await getPlan(mockFetch as unknown as typeof fetch);
    expect(result).toEqual(mockPlan);
    expect(mockFetch).toHaveBeenCalledWith('/api/plan');
  });

  it('throws on non-200 response', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
    });

    await expect(getPlan(mockFetch as unknown as typeof fetch)).rejects.toThrow(
      'Failed to fetch plan',
    );
  });
});

describe('getDay', () => {
  it('returns parsed PlanDay on success', async () => {
    const mockDay = { day: 1, lunch: {}, dinner: {} };
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockDay),
    });

    const result = await getDay(1, mockFetch as unknown as typeof fetch);
    expect(result).toEqual(mockDay);
    expect(mockFetch).toHaveBeenCalledWith('/api/plan/1');
  });

  it('throws when day not found', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
      statusText: 'Not Found',
    });

    await expect(getDay(99, mockFetch as unknown as typeof fetch)).rejects.toThrow(
      'Failed to fetch day 99',
    );
  });
});
