---
title: "Product Brief: BabyMeal Planner"
status: "draft"
created: "2026-03-25"
updated: "2026-03-25"
inputs: ["_bmad-output/planning-artifacts/prd-babymeal-planner.md"]
---

# Product Brief: BabyMeal Planner

## Executive Summary

BabyMeal Planner is a Progressive Web App that eliminates the daily stress of meal planning for parents of 7-month-old babies. It delivers a complete, pre-generated 30-day calendar of balanced lunches and dinners — no input required, no decisions to make, no nutritional second-guessing.

The problem space is acute: weaning is a high-anxiety phase. Parents are sleep-deprived, overwhelmed by conflicting online advice, and making twice-daily food decisions with zero margin for error. BabyMeal Planner replaces that chaos with a single, trusted, ready-to-use plan.

The MVP is deliberately ruthless in scope: one age group, one plan, one job done well. The assumption being tested is simple — if we remove all friction to getting a sound meal plan, will parents use it and trust it?

---

## The Problem

Every parent of a 7-month-old faces the same wall at 11am and 6pm: *what do I feed this baby today?*

Weaning is medically significant — introduce the wrong food too soon, miss a nutrient group, repeat proteins too often, and the consequences can range from fussiness to genuine developmental impact. Yet the default guidance parents receive is a one-page pamphlet from the pediatrician and a spiral into contradictory Google results.

The practical pain points:

- **What to cook?** Parents don't have a mental library of age-appropriate recipes. They default to repetition (chicken and carrot, every day, for weeks).
- **Is this balanced?** Tracking variety across cereals, proteins, and vegetables across two meals a day is real cognitive work.
- **How much?** Portion sizing for a 7-month-old requires looking up weight-based guidance every single time.

The cost of the status quo is low-grade daily stress, nutritional inconsistency, and a parent who loses confidence in their own cooking by week three.

---

## The Solution

BabyMeal Planner opens to a full 30-day meal calendar. No signup. No onboarding. No choices.

Each day shows two meals — lunch and dinner. Tap any meal and see the complete ingredient list with exact gram/ml quantities, ready to cook. The plan is generated using a variety engine that ensures rotation across cereals (rice, oats, corn, mixed grains), proteins (chicken, turkey, fish, legumes, cheese, eggs), and vegetables drawn from commonly available Italian market produce.

Every meal includes extra virgin olive oil and vegetable broth — always correct for the age, always in the right quantity.

The app installs on the parent's phone home screen like a native app. The full month's plan is cached for offline use — because kitchens don't always have WiFi, and parents don't have time to wait for a loading spinner.

---

## What Makes This Different

**Zero-friction access.** Most parenting apps require an account, an onboarding flow, and some form of input before showing you anything useful. BabyMeal Planner's first screen IS the value.

**Pre-generated, not personalised.** Personalisation sounds good until you realize it requires the parent to know enough to configure it correctly. A pre-generated plan built on sound nutritional principles is more trustworthy than a personalized one built on the parent's guesses.

**Opinionated and Italian-contextual.** The app uses vegetables available in Italian supermarkets. It's not trying to serve every market — it's trying to serve Italian parents extremely well. This specificity is a feature, not a limitation.

**PWA, not native app.** No App Store friction. A parent who hears about this app from a friend can be using it in 30 seconds.

---

## Who This Serves

**Primary: First-time Italian parents of 7-month-old babies.** They're in the thick of weaning, anxious about doing it right, and have almost no free time. They want something they can trust and not think about. They're on their phone in the kitchen with one hand free.

**Secondary: Grandparents and babysitters.** Caregivers who look after the baby during the day need the same information — what to cook, how much, what's already been given today.

---

## Success Criteria

**User success signals:**
- Parent opens the app daily (not just once)
- Parent reaches the meal detail view consistently (i.e., actually uses the plan to cook)
- Low bounce rate on first load — the zero-onboarding bet is working

**Product health signals:**
- 30-day plan perceived as credible and varied (not repetitive) by first users
- Offline access working reliably (no "failed to load" report in feedback)
- PWA install rate > 20% of returning users (indicates value stickiness)

---

## Scope

**In for MVP:**
- Full 30-day pre-generated meal plan (lunch + dinner per day)
- Meal detail view with ingredient quantities
- Italian market vegetable pool
- PWA with offline support (service worker)
- Mobile-first UI

**Explicitly out:**
- User accounts, personalization, or plan customization
- Allergen filtering or dietary restrictions
- Age-adaptive plans (8+ months)
- Shopping lists or push notifications
- Multi-language support

---

## Vision

If the core assumption holds — that parents want a trusted plan more than they want a configurable one — the natural evolution is a companion for the entire weaning journey: 7 months, 8 months, 9 months, each phase with its own plan, introducing new textures and foods progressively.

Beyond age expansion, the ingredient database and variety engine built for this MVP become the foundation for a richer product: seasonal plan updates, regional ingredient variants, and eventually paediatric dietitian-reviewed content to elevate trust from "seems right" to "clinically endorsed."

The goal is to become the app Italian parents install before the baby is even born.
