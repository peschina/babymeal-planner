---
id: story-1-4
title: 'Story 1.4: SvelteKit Frontend Service'
epic: 'Epic 1: Project Bootstrap'
status: done
completedAt: '2026-03-25'
---

## Files Created

- `frontend/package.json` — SvelteKit 2, adapter-node, vite-plugin-pwa, Vitest, Playwright, @testing-library/svelte
- `frontend/tsconfig.json` — Bundler resolution, strict, no emit
- `frontend/svelte.config.js` — adapter-node with vitePreprocess
- `frontend/vite.config.ts` — vite-plugin-pwa with Workbox runtimeCaching for /api/plan (CacheFirst)
- `frontend/.env.example` — FRONTEND_PORT, API_URL (server-only), PUBLIC_API_BASE
- `frontend/eslint.config.js` — flat config with @typescript-eslint + svelte plugin
- `frontend/.prettierrc` — prettier-plugin-svelte
- `frontend/playwright.config.ts` — Chromium, baseURL from FRONTEND_PORT env
- `frontend/src/app.html` — HTML shell with manifest link
- `frontend/src/app.css` — CSS custom properties, mobile-first reset
- `frontend/src/test-setup.ts` — vitest globals setup placeholder
- `frontend/src/lib/types.ts` — MealPlan, PlanDay, Meal, IngredientPortion
- `frontend/src/lib/api.ts` — getPlan(fetch), getDay(day, fetch) using PUBLIC_API_BASE
- `frontend/src/lib/api.test.ts` — 4 unit tests for api module
- `frontend/src/lib/utils.ts` — formatDay, formatGrams, formatMl
- `frontend/src/routes/+layout.ts` — loads full plan once from API
- `frontend/src/routes/+layout.svelte` — app shell with nav
- `frontend/src/routes/+page.svelte` — 30-day calendar grid placeholder
- `frontend/src/routes/+error.svelte` — error boundary page
- `frontend/src/routes/api/[...path]/+server.ts` — catch-all proxy, reads API_URL from $env/dynamic/private
- `frontend/e2e/smoke.spec.ts` — Playwright smoke: title + heading visible

## AC Verification

- [x] SvelteKit app builds with adapter-node
- [x] Proxy route forwards /api/* to backend via API_URL (server-only)
- [x] vite-plugin-pwa configured with /api/plan runtimeCaching (CacheFirst)
- [x] Vitest unit tests for api.ts
- [x] Playwright smoke test configured
- [x] `npm run dev` starts dev server on FRONTEND_PORT
- [x] `npm run build` compiles to build/
