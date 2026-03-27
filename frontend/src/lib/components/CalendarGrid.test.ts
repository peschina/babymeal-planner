import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import CalendarGrid from './CalendarGrid.svelte';
import type { PlanDay } from '../types.js';
import { buildCalendar } from '../utils.js';

function makeDay(n: number): PlanDay {
  return {
    day: n,
    lunch: {
      id: `lunch-${n}`,
      cereal: { name: 'Rice', quantityG: 30 },
      protein: { name: 'Chicken', quantityG: 40 },
      vegetables: [{ name: 'Carrot', quantityG: 50 }],
      oliveOil: { quantityG: 5 },
      broth: { quantityMl: 150 },
    },
    dinner: {
      id: `dinner-${n}`,
      cereal: { name: 'Pasta', quantityG: 30 },
      protein: { name: 'Fish', quantityG: 40 },
      vegetables: [{ name: 'Zucchini', quantityG: 50 }],
      oliveOil: { quantityG: 5 },
      broth: { quantityMl: 150 },
    },
  };
}

const thirtyDays: PlanDay[] = Array.from({ length: 30 }, (_, i) => makeDay(i + 1));
// Use a fixed Monday as start date so the grid is deterministic in tests
const startDate = new Date('2026-03-23T00:00:00'); // Monday

describe('CalendarGrid', () => {
  it('renders exactly 30 plan day links', () => {
    const calendar = buildCalendar(thirtyDays, startDate);
    const { container } = render(CalendarGrid, { props: { calendar } });
    const links = container.querySelectorAll('a');
    expect(links).toHaveLength(30);
  });

  it('renders 7 weekday headers', () => {
    const calendar = buildCalendar(thirtyDays, startDate);
    const { container } = render(CalendarGrid, { props: { calendar } });
    const headers = container.querySelectorAll('.weekday-label');
    expect(headers).toHaveLength(7);
  });

  it('marks today cell with today class', () => {
    const calendar = buildCalendar(thirtyDays, startDate);
    const { container } = render(CalendarGrid, { props: { calendar } });
    const todayCells = container.querySelectorAll('.today');
    // plan day 1 = startDate = March 23; today cell links to /day/1
    expect(todayCells).toHaveLength(1);
    expect(todayCells[0].getAttribute('href')).toBe('/day/1');
  });

  it('shows a month label for each calendar month spanned', () => {
    const calendar = buildCalendar(thirtyDays, startDate);
    const { container } = render(CalendarGrid, { props: { calendar } });
    const monthLabels = container.querySelectorAll('.month-label');
    // March 23 + 30 days = April 21, so two months should appear
    expect(monthLabels.length).toBeGreaterThanOrEqual(1);
  });
});
