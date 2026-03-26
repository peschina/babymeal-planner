---
title: "PRD: BabyMeal Planner"
status: "draft"
created: "2026-03-25"
updated: "2026-03-25"
version: "1.1"
changes: "v1.1 - Converted to PWA, changed plan from weekly to monthly, scoped explicitly to 7-month MVP, replaced Italian weaning guidelines with Italian market vegetables"
---

# Product Requirements Document (PRD)

## Product Name (Working Title): BabyMeal Planner

## 1. Overview

BabyMeal Planner is a Progressive Web App (PWA) designed to help parents of 7-month-old babies plan and prepare balanced daily meals. The app generates a structured monthly calendar with lunch and dinner suggestions, ensuring nutritional variety, appropriate portion sizes, and use of vegetables commonly available in Italian markets.

The app provides parents with a reliable, ready-to-follow plan to reduce decision fatigue and ensure consistency during the weaning phase.

> **MVP Scope Note:** This version is intentionally scoped to babies aged exactly 7 months. Age-adaptive features are out of scope for this release.

---

## 2. Problem Statement

Parents introducing solid foods often struggle with:

- Knowing what foods to introduce and when
- Ensuring a balanced and varied diet
- Planning meals consistently day-to-day
- Understanding correct portion sizes
- Avoiding repetition or nutritional gaps

This leads to stress, uncertainty, and inconsistent feeding practices.

---

## 3. Goals & Objectives

### Primary Goals

- Provide a ready-to-follow monthly meal calendar
- Ensure nutritionally balanced and varied meals
- Simplify daily decision-making

### Secondary Goals

- Save time on meal planning
- Build trust as a reliable parenting tool

---

## 4. Target Users

### Primary Users

- Parents of babies aged 7 months
- First-time parents

### Secondary Users

- Caregivers (grandparents, babysitters)

---

## 5. Key Features

### 5.1 Meal Calendar (Core Feature)

- Monthly calendar view (30 days)
- Each day includes:
  - Lunch
  - Dinner
- Meals are pre-generated and optimized for:
  - Nutritional balance
  - Variety
  - Age appropriateness (fixed at 7 months for MVP)

---

### 5.2 Meal Composition Logic

Each meal includes:

- Cereal cream (carbohydrates)
- Protein source
- Vegetables
- Extra virgin olive oil (always included)
- Broth (always included)

#### Protein Options:

- Chicken
- Turkey
- Fish
- Legumes (lentils, peas, green beans)
- Cheese
- Eggs (occasional inclusion in rotation)

#### Vegetable Pool (Italian market availability):

Vegetables used are commonly available in Italian supermarkets and seasonal markets, including:
- Zucchini
- Carrot
- Potato
- Pumpkin
- Spinach
- Fennel
- Leek
- Cauliflower
- Onion
- Beet
- Sweet potato
- Celery
- Broccoli

#### Example:

- Lunch:
  - Rice cream (20g)
  - Zucchini purée (40g)
  - Chicken (30g)
  - Extra virgin olive oil (5g)
  - Vegetable broth (150ml)
- Dinner:
  - Oat cream (20g)
  - Carrot + potato (50g)
  - Lentils (30g)
  - Extra virgin olive oil (5g)
  - Vegetable broth (150ml)

---

### 5.3 Automatic Variety System

The app ensures:

- Rotation of:
  - Cereals (rice, corn, oats, semolina, mixed grains)
  - Proteins (including eggs occasionally)
  - Vegetables (from Italian market pool, seasonal awareness encouraged)
- No repetition patterns (e.g., same protein twice in a day)
- Monthly balance (e.g., fish 1–2 times/week, legumes multiple times/week, eggs limited frequency)

---

### 5.4 Portion Guidance

- Exact quantities per ingredient (grams/ml)
- Standardized for a 7-month-old baby

---

### 5.5 Meal Detail View

Each meal includes:

- Ingredients list with quantities

---

## 6. User Flow

### Onboarding

1. User visits the PWA (or opens it from home screen if installed)
2. App directly presents a pre-generated monthly meal plan (no input required)

---

### Daily Use

1. User opens app
2. Views current day within the monthly calendar
3. Selects:
   - Lunch or dinner
4. Sees ingredients and quantities
5. Prepares meal

---

## 7. Functional Requirements

### FR1: Meal Generation Engine

- Generate a full 30-day plan based on:
  - Nutritional rules
  - Variety constraints
  - Fixed inclusion of olive oil and broth
  - Vegetables drawn from the Italian market availability pool

### FR2: Calendar Interface

- Display meals clearly by day and meal slot (lunch/dinner)
- Monthly view as the primary navigation
- Allow day-level detail drill-down

### FR3: Meal Detail Page

- Show structured breakdown of ingredients and quantities

### FR4: Data Storage

- Store:
  - Meal templates
  - Ingredient database
  - Nutritional rules and variety constraints

---

## 8. Non-Functional Requirements

- **Platform:** Progressive Web App (PWA) — installable on mobile home screen, works in browser
- **Usability:** Extremely simple UI (sleep-deprived parent friendly)
- **Performance:** Instant load of monthly plan
- **Offline access:** Full monthly plan accessible without an internet connection via service worker caching
- **Mobile-first:** Designed primarily for one-handed mobile use

---

## 9. Out of Scope (MVP)

- Age-adaptive plans (8 months, 9 months, etc.)
- User input or customization of the meal plan
- Allergen filtering or dietary restriction settings
- Shopping list generation
- Push notifications or reminders
- User accounts or data persistence across devices
