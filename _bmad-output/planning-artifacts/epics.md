---
stepsCompleted: [1, 2, 3, 4]
inputDocuments:
  - _bmad-output/planning-artifacts/prd-babymeal-planner.md
  - _bmad-output/planning-artifacts/architecture.md
project_name: babymeal-planner
status: complete
completedAt: '2026-03-25'
---

# BabyMeal Planner — Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for BabyMeal Planner, decomposing requirements from the PRD and Architecture into implementable, sequentially executable stories with acceptance criteria and test scenarios.

---

## Requirements Inventory

### Functional Requirements

- **FR1:** Generate a full 30-day meal plan based on nutritional rules, variety constraints, fixed inclusion of olive oil and broth, and Italian market vegetables
- **FR2:** Display meals by day and meal slot (lunch/dinner) in a monthly calendar view with day-level drill-down
- **FR3:** Show structured breakdown of ingredients and quantities per meal
- **FR4:** Store meal templates, ingredient database, and nutritional rules (JSON files)

### Non-Functional Requirements

- **NFR1:** PWA — installable on mobile home screen, works in browser
- **NFR2:** Offline access — full 30-day plan accessible without internet via service worker
- **NFR3:** Performance — instant load of monthly plan (pre-generated, no on-demand computation)
- **NFR4:** Mobile-first UI — one-handed usability, sleep-deprived parent friendly
- **NFR5:** Self-hosted — Docker Compose deployment with environment variable support

### Additional Requirements (from Architecture)

- **ARCH1:** Monorepo with `frontend/` and `backend/` subdirectories, npm workspaces
- **ARCH2:** Backend: Node.js 22 + Fastify 4 + TypeScript 5, Vitest for tests
- **ARCH3:** Frontend: SvelteKit 2 + `@sveltejs/adapter-node` + TypeScript 5, Vitest + Playwright
- **ARCH4:** `vite-plugin-pwa` + `manifest.webmanifest` + service worker for offline
- **ARCH5:** Docker Compose with `backend` (internal) and `frontend` (port 3000 exposed) services
- **ARCH6:** JSON data files: `cereals.json`, `proteins.json`, `vegetables.json`, `rules.json`
- **ARCH7:** ESLint + Prettier configured in both services
- **ARCH8:** `.env.example` at root and per-service documenting all env vars

### FR Coverage Map

| FR | Epic |
|----|------|
| FR1 | Epic 2 — Meal Generation Engine |
| FR2 | Epic 3 — Calendar & Meal Display |
| FR3 | Epic 3 — Calendar & Meal Display |
| FR4 | Epic 1 — Project Foundation & Data Infrastructure |
| NFR1 | Epic 4 — PWA & Offline Support |
| NFR2 | Epic 4 — PWA & Offline Support |
| NFR3 | Epic 2 (generation strategy) + Epic 3 (plan loading) |
| NFR4 | Epic 3 — Calendar & Meal Display |
| NFR5 | Epic 5 — Containerization & Deployment |
| ARCH1–8 | Epic 1 — Project Foundation & Data Infrastructure |

---

## Epic List

### Epic 1: Project Foundation & Data Infrastructure
Set up the full monorepo project skeleton with backend and frontend services, tooling, and ingredient data files. After this epic, a developer can run both services locally with `npm run dev`.
**FRs covered:** FR4, ARCH1–8

### Epic 2: Meal Generation Engine
Implement the meal generation algorithm that produces a valid, nutritionally varied 30-day plan and exposes it via REST API. After this epic, `GET /api/plan` returns a complete 30-day plan.
**FRs covered:** FR1, NFR3

### Epic 3: Calendar & Meal Display
Build the SvelteKit frontend with the monthly calendar view and meal detail pages, fully integrated with the backend API. After this epic, a user can open the app, browse the 30-day calendar, and view meal ingredients.
**FRs covered:** FR2, FR3, NFR4

### Epic 4: PWA & Offline Support
Add PWA manifest, icons, and service worker to make the app installable and fully functional offline. After this epic, the app works without an internet connection after first load.
**FRs covered:** NFR1, NFR2

### Epic 5: Containerization & Deployment
Create Dockerfiles for both services and a Docker Compose configuration for production deployment. After this epic, `docker compose up` brings up the full application.
**FRs covered:** NFR5

---

## Epic 1: Project Foundation & Data Infrastructure

**Goal:** Initialize the monorepo, configure both services with TypeScript, linting, and testing tooling, and populate all JSON data files. Establishes the skeleton every subsequent epic builds on.

---

### Story 1.1: Initialize Monorepo Project Structure

As a developer,
I want a properly structured monorepo with `frontend/` and `backend/` workspaces,
So that both services share a consistent project root and can be managed together.

**Acceptance Criteria:**

**Given** an empty project directory  
**When** the developer runs `npm install` at the root  
**Then** both `frontend/` and `backend/` `node_modules` are installed via npm workspaces

**Given** the monorepo is set up  
**When** the developer inspects the root  
**Then** a `.gitignore` exists ignoring `node_modules`, `.env`, build artifacts, and PWA dist  
**And** a `README.md` exists with basic project description and local setup instructions  
**And** a `.env.example` at root documents `API_PORT`, `FRONTEND_PORT`, `API_URL`, `PUBLIC_API_BASE`, `NODE_ENV`

**Test Scenarios:**

- **Unit:** N/A (infrastructure story)
- **Integration:** N/A
- **E2E:** N/A
- **Manual check:** `npm install` from root completes without errors; both service directories resolve their dependencies

---

### Story 1.2: Set Up Fastify Backend Service

As a developer,
I want a runnable Fastify + TypeScript backend service with Vitest and ESLint configured,
So that I can start implementing API routes with type safety and testability from day one.

**Acceptance Criteria:**

**Given** the backend service is set up  
**When** the developer runs `npm run dev` inside `backend/`  
**Then** the Fastify server starts on `$API_PORT` (default 3001) without errors  
**And** `GET /api/health` returns `{ "status": "ok", "uptime": <number> }` with HTTP 200

**Given** an unknown route is requested  
**When** `GET /api/nonexistent` is called  
**Then** the response is HTTP 404 with `{ "error": { "code": "NOT_FOUND", "message": "..." } }`

**Given** a server-side error occurs  
**When** an unhandled exception is thrown in any route handler  
**Then** the error handler plugin catches it and returns HTTP 500 with the standard error envelope  
**And** the stack trace is NOT included in the response body

**Given** the backend is configured  
**When** the developer runs `npm run lint` inside `backend/`  
**Then** ESLint + Prettier report no errors on the initial scaffold

**Given** a browser-based tool (e.g. a dev REST client running in the browser at `:3000`) calls `http://localhost:3001/api/plan` directly  
**When** the browser sends a cross-origin request to `:3001`  
**Then** `@fastify/cors` responds with `Access-Control-Allow-Origin: http://localhost:3000`  
**And** the request succeeds in browser context

> Note: SSR `fetch` calls from the SvelteKit Node process to Fastify are server-to-server and not subject to browser CORS enforcement. `@fastify/cors` is a safety net for direct browser-to-backend access, not a requirement for the normal proxy flow.

**Given** `@fastify/cors` is configured  
**When** a browser request arrives from an origin other than `localhost:3000` in development  
**Then** CORS headers do NOT grant access (restrictive `origin` config)

**Test Scenarios:**

- **Unit (Vitest):**
  - `config.ts`: throws if required env var is missing; returns correct defaults when vars are set
- **Integration (Fastify inject + Vitest):**
  - `GET /api/health` → 200 with `{ status: "ok", uptime: number }`
  - `GET /api/unknown` → 404 with error envelope
  - Simulated thrown error in handler → 500 with error envelope, no stack trace in body
  - CORS preflight from `http://localhost:3000` → response includes `Access-Control-Allow-Origin: http://localhost:3000`
- **E2E:** N/A

---

### Story 1.3: Create Ingredient Data Files and Data Loader

As a developer,
I want all ingredient and rules JSON data files created and a validated data loader,
So that the meal generation engine has a reliable, typed data source.

**Acceptance Criteria:**

**Given** the backend service starts  
**When** `dataLoader.ts` runs  
**Then** it reads `cereals.json` (5 items), `proteins.json` (8 items), `vegetables.json` (13 items), and `rules.json` from `backend/src/data/`  
**And** all items are validated against their TypeScript types  
**And** the loaded data is available in memory for the lifetime of the process

**Given** a data file is malformed or missing  
**When** the server attempts to start  
**Then** the process exits with a descriptive error message identifying which file failed

**Given** the data files are loaded  
**When** the developer inspects the proteins list  
**Then** all 8 proteins are present: chicken, turkey, fish, lentils, peas, green beans, cheese, eggs  
**And** each protein has: `id`, `name`, `defaultQuantityG`, `maxPerWeek` (null or number), `type`

**Test Scenarios:**

- **Unit (Vitest):**
  - `dataLoader.loadCereals()` → returns array of 5 cereal objects with correct shape
  - `dataLoader.loadProteins()` → returns array of 8 protein objects
  - `dataLoader.loadVegetables()` → returns array of 13 vegetable objects
  - `dataLoader.loadRules()` → returns rules object with `fixedIngredients` and `constraints`
  - Passing a path to a malformed JSON file → throws with descriptive error
  - Passing a path to a missing file → throws with descriptive error
- **Integration:** N/A (no HTTP surface yet)
- **E2E:** N/A

---

### Story 1.4: Set Up SvelteKit Frontend Service

As a developer,
I want a runnable SvelteKit + TypeScript frontend service with Vitest, Playwright, and ESLint configured,
So that I can build UI components with type safety, unit tests, and e2e tests from day one.

**Acceptance Criteria:**

**Given** the frontend service is set up  
**When** the developer runs `npm run dev` inside `frontend/`  
**Then** the SvelteKit dev server starts on `$FRONTEND_PORT` (default 3000) without errors  
**And** the root `+page.svelte` renders a placeholder "BabyMeal Planner" page

**Given** the frontend dev server is running with `API_URL` set  
**When** `GET /api/plan` is requested from a browser  
**Then** `src/routes/api/[...path]/+server.ts` intercepts the request on the SvelteKit Node server and proxies it to the URL specified in `API_URL` (e.g. `http://localhost:3001/api/plan`)  
**And** the response is forwarded correctly with the original HTTP status and body

**Given** the proxy route exists  
**When** the frontend is running in Docker behind the compose network  
**Then** the proxy forwards to the host specified in `API_URL` (e.g. `http://backend:${API_PORT}`) via the internal Docker network  
**And** the backend port is NOT required to be published to the host

**Given** the frontend is built  
**When** the developer runs `npm run build` inside `frontend/`  
**Then** the build completes without TypeScript or Vite errors  
**And** the `build/` output contains a node-compatible server entry

**Given** the frontend is configured  
**When** the developer runs `npm run lint`  
**Then** ESLint + Prettier report no errors on the scaffold

**Given** Playwright is configured  
**When** the developer runs `npx playwright test`  
**Then** a smoke test confirming the app title is visible passes

**Test Scenarios:**

- **Unit (Vitest + @testing-library/svelte):**
  - Placeholder `+page.svelte` renders without errors
- **Integration:** N/A at this stage
- **E2E (Playwright):**
  - `GET /` → page title is "BabyMeal Planner"

---

## Epic 2: Meal Generation Engine

**Goal:** Implement the complete meal generation algorithm and expose the 30-day plan via REST API. The algorithm must enforce all variety constraints and produce a nutritionally sound plan across all 30 days.

---

### Story 2.1: Define Shared TypeScript Types

As a developer,
I want all shared domain types defined in `backend/src/types/index.ts` and mirrored in `frontend/src/lib/types.ts`,
So that the entire codebase works from a single, consistent type vocabulary.

**Acceptance Criteria:**

**Given** the types file exists  
**When** the developer inspects `backend/src/types/index.ts`  
**Then** the following interfaces are exported: `Cereal`, `Protein`, `Vegetable`, `Rules`, `Ingredient`, `Meal`, `PlanDay`, `MealPlan`

**Given** `Meal` is defined  
**When** inspected  
**Then** it contains: `id: string`, `cereal: Ingredient`, `protein: Ingredient`, `vegetables: Ingredient[]`, `oliveOil: { quantityG: number }`, `broth: { quantityMl: number }`

**Given** `MealPlan` is defined  
**When** inspected  
**Then** it contains: `generatedAt: string`, `totalDays: number`, `days: PlanDay[]`

**Given** `frontend/src/lib/types.ts` exists  
**When** inspected  
**Then** it exports the same `Meal`, `PlanDay`, `MealPlan` interfaces matching the backend definitions exactly

**Test Scenarios:**

- **Unit (Vitest):** TypeScript compilation (`tsc --noEmit`) passes without errors on both `backend/` and `frontend/`
- **Integration:** N/A
- **E2E:** N/A

---

### Story 2.2: Implement Variety Constraint Engine

As a developer,
I want a constraint engine that enforces all variety rules when selecting meal ingredients,
So that the generated 30-day plan is nutritionally varied and rule-compliant.

**Acceptance Criteria:**

**Given** the constraint engine receives a weekly protein usage tracker  
**When** fish has already been used 2 times that week  
**Then** fish is excluded from the candidate pool for that week

**Given** the constraint engine is building a single day's meals  
**When** lunch has already assigned chicken as protein  
**Then** chicken is excluded from dinner's protein candidates for that day

**Given** the constraint engine is building a single day's meals  
**When** lunch has already assigned rice as cereal  
**Then** rice is excluded from dinner's cereal candidates for that day

**Given** eggs have already been used 1 time that week  
**When** the engine selects proteins for the next meal  
**Then** eggs are excluded from the candidate pool for that week (maxPerWeek: 1)

**Given** a meal is being composed  
**When** vegetables are selected  
**Then** no more than 2 vegetables are included in that meal (`maxVegetablesPerMeal: 2` from rules.json)

**Given** all variety rules are applied  
**When** the engine runs 1000 random plan generation passes  
**Then** no pass produces a day where lunch and dinner share the same protein  
**And** no pass produces a day where lunch and dinner share the same cereal

**Test Scenarios:**

- **Unit (Vitest):**
  - `filterByWeeklyLimit(candidates, weeklyUsage, protein)` → derives the limit from `protein.maxPerWeek`; excludes protein when its usage count equals `maxPerWeek`
  - `filterByWeeklyLimit([fish], { fish: 2 }, fishProtein)` → returns empty array (fish.maxPerWeek = 2, count = 2)
  - `filterByWeeklyLimit([eggs], { eggs: 1 }, eggsProtein)` → returns empty array (eggs.maxPerWeek = 1, count = 1)
  - `filterByWeeklyLimit([lentils], { lentils: 5 }, lentilsProtein)` → returns lentils (lentils.maxPerWeek = null, no limit)
  - `excludeUsed(proteins, 'chicken')` → returns array without chicken
  - `selectVegetables(vegetables, 2)` → always returns 1 or 2 items, never 0 or 3+
  - Day-level protein uniqueness: running 100 random single-day generations → no day has duplicate protein
  - Day-level cereal uniqueness: running 100 random single-day generations → no day has duplicate cereal
- **Integration:** N/A
- **E2E:** N/A

---

### Story 2.3: Generate 30-Day Meal Plan

As a developer,
I want `planGenerator.ts` to produce a complete, valid 30-day `MealPlan` object at startup,
So that the API can serve it instantly from memory on every request.

**Acceptance Criteria:**

**Given** `planGenerator.generatePlan(data)` is called with loaded data  
**When** it completes  
**Then** it returns a `MealPlan` with exactly 30 `PlanDay` entries  
**And** each `PlanDay` contains a `lunch` and `dinner`, both fully composed `Meal` objects  
**And** every meal includes: one cereal, one protein, 1–2 vegetables, olive oil (5g), broth (150ml)  
**And** all ingredient quantities match the `defaultQuantityG`/`defaultQuantityMl` from data files

**Given** the plan is generated  
**When** weekly protein frequencies are tallied across the 30 days  
**Then** fish appears at most 8 times total (≤2/week across ~4.3 weeks)  
**And** eggs appear at most 5 times total (≤1/week)  
**And** cheese appears at most 9 times total (≤2/week)

**Given** the plan is generated  
**When** any single day is inspected  
**Then** lunch.protein.name ≠ dinner.protein.name  
**And** lunch.cereal.name ≠ dinner.cereal.name

**Given** the data loader fails  
**When** `generatePlan` is called  
**Then** it throws an error with a descriptive message and does NOT return a partial plan

**Test Scenarios:**

- **Unit (Vitest):**
  - `generatePlan(validData)` → returns MealPlan with `totalDays === 30`
  - Every day in returned plan: `lunch.cereal.name !== dinner.cereal.name`
  - Every day in returned plan: `lunch.protein.name !== dinner.protein.name`
  - All meals include `oliveOil.quantityG === 5` and `broth.quantityMl === 150`
  - Fish count across whole plan: `<= 8`
  - Eggs count across whole plan: `<= 5`
  - `generatePlan({})` (missing data) → throws
- **Integration:** N/A (tested via API in next story)
- **E2E:** N/A

---

### Story 2.4: Expose Meal Plan via REST API

As a developer,
I want `GET /api/plan` and `GET /api/plan/:day` endpoints served by Fastify,
So that the frontend can fetch the full plan or a single day's meals.

**Acceptance Criteria:**

**Given** the backend starts  
**When** `GET /api/plan` is called  
**Then** HTTP 200 is returned with a `MealPlan` object matching the API contract  
**And** `totalDays` equals 30  
**And** `generatedAt` is a valid ISO 8601 date string

**Given** the backend starts  
**When** `GET /api/plan/1` is called  
**Then** HTTP 200 is returned with the PlanDay for day 1  
**And** the response contains `day: 1`, `lunch`, and `dinner`

**Given** `GET /api/plan/31` is called  
**When** the route handler processes the request  
**Then** HTTP 400 is returned with `{ "error": { "code": "INVALID_DAY", "message": "Day must be between 1 and 30" } }`

**Given** `GET /api/plan/abc` is called  
**When** the route handler processes the request  
**Then** HTTP 400 is returned with the standard error envelope

**Given** the plan is being served  
**When** `GET /api/plan` is called 10 times sequentially  
**Then** all 10 responses are identical (same in-memory plan, deterministic for process lifetime)

**Test Scenarios:**

- **Unit:** N/A (route logic is thin; business logic covered in Story 2.3)
- **Integration (Fastify inject + Vitest):**
  - `GET /api/plan` → 200, body has `totalDays: 30`, `days.length === 30`
  - `GET /api/plan/1` → 200, body has `day: 1`, `lunch`, `dinner`
  - `GET /api/plan/30` → 200, body has `day: 30`
  - `GET /api/plan/0` → 400 with `INVALID_DAY`
  - `GET /api/plan/31` → 400 with `INVALID_DAY`
  - `GET /api/plan/abc` → 400 with error envelope
  - Two sequential calls to `GET /api/plan` → identical responses
- **E2E:** N/A (frontend integration covered in Epic 3)

---

## Epic 3: Calendar & Meal Display

**Goal:** Build the complete SvelteKit UI — monthly calendar and meal detail views — integrated with the backend API. After this epic, the core user journey is functional end-to-end.

---

### Story 3.1: Implement API Client and Plan Loading

As a developer,
I want a typed API client in `frontend/src/lib/api.ts` and root layout that loads the full plan once,
So that all pages have access to plan data without redundant fetches.

**Acceptance Criteria:**

**Given** the frontend starts  
**When** `+layout.ts` runs its `load()` function  
**Then** `api.getPlan()` is called once and returns a `MealPlan` object  
**And** the plan is available as `data.plan` to all child routes

**Given** the API is unreachable  
**When** `+layout.ts` `load()` fails  
**Then** SvelteKit routes to `+error.svelte` with a user-friendly error message (not a stack trace)

**Given** `api.getPlan()` is called  
**When** inspecting the HTTP request  
**Then** it uses `API_URL` (server-only env var, no `PUBLIC_` prefix) as the base in SSR context  
**And** it uses `PUBLIC_API_BASE` (`/api`) as the base in client-side context (which proxies through SvelteKit)

**Test Scenarios:**

- **Unit (Vitest):**
  - `api.getPlan()` with mocked `fetch` returning valid plan → resolves with `MealPlan`
  - `api.getPlan()` with mocked `fetch` returning 500 → throws with descriptive error
  - `api.getDay(1)` with mocked `fetch` returning valid day → resolves with `PlanDay`
  - `api.getDay(31)` with mocked `fetch` returning 400 → throws with descriptive error
- **Integration:** N/A
- **E2E (Playwright):**
  - App loads at `/` → no console errors, page is not the error page

---

### Story 3.2: Build Monthly Calendar View

As a parent,
I want to see a 30-day calendar grid showing all planned meals,
So that I can understand the full month's plan at a glance and navigate to any day.

**Acceptance Criteria:**

**Given** the app loads at `/`  
**When** the page renders  
**Then** a grid of 30 day cells is displayed  
**And** each cell shows the day number  
**And** each cell shows the protein names for lunch and dinner

**Given** the calendar is rendered  
**When** the parent taps/clicks a day cell  
**Then** they are navigated to `/day/[day]` for that day

**Given** the calendar is rendered on a mobile viewport (375px wide)  
**When** the page is displayed  
**Then** all 30 day cells are visible without horizontal scrolling  
**And** tap targets for each day cell are at least 44×44px

**Given** it is "today" (or day 1 as default for MVP)  
**When** the calendar renders  
**Then** the current day cell is visually highlighted (e.g., different background or border)

**Test Scenarios:**

- **Unit (Vitest + @testing-library/svelte):**
  - `CalendarGrid` renders with 30-item `days` prop → exactly 30 `DayCell` components in DOM
  - `DayCell` renders with `day={5}` prop → displays "5" in the cell
  - `DayCell` renders with `isToday={true}` → has highlighted CSS class
  - `DayCell` click event → emits navigation event with correct day number
- **Integration:** N/A
- **E2E (Playwright):**
  - Navigate to `/` → page contains 30 day cells
  - Click on day 3 cell → URL changes to `/day/3`
  - Viewport 375px: all 30 cells visible, no horizontal scroll

---

### Story 3.3: Build Meal Detail View

As a parent,
I want to view the lunch and dinner details for a specific day,
So that I know exactly what ingredients and quantities to prepare.

**Acceptance Criteria:**

**Given** the parent navigates to `/day/5`  
**When** the page loads  
**Then** two `MealCard` components are displayed — one for lunch and one for dinner  
**And** each card shows the meal label ("Pranzo" / "Cena")  
**And** each card shows the protein name with its quantity in grams  
**And** each card shows the cereal name with its quantity in grams  
**And** each card shows each vegetable name with its quantity in grams  
**And** each card shows olive oil (5g) and broth (150ml)

**Given** the parent is on the day detail page  
**When** they tap the back button  
**Then** they return to the monthly calendar at `/`

**Given** an invalid day is accessed (`/day/99`)  
**When** the page tries to load  
**Then** the error page is shown with a friendly message

**Given** the page is on a mobile viewport  
**When** rendered  
**Then** both meal cards are readable without horizontal scrolling  
**And** quantities include their units (g / ml)

**Test Scenarios:**

- **Unit (Vitest + @testing-library/svelte):**
  - `MealCard` renders with a valid `Meal` prop → protein name and quantity visible in DOM
  - `MealCard` renders with a valid `Meal` prop → cereal name and quantity visible
  - `MealCard` renders with a valid `Meal` prop → "5g" olive oil and "150ml" broth visible
  - `MealCard` renders with 2 vegetables → both vegetable names visible
  - `MealCard` renders with 1 vegetable → one vegetable name visible
- **Integration:** N/A
- **E2E (Playwright):**
  - Navigate to `/day/1` → two meal cards visible (Pranzo + Cena)
  - Each meal card contains at least one ingredient with a gram/ml quantity
  - Navigate to `/day/1` → back navigation returns to `/`
  - Navigate to `/day/99` → error page shown

---

## Epic 4: PWA & Offline Support

**Goal:** Make the app a fully installable PWA that works offline after first load, meeting NFR1 and NFR2.

---

### Story 4.1: Add PWA Manifest and Icons

As a parent,
I want to install BabyMeal Planner on my phone's home screen,
So that I can open it like a native app without going through the browser.

**Acceptance Criteria:**

**Given** the frontend is built  
**When** the browser inspects `manifest.webmanifest`  
**Then** it contains: `name`, `short_name`, `start_url: "/"`, `display: "standalone"`, `icons` array with at least 192×192 and 512×512 entries  
**And** theme color and background color are set

**Given** the app is opened in Chrome on Android **and served over HTTPS (or localhost in development)**  
**When** the browser evaluates install eligibility  
**Then** an "Add to Home Screen" prompt is offered (installability criteria met)

> Note: Chrome requires a secure context (HTTPS or `localhost`) for the install prompt. In the Docker self-hosted deployment, a TLS-terminating proxy must be present. See Known Trade-offs in architecture.md.

**Given** the app is opened in Safari on iOS  
**When** viewed  
**Then** `<meta name="apple-mobile-web-app-capable">` is set  
**And** the app icon appears correctly after adding to home screen

**Test Scenarios:**

- **Unit:** N/A
- **Integration:** N/A
- **E2E (Playwright):**
  - `GET /manifest.webmanifest` → HTTP 200, `Content-Type: application/manifest+json`
  - Manifest JSON contains `name`, `start_url`, `icons` array with 2+ entries
  - `<link rel="manifest">` present in `<head>` of root HTML

---

### Story 4.2: Implement Service Worker and Offline Caching

As a parent,
I want the monthly meal plan to be available when I have no internet connection,
So that I can check what to cook even in the kitchen without WiFi.

**Acceptance Criteria:**

**Given** the app is loaded online for the first time  
**When** the service worker installs and activates  
**Then** `vite-plugin-pwa` precaches all static build output (HTML, JS, CSS, fonts)  
**And** the `/api/plan` response is cached at runtime via a Workbox `runtimeCaching` entry configured in `vite.config.ts` with a `CacheFirst` strategy targeting the `/api/plan` URL pattern

**Given** the device goes offline after first load  
**When** the parent opens the app  
**Then** the monthly calendar renders correctly without network access  
**And** navigating to any day detail page works correctly offline

**Given** the service worker is active and the device is offline  
**When** a resource that was NOT precached is requested  
**Then** the app does not crash — a graceful fallback is shown

**Given** the app comes back online  
**When** the service worker detects a new version is available  
**Then** the cache is updated on next service worker activation

**Test Scenarios:**

- **Unit:** N/A
- **Integration:** N/A
- **E2E (Playwright):**
  - Load app, then use `page.context().setOffline(true)` → calendar still renders
  - Load app, set offline, navigate to `/day/1` → meal detail still renders
  - Load app, set offline, navigate to `/day/1` → no network error in console
  - Verify service worker is registered: `navigator.serviceWorker.controller` is not null after load

---

## Epic 5: Containerization & Deployment

**Goal:** Package both services into Docker images and wire them together with Docker Compose, enabling a one-command production deployment.

---

### Story 5.1: Backend Dockerfile

As a developer,
I want a production-ready Dockerfile for the backend service,
So that it can be built into a minimal, runnable container image.

**Acceptance Criteria:**

**Given** `backend/Dockerfile` exists  
**When** `docker build -t babymeal-backend ./backend` is run  
**Then** the image builds successfully without errors  
**And** the resulting image is based on `node:22-alpine`  
**And** the image uses a multi-stage build (build stage + production stage)  
**And** `node_modules` in the final image contains only production dependencies

**Given** the backend container is started with `docker run -p 3001:3001 babymeal-backend`  
**When** `GET http://localhost:3001/api/health` is called  
**Then** HTTP 200 is returned with `{ "status": "ok", "uptime": <number> }`

**Given** the container is running  
**When** `API_PORT` env var is set to `3001`  
**Then** the server listens on that port

**Test Scenarios:**

- **Unit:** N/A
- **Integration:** N/A
- **E2E / Manual:**
  - `docker build` exits with code 0
  - `docker run --env API_PORT=3001` → `wget -qO- http://localhost:3001/api/health` → 200

---

### Story 5.2: Frontend Dockerfile

As a developer,
I want a production-ready Dockerfile for the frontend service,
So that it can be built into a container that serves the SvelteKit app.

**Acceptance Criteria:**

**Given** `frontend/Dockerfile` exists  
**When** `docker build -t babymeal-frontend ./frontend` is run  
**Then** the image builds successfully without errors  
**And** the resulting image is based on `node:22-alpine`  
**And** the image uses a multi-stage build

**Given** the frontend container is started with `API_URL=http://backend:3001`  
**When** `GET http://localhost:3000/` is called  
**Then** HTTP 200 is returned with a valid HTML page

> Note: The frontend's root `+layout.ts` performs an SSR fetch to `API_URL` on page load. A standalone `docker run` test with `API_URL=http://backend:3001` requires the backend to be reachable at that address. For isolated frontend build validation, use `API_URL` pointing to a reachable mock or stub endpoint, or run frontend and backend together on a shared user-defined Docker network (`docker network create babymeal && docker run --network babymeal ...`).

**Test Scenarios:**

- **Unit:** N/A
- **Integration:** N/A
- **E2E / Manual:**
  - `docker build` exits with code 0
  - Networked smoke test (frontend + backend on shared network, backend polled until healthy):
    ```sh
    docker network create babymeal
    docker run -d --name backend --network babymeal babymeal-backend
    # wait for backend to be ready (max ~15 s)
    until docker exec backend wget -qO- http://localhost:3001/api/health >/dev/null 2>&1; do sleep 1; done
    docker run -d --name frontend --network babymeal \
      --env API_URL=http://backend:3001 -p 3000:3000 babymeal-frontend
    sleep 2   # allow SvelteKit Node server to start
    wget -qO- http://localhost:3000   # → 200 HTML
    docker rm -f backend frontend && docker network rm babymeal
    ```

---

### Story 5.3: Docker Compose Configuration

As a developer,
I want a `docker-compose.yml` that wires backend and frontend together,
So that `docker compose up` brings up the complete application with a single command.

**Acceptance Criteria:**

**Given** `docker-compose.yml` and a valid `.env` file exist at project root  
**When** `docker compose up --build` is run  
**Then** both `backend` and `frontend` containers start without errors  
**And** the backend health check passes before the frontend starts (via `depends_on: condition: service_healthy`)  
**And** only port 3000 (frontend) is exposed to the host

**Given** the compose stack is running  
**When** `GET http://localhost:3000/` is called from the host  
**Then** HTTP 200 is returned with the BabyMeal Planner app HTML

**Given** the compose stack is running  
**When** `GET http://localhost:3000/api/plan` is called from the browser  
**Then** HTTP 200 is returned with the full meal plan JSON (frontend proxies to backend)

**Given** a `.env.example` file exists at project root  
**When** it is inspected  
**Then** it documents: `API_PORT`, `FRONTEND_PORT`, `API_URL`, `PUBLIC_API_BASE`, `NODE_ENV`

**Given** `docker-compose.override.yml` is committed to the repository  
**When** a developer runs `docker compose up` (no `--file` flag)  
**Then** Docker Compose automatically merges the override file, mounting source volumes and using `npm run dev` commands in both services  
**And** the production workflow uses `docker compose -f docker-compose.yml up` to explicitly exclude the override

**Test Scenarios:**

- **Unit:** N/A
- **Integration:** N/A
- **E2E / Manual:**
  - `docker compose up --build` → both services healthy
  - `curl http://localhost:3000` → 200 HTML
  - `curl http://localhost:3000/api/plan` → 200 JSON with `totalDays: 30`
  - `curl http://localhost:3001` → connection refused (backend not exposed to host)
