import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import DayCell from './DayCell.svelte';
import type { PlanDay } from '../types.js';

const mockDay: PlanDay = {
  day: 5,
  lunch: {
    id: 'lunch-5',
    cereal: { name: 'Rice', quantityG: 30 },
    protein: { name: 'Chicken', quantityG: 40 },
    vegetables: [{ name: 'Carrot', quantityG: 50 }],
    oliveOil: { quantityG: 5 },
    broth: { quantityMl: 150 },
  },
  dinner: {
    id: 'dinner-5',
    cereal: { name: 'Pasta', quantityG: 30 },
    protein: { name: 'Fish', quantityG: 40 },
    vegetables: [{ name: 'Zucchini', quantityG: 50 }],
    oliveOil: { quantityG: 5 },
    broth: { quantityMl: 150 },
  },
};

describe('DayCell', () => {
  it('displays the day number', () => {
    const { getByText } = render(DayCell, { props: { day: mockDay } });
    expect(getByText('5')).toBeTruthy();
  });

  it('displays lunch and dinner protein names', () => {
    const { getByText } = render(DayCell, { props: { day: mockDay } });
    expect(getByText('Chicken')).toBeTruthy();
    expect(getByText('Fish')).toBeTruthy();
  });

  it('has today CSS class when isToday is true', () => {
    const { container } = render(DayCell, { props: { day: mockDay, isToday: true } });
    expect(container.querySelector('.today')).toBeTruthy();
  });

  it('does not have today CSS class by default', () => {
    const { container } = render(DayCell, { props: { day: mockDay } });
    expect(container.querySelector('.today')).toBeNull();
  });

  it('renders a link to the day detail page', () => {
    const { container } = render(DayCell, { props: { day: mockDay } });
    const link = container.querySelector('a');
    expect(link?.getAttribute('href')).toBe('/day/5');
  });
});
