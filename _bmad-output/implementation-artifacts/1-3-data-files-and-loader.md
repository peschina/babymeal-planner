---
id: story-1-3
title: 'Story 1.3: Data Files & Loader'
epic: 'Epic 1: Project Bootstrap'
status: done
completedAt: '2026-03-25'
---

## Files Created

- `backend/src/types/index.ts` — Cereal, Protein, Vegetable, Rules, Meal, PlanDay, MealPlan
- `backend/src/data/cereals.json` — 5 cereals
- `backend/src/data/proteins.json` — 8 proteins (with maxPerWeek + type)
- `backend/src/data/vegetables.json` — 13 vegetables
- `backend/src/data/rules.json` — fixedIngredients + constraints (maxVegetablesPerMeal: 2)
- `backend/src/services/dataLoader.ts` — loadCereals/Proteins/Vegetables/Rules with optional dataDir param
- `backend/src/services/dataLoader.test.ts` — 6 unit tests

## AC Verification

- [x] cereals.json has 5 items
- [x] proteins.json has 8 items with maxPerWeek (number or null)
- [x] vegetables.json has 13 items
- [x] rules.json has maxVegetablesPerMeal: 2
- [x] dataLoader functions async, take optional dataDir for testability
- [x] All 6 test cases pass
