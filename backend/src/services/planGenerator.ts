import type { Cereal, Protein, Vegetable, Rules, Meal, PlanDay, MealPlan } from '../types/index.js';
import { filterByWeeklyLimit, excludeUsed, selectVegetables, randomItem } from './constraintEngine.js';

export interface PlanData {
  cereals: Cereal[];
  proteins: Protein[];
  vegetables: Vegetable[];
  rules: Rules;
}

function buildMeal(
  id: string,
  cereal: Cereal,
  protein: Protein,
  vegetables: Vegetable[],
  rules: Rules,
): Meal {
  return {
    id,
    cereal: { name: cereal.name, quantityG: cereal.defaultQuantityG },
    protein: { name: protein.name, quantityG: protein.defaultQuantityG },
    vegetables: vegetables.map((v) => ({ name: v.name, quantityG: v.defaultQuantityG })),
    oliveOil: { quantityG: rules.fixedIngredients.oliveOilG },
    broth: { quantityMl: rules.fixedIngredients.brothMl },
  };
}

export function generatePlan(data: PlanData): MealPlan {
  if (!data.cereals?.length || !data.proteins?.length || !data.vegetables?.length || !data.rules) {
    throw new Error('generatePlan: missing required data (cereals, proteins, vegetables, rules)');
  }

  const days: PlanDay[] = [];
  let weeklyProteinUsage: Record<string, number> = {};

  for (let dayNum = 1; dayNum <= 30; dayNum++) {
    // Reset weekly protein usage at the start of each 7-day window
    if ((dayNum - 1) % 7 === 0) {
      weeklyProteinUsage = {};
    }

    const usedProteinIds: string[] = [];
    const usedCerealIds: string[] = [];

    // ── Lunch protein ──────────────────────────────────────────────────────────
    const lunchProteinCandidates = filterByWeeklyLimit(
      excludeUsed(data.proteins, usedProteinIds),
      weeklyProteinUsage,
    );
    const lunchProtein = randomItem(lunchProteinCandidates);
    usedProteinIds.push(lunchProtein.id);
    weeklyProteinUsage[lunchProtein.id] = (weeklyProteinUsage[lunchProtein.id] ?? 0) + 1;

    // ── Lunch cereal ───────────────────────────────────────────────────────────
    const lunchCereal = randomItem(data.cereals);
    usedCerealIds.push(lunchCereal.id);

    // ── Lunch vegetables ───────────────────────────────────────────────────────
    const lunchVegetables = selectVegetables(
      data.vegetables,
      data.rules.constraints.maxVegetablesPerMeal,
    );

    // ── Dinner protein (different from lunch, within weekly limit) ─────────────
    const dinnerProteinCandidates = filterByWeeklyLimit(
      excludeUsed(data.proteins, usedProteinIds),
      weeklyProteinUsage,
    );
    const dinnerProtein = randomItem(dinnerProteinCandidates);
    weeklyProteinUsage[dinnerProtein.id] = (weeklyProteinUsage[dinnerProtein.id] ?? 0) + 1;

    // ── Dinner cereal (different from lunch) ───────────────────────────────────
    const dinnerCerealPool = excludeUsed(data.cereals, usedCerealIds);
    const dinnerCereal = randomItem(dinnerCerealPool.length > 0 ? dinnerCerealPool : data.cereals);

    // ── Dinner vegetables ──────────────────────────────────────────────────────
    const dinnerVegetables = selectVegetables(
      data.vegetables,
      data.rules.constraints.maxVegetablesPerMeal,
    );

    days.push({
      day: dayNum,
      lunch: buildMeal(
        `meal-d${dayNum}-lunch`,
        lunchCereal,
        lunchProtein,
        lunchVegetables,
        data.rules,
      ),
      dinner: buildMeal(
        `meal-d${dayNum}-dinner`,
        dinnerCereal,
        dinnerProtein,
        dinnerVegetables,
        data.rules,
      ),
    });
  }

  return {
    generatedAt: new Date().toISOString(),
    totalDays: 30,
    days,
  };
}
