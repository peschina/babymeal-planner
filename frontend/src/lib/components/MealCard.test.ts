import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import MealCard from './MealCard.svelte';
import type { Meal } from '../types.js';

const mockMeal: Meal = {
  id: 'lunch-1',
  cereal: { name: 'Rice', quantityG: 30 },
  protein: { name: 'Chicken', quantityG: 40 },
  vegetables: [
    { name: 'Carrot', quantityG: 50 },
    { name: 'Zucchini', quantityG: 45 },
  ],
  oliveOil: { quantityG: 5 },
  broth: { quantityMl: 150 },
};

describe('MealCard', () => {
  it('renders the meal label', () => {
    const { getByText } = render(MealCard, { props: { meal: mockMeal, label: 'Pranzo' } });
    expect(getByText('Pranzo')).toBeTruthy();
  });

  it('renders protein name and quantity', () => {
    const { getByText } = render(MealCard, { props: { meal: mockMeal, label: 'Pranzo' } });
    expect(getByText('Chicken')).toBeTruthy();
    expect(getByText('40g')).toBeTruthy();
  });

  it('renders cereal name and quantity', () => {
    const { getByText } = render(MealCard, { props: { meal: mockMeal, label: 'Pranzo' } });
    expect(getByText('Rice')).toBeTruthy();
    expect(getByText('30g')).toBeTruthy();
  });

  it('renders olive oil quantity as 5g', () => {
    const { getByText } = render(MealCard, { props: { meal: mockMeal, label: 'Pranzo' } });
    expect(getByText('5g')).toBeTruthy();
  });

  it('renders broth quantity as 150ml', () => {
    const { getByText } = render(MealCard, { props: { meal: mockMeal, label: 'Pranzo' } });
    expect(getByText('150ml')).toBeTruthy();
  });

  it('renders both vegetables when 2 are present', () => {
    const { getByText } = render(MealCard, { props: { meal: mockMeal, label: 'Pranzo' } });
    expect(getByText('Carrot')).toBeTruthy();
    expect(getByText('Zucchini')).toBeTruthy();
  });

  it('renders a single vegetable when only 1 is present', () => {
    const singleVegMeal: Meal = { ...mockMeal, vegetables: [{ name: 'Spinach', quantityG: 35 }] };
    const { getByText, queryByText } = render(MealCard, {
      props: { meal: singleVegMeal, label: 'Cena' },
    });
    expect(getByText('Spinach')).toBeTruthy();
    expect(queryByText('Carrot')).toBeNull();
  });
});
