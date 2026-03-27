---
id: epics-2-3-summary
title: 'Epics 2 & 3: Meal Generation Engine + Calendar & Meal Display'
epics: ['Epic 2: Meal Generation Engine', 'Epic 3: Calendar & Meal Display']
status: done
completedAt: '2026-03-27'
changeNote: 'Vegetable count updated from max 2 to 3–4 per meal after Epic 3 completion'
---

## Epic 2: Meal Generation Engine

### Story 2.1 — Shared TypeScript Types

**Files created/modified:**

- `backend/src/types/index.ts` — `Cereal`, `Protein`, `Vegetable`, `Rules`, `IngredientPortion`, `Meal`, `PlanDay`, `MealPlan`
- `frontend/src/lib/types.ts` — mirror of `Meal`, `PlanDay`, `MealPlan`, `IngredientPortion`, `BrothPortion`

### Story 2.2 — Variety Constraint Engine

**Files created:**

- `backend/src/services/constraintEngine.ts`
  - `filterByWeeklyLimit(candidates, weeklyUsage)` — excludes proteins where usage ≥ maxPerWeek; null = unlimited
  - `excludeUsed<T>(candidates, usedIds)` — generic id-based filter
  - `selectVegetables(vegetables, minCount, maxCount)` — returns random count in [min, max], clamped to list length
  - `randomItem<T>(arr)` — throws on empty array
- `backend/src/services/constraintEngine.test.ts` — 10 unit tests

### Story 2.3 — 30-Day Plan Generator

**Files created:**

- `backend/src/services/planGenerator.ts`
  - `generatePlan(data: PlanData): MealPlan` — 30-day loop; weekly protein usage reset every 7 days; no duplicate protein/cereal per day; fixed oliveOil=5g, broth=150ml
- `backend/src/services/planGenerator.test.ts` — 7 unit tests

### Story 2.4 — Meal Plan REST API

**Files created/modified:**

- `backend/src/routes/plan.ts` — `GET /api/plan`, `GET /api/plan/:day`
- `backend/src/routes/plan.test.ts` — 8 integration tests (Fastify inject)
- `backend/src/routes/index.ts` — registers plan routes when plan data is provided
- `backend/src/plugins/errorHandler.ts` — added `setNotFoundHandler` returning `{error:{code:"NOT_FOUND"}}`
- `backend/src/app.ts` — accepts `{ plan?: MealPlan }` option
- `backend/src/index.ts` — loads data → generates plan → passes to `buildApp`

---

## Epic 3: Calendar & Meal Display

### Story 3.1 — API Client and Plan Loading

Already scaffolded in Epic 1 (Story 1.4). Verified functional:

- `frontend/src/lib/api.ts` — `getPlan(fetch)`, `getDay(day, fetch)` — uses `PUBLIC_API_BASE` (/api) which routes through SvelteKit proxy
- `frontend/src/routes/+layout.ts` — `load()` calls `getPlan` once; plan available as `data.plan` to all child routes; errors surface to `+error.svelte`
- `frontend/src/lib/api.test.ts` — 4 unit tests (success + error paths for both functions)

### Story 3.2 — Monthly Calendar View

**Files created/modified:**

- `frontend/src/lib/components/CalendarGrid.svelte` — CSS grid, `repeat(auto-fill, minmax(88px, 1fr))`, iterates `days` prop
- `frontend/src/lib/components/DayCell.svelte` — shows day number + lunch/dinner protein names; `today` CSS class when `isToday=true`; min 44×44px touch target; links to `/day/[n]`
- `frontend/src/lib/components/CalendarGrid.test.ts` — 3 unit tests
- `frontend/src/lib/components/DayCell.test.ts` — 5 unit tests
- `frontend/src/routes/+page.svelte` — replaced placeholder with `<CalendarGrid days={data.plan.days} today={1} />`
- `frontend/e2e/calendar.spec.ts` — 4 Playwright tests: 30 cells, click navigation, today highlight, mobile no-scroll

### Story 3.3 — Meal Detail View

**Files created:**

- `frontend/src/lib/components/MealCard.svelte` — renders protein, cereal, vegetables (all with `g`/`ml` units), olive oil, broth; responsive two-column layout on ≥600px
- `frontend/src/lib/components/MealCard.test.ts` — 7 unit tests
- `frontend/src/routes/day/[day]/+page.ts` — `load()`: parses day from params, throws 404 for invalid, reads from parent plan
- `frontend/src/routes/day/[day]/+page.svelte` — Pranzo + Cena `MealCard` components, back link to `/`
- `frontend/e2e/meal-detail.spec.ts` — 5 Playwright tests: meal cards visible, quantities, back nav, invalid day error, page title

---

## Post-Epic Change: Vegetable Count (3–4 per meal)

After Epic 3 completion, the vegetable constraint was updated from `max 2` to a `min 3 / max 4` range.

**Files modified:**

- `backend/src/data/rules.json` — `minVegetablesPerMeal: 3`, `maxVegetablesPerMeal: 4`
- `backend/src/types/index.ts` — added `minVegetablesPerMeal: number` to `Rules.constraints`
- `backend/src/services/constraintEngine.ts` — `selectVegetables` signature updated to `(vegetables, minCount, maxCount)`
- `backend/src/services/planGenerator.ts` — both call sites pass `minVegetablesPerMeal` and `maxVegetablesPerMeal`
- `backend/src/services/constraintEngine.test.ts` — assertions updated (3–4 range, clamping test)
- `backend/src/services/dataLoader.test.ts` — updated constraint key assertions

---

## Test Inventory

| File | Tests | Type |
|---|---|---|
| `backend/src/services/constraintEngine.test.ts` | 10 | Unit |
| `backend/src/services/planGenerator.test.ts` | 7 | Unit |
| `backend/src/services/dataLoader.test.ts` | 6 | Unit |
| `backend/src/config.test.ts` | 5 | Unit |
| `backend/src/routes/health.test.ts` | 1 | Integration |
| `backend/src/routes/plan.test.ts` | 8 | Integration |
| `frontend/src/lib/api.test.ts` | 4 | Unit |
| `frontend/src/lib/components/DayCell.test.ts` | 5 | Unit |
| `frontend/src/lib/components/CalendarGrid.test.ts` | 3 | Unit |
| `frontend/src/lib/components/MealCard.test.ts` | 7 | Unit |
| `frontend/e2e/smoke.spec.ts` | 1 | E2E |
| `frontend/e2e/calendar.spec.ts` | 4 | E2E |
| `frontend/e2e/meal-detail.spec.ts` | 5 | E2E |
| `postman/babymeal-planner.postman_collection.json` | 9 (31 assertions) | API integration |
| **Total** | **75** | |

## AC Verification

- [x] `GET /api/plan` returns 30-day MealPlan with `generatedAt`, `totalDays: 30`, `days[30]`
- [x] `GET /api/plan/:day` returns single PlanDay; 400 for out-of-range; 404 for unknown routes
- [x] No duplicate protein or cereal within a single day
- [x] Fish ≤ 2/week, eggs ≤ 1/week, cheese ≤ 2/week across the plan
- [x] Every meal has 3–4 vegetables, olive oil 5g, broth 150ml
- [x] Calendar renders 30 cells; day 1 highlighted as today
- [x] Tapping a day cell navigates to `/day/[n]`
- [x] Meal detail shows Pranzo + Cena cards with all ingredient quantities
- [x] Back link returns to `/`
- [x] Invalid day (`/day/99`) shows error page
- [x] Mobile viewport (375px): no horizontal scroll
- [x] `npm run build` clean for both backend and frontend
- [x] 37 backend Vitest tests passing, 19 frontend Vitest tests passing
