// ─── Ingredient data shapes (from JSON files) ───────────────────────────────

export interface Cereal {
  id: string;
  name: string;
  defaultQuantityG: number;
}

export interface Protein {
  id: string;
  name: string;
  defaultQuantityG: number;
  maxPerWeek: number | null; // null = unlimited
  type: 'meat' | 'fish' | 'legume' | 'dairy' | 'egg';
}

export interface Vegetable {
  id: string;
  name: string;
  defaultQuantityG: number;
}

export interface Rules {
  fixedIngredients: {
    oliveOilG: number;
    brothMl: number;
  };
  constraints: {
    noDuplicateProteinInDay: boolean;
    noDuplicateCerealInDay: boolean;
    maxVegetablesPerMeal: number;
  };
}

// ─── Meal plan output shapes ─────────────────────────────────────────────────

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
