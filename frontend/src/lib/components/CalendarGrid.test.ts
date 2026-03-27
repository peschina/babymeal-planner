import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import CalendarGrid from './CalendarGrid.svelte';
import type { PlanDay } from '../types.js';

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

describe('CalendarGrid', () => {
  it('renders exactly 30 day links for a 30-item days prop', () => {
    const { container } = render(CalendarGrid, { props: { days: thirtyDays } });
    const links = container.querySelectorAll('a');
    expect(links).toHaveLength(30);
  });

  it('renders the correct day number in each cell', () => {
    const { getByText } = render(CalendarGrid, { props: { days: thirtyDays } });
    expect(getByText('1')).toBeTruthy();
    expect(getByText('15')).toBeTruthy();
    expect(getByText('30')).toBeTruthy();
  });

  it('marks the cell matching today prop with today class', () => {
    const { container } = render(CalendarGrid, { props: { days: thirtyDays, today: 7 } });
    const todayCells = container.querySelectorAll('.today');
    expect(todayCells).toHaveLength(1);
    expect(todayCells[0].getAttribute('href')).toBe('/day/7');
  });
});
