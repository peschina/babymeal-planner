// ─── Ingredient data shapes (mirrored from backend/src/types/index.ts) ───────

export interface IngredientPortion {
  name: string;
  quantityG: number;
}

export interface BrothPortion {
  quantityMl: number;
}

export interface Meal {
  id: string;
  cereal: IngredientPortion;
  protein: IngredientPortion;
  vegetables: IngredientPortion[];
  oliveOil: { quantityG: number };
  broth: BrothPortion;
}

export interface PlanDay {
  day: number;
  lunch: Meal;
  dinner: Meal;
}

export interface MealPlan {
  generatedAt: string; // ISO 8601
  totalDays: number;
  days: PlanDay[];
}
