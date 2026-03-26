---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]
inputDocuments:
  - _bmad-output/planning-artifacts/prd-babymeal-planner.md
  - _bmad-output/planning-artifacts/product-brief-babymeal-planner.md
workflowType: 'architecture'
project_name: 'babymeal-planner'
user_name: 'sara'
date: '2026-03-25'
status: 'complete'
completedAt: '2026-03-25'
---

# Architecture Decision Document — BabyMeal Planner

---

## 1. Project Context Analysis

### Functional Requirements Summary

| ID | Requirement | Complexity |
|----|-------------|------------|
| FR1 | Meal generation engine (30-day plan from rules + data) | Medium |
| FR2 | Monthly calendar interface with day-level drill-down | Low |
| FR3 | Meal detail view (ingredients + quantities) | Low |
| FR4 | Static data storage (ingredients, rules, templates) | Low |

### Non-Functional Requirements

| Requirement | Constraint |
|-------------|------------|
| Platform | PWA — installable, works in browser |
| Offline access | Full 30-day plan via service worker cache |
| Performance | Instant plan load (pre-generated, no computation on demand) |
| UI | Mobile-first, one-handed usability |
| Deployment | Self-hosted, Docker Compose, environment variable support |

### Project Scale Assessment

- **Complexity:** Low — read-only display of pre-generated static data
- **Domain:** Full-stack PWA with REST API backend
- **Cross-cutting concerns:** Offline caching, PWA manifest, meal generation algorithm, data consistency rules
- **Team:** Solo developer

---

## 2. Core Architectural Decisions

### 2.1 Monorepo Structure

**Decision:** Single monorepo with `frontend/` and `backend/` subdirectories at project root.

**Rationale:** Solo developer, shared TypeScript types, single Docker Compose file, easier cross-cutting concerns. No need for a full monorepo tool (Nx/Turborepo) — plain npm workspaces suffice.

### 2.2 Frontend — SvelteKit + PWA

**Decision:** SvelteKit with `@sveltejs/adapter-node`, TypeScript, `vite-plugin-pwa` for service worker.

| Attribute | Value |
|-----------|-------|
| Framework | SvelteKit 2.x |
| Language | TypeScript 5.x |
| Adapter | `@sveltejs/adapter-node` |
| PWA | `vite-plugin-pwa` |
| Styling | CSS custom properties (no framework — keep it lean for MVP) |
| Testing (unit) | Vitest + `@testing-library/svelte` |
| Testing (e2e) | Playwright |
| Linting | ESLint + Prettier |

**Rationale:** SvelteKit is the canonical Svelte full-stack framework. `adapter-node` produces a standalone Node.js server runnable in Docker. `vite-plugin-pwa` handles service worker generation, manifest, and precaching with minimal config.

### 2.3 Backend — Node.js + Fastify + TypeScript

**Decision:** Dedicated Fastify API service, TypeScript, JSON file data store.

| Attribute | Value |
|-----------|-------|
| Runtime | Node.js 22 LTS |
| Framework | Fastify 4.x |
| Language | TypeScript 5.x |
| Data store | JSON files (read at startup, held in memory) |
| Testing (unit) | Vitest |
| Testing (e2e/integration) | Fastify's built-in `inject` + Vitest |
| Linting | ESLint + Prettier |

**Rationale:** Fastify is fast, schema-first (JSON Schema validation built-in), and has first-class TypeScript support. Its `inject` method makes integration testing trivial without needing Supertest. The data model is static — a full database is unnecessary overhead for an MVP where the plan is pre-generated. JSON files are version-controllable and trivially replaceable later.

### 2.4 Meal Plan Generation Strategy

**Decision:** Generate the 30-day plan **at server startup** and hold it in memory. Serve it from memory on every request.

**Rationale:**
- No per-request computation cost
- Plan is deterministic for the life of the process
- Restart = fresh plan (acceptable for MVP)
- Avoids persisted-plan complexity (no file writes, no migration headaches)

If a stable, persistent plan is needed in future: serialize to a JSON file and read-before-generate.

### 2.5 Containerization

**Decision:** Docker Compose with two services: `frontend` and `backend`. Frontend proxies `/api/*` requests to backend.

| Service | Port | Image base |
|---------|------|------------|
| `backend` | 3001 (internal) | `node:22-alpine` |
| `frontend` | 3000 (exposed) | `node:22-alpine` |

Environment variables are passed via `.env` file loaded by Docker Compose. An `.env.example` file documents all required vars.

### 2.6 Shared Types

**Decision:** Shared TypeScript types are defined in `backend/src/types/` and re-exported or duplicated in `frontend/src/lib/types.ts`.

**Rationale:** For MVP solo dev, duplication is acceptable and avoids a shared package build step. A shared `packages/types` can be introduced when friction is felt.

---

## 3. API Contract

### Base URL
- Development: `http://localhost:3001`
- Production: Internal Docker network — frontend proxies `/api/*` → `backend:3001`

### Endpoints

#### `GET /api/plan`
Returns the full 30-day meal plan.

**Response 200:**
```json
{
  "generatedAt": "2026-03-25T10:00:00.000Z",
  "totalDays": 30,
  "days": [
    {
      "day": 1,
      "lunch": {
        "id": "meal-d1-lunch",
        "cereal": { "name": "Rice cream", "quantityG": 20 },
        "protein": { "name": "Chicken", "quantityG": 30 },
        "vegetables": [{ "name": "Zucchini", "quantityG": 40 }],
        "oliveOil": { "quantityG": 5 },
        "broth": { "quantityMl": 150 }
      },
      "dinner": {
        "id": "meal-d1-dinner",
        "cereal": { "name": "Oat cream", "quantityG": 20 },
        "protein": { "name": "Lentils", "quantityG": 30 },
        "vegetables": [
          { "name": "Carrot", "quantityG": 30 },
          { "name": "Potato", "quantityG": 20 }
        ],
        "oliveOil": { "quantityG": 5 },
        "broth": { "quantityMl": 150 }
      }
    }
  ]
}
```

#### `GET /api/plan/:day`
Returns a single day (1–30).

**Response 200:** Single `day` object from above.

**Response 400:**
```json
{ "error": { "code": "INVALID_DAY", "message": "Day must be between 1 and 30" } }
```

#### `GET /api/health`
Health check for Docker.

**Response 200:** `{ "status": "ok", "uptime": 123 }`

### Error Response Format (all endpoints)
```json
{
  "error": {
    "code": "SNAKE_CASE_CODE",
    "message": "Human-readable description"
  }
}
```

---

## 4. Data Model (JSON Files)

All data files live in `backend/src/data/`. They are read once at startup.

### `cereals.json`
```json
[
  { "id": "rice", "name": "Rice cream", "defaultQuantityG": 20 },
  { "id": "oats", "name": "Oat cream", "defaultQuantityG": 20 },
  { "id": "corn", "name": "Corn cream", "defaultQuantityG": 20 },
  { "id": "semolina", "name": "Semolina", "defaultQuantityG": 20 },
  { "id": "mixed", "name": "Mixed grain cream", "defaultQuantityG": 20 }
]
```

### `proteins.json`
```json
[
  { "id": "chicken", "name": "Chicken", "defaultQuantityG": 30, "maxPerWeek": 3, "type": "meat" },
  { "id": "turkey", "name": "Turkey", "defaultQuantityG": 30, "maxPerWeek": 3, "type": "meat" },
  { "id": "fish", "name": "Fish", "defaultQuantityG": 30, "maxPerWeek": 2, "type": "fish" },
  { "id": "lentils", "name": "Lentils", "defaultQuantityG": 30, "maxPerWeek": null, "type": "legume" },
  { "id": "peas", "name": "Peas", "defaultQuantityG": 30, "maxPerWeek": null, "type": "legume" },
  { "id": "green_beans", "name": "Green beans", "defaultQuantityG": 30, "maxPerWeek": null, "type": "legume" },
  { "id": "cheese", "name": "Cheese", "defaultQuantityG": 20, "maxPerWeek": 2, "type": "dairy" },
  { "id": "eggs", "name": "Eggs", "defaultQuantityG": 30, "maxPerWeek": 1, "type": "egg" }
]
```

### `vegetables.json`
```json
[
  { "id": "zucchini", "name": "Zucchini", "defaultQuantityG": 40 },
  { "id": "carrot", "name": "Carrot", "defaultQuantityG": 30 },
  { "id": "potato", "name": "Potato", "defaultQuantityG": 30 },
  { "id": "pumpkin", "name": "Pumpkin", "defaultQuantityG": 40 },
  { "id": "spinach", "name": "Spinach", "defaultQuantityG": 30 },
  { "id": "fennel", "name": "Fennel", "defaultQuantityG": 30 },
  { "id": "leek", "name": "Leek", "defaultQuantityG": 30 },
  { "id": "cauliflower", "name": "Cauliflower", "defaultQuantityG": 35 },
  { "id": "onion", "name": "Onion", "defaultQuantityG": 20 },
  { "id": "beet", "name": "Beet", "defaultQuantityG": 30 },
  { "id": "sweet_potato", "name": "Sweet potato", "defaultQuantityG": 35 },
  { "id": "celery", "name": "Celery", "defaultQuantityG": 20 },
  { "id": "broccoli", "name": "Broccoli", "defaultQuantityG": 35 }
]
```

### `rules.json`
```json
{
  "fixedIngredients": {
    "oliveOilG": 5,
    "brothMl": 150
  },
  "constraints": {
    "noDuplicateProteinInDay": true,
    "noDuplicateCerealInDay": true,
    "maxVegetablesPerMeal": 2
  }
}
```

---

## 5. Implementation Patterns & Consistency Rules

### 5.1 Naming Conventions

| Concern | Convention | Example |
|---------|------------|---------|
| Files (TS/Svelte) | camelCase for TS, PascalCase for Svelte components | `mealGenerator.ts`, `MealDetail.svelte` |
| Directories | kebab-case | `meal-detail/` |
| API routes | kebab-case, plural nouns | `/api/plan`, `/api/meals/:id` |
| JSON fields | camelCase | `"quantityG"`, `"generatedAt"` |
| DB/data IDs | snake_case | `"green_beans"`, `"sweet_potato"` |
| Environment variables | UPPER_SNAKE_CASE | `API_PORT`, `FRONTEND_PORT` |
| TypeScript interfaces | PascalCase, no `I` prefix | `Meal`, `PlanDay`, `Ingredient` |
| Test files | co-located for unit (`*.test.ts`), separate dir for e2e |  |

### 5.2 API Response Standards

- All successful responses: direct object or array (no wrapper envelope unless pagination needed)
- All error responses: `{ "error": { "code": string, "message": string } }`
- HTTP status codes: 200 OK, 400 Bad Request, 404 Not Found, 500 Internal Server Error
- Dates: ISO 8601 strings everywhere (`"2026-03-25T10:00:00.000Z"`)
- Quantities: always numbers, never strings

### 5.3 State Management (Frontend)

- No global state store for MVP — SvelteKit load functions + page data
- Plan data fetched once in root `+layout.ts` load function and passed as props
- Service worker caches the API response; no client-side re-fetching needed
- Svelte stores only for transient UI state (e.g., selected day)

### 5.4 Error Handling

- Backend: Fastify error handler plugin catches all thrown errors, formats them into the standard error envelope
- Frontend: `+error.svelte` page for route-level errors; inline error messages for API failures
- Never expose stack traces to the client

### 5.5 Environment Variables

All environment variables documented in `.env.example` at root and in each service directory:

| Variable | Service | Default | Description |
|----------|---------|---------|-------------|
| `API_PORT` | backend | `3001` | Port the Fastify server listens on |
| `FRONTEND_PORT` | frontend | `3000` | Port the SvelteKit server listens on |
| `PUBLIC_API_URL` | frontend | `http://localhost:3001` | Backend URL used by the SvelteKit server (SSR) |
| `PUBLIC_API_BASE` | frontend | `/api` | API base path for client-side fetch (proxied) |
| `NODE_ENV` | both | `development` | `development` or `production` |

### 5.6 Testing Conventions

- **Unit tests (Vitest):** co-located with source files as `*.test.ts`
- **Component tests (Vitest + Testing Library):** in `frontend/src/` as `*.test.ts` alongside components
- **E2E tests (Playwright):** in `frontend/e2e/` directory
- **API integration tests (Fastify inject):** in `backend/src/` as `*.test.ts`
- Test utilities/fixtures in `tests/fixtures/` within each service

---

## 6. Project Structure

```
babymeal-planner/                  ← project root (this workspace)
├── .env                           ← local env (gitignored)
├── .env.example                   ← documented env template
├── .gitignore
├── docker-compose.yml
├── docker-compose.override.yml    ← dev overrides (volume mounts)
├── README.md
│
├── backend/
│   ├── Dockerfile
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env.example
│   ├── vitest.config.ts
│   └── src/
│       ├── index.ts               ← entry point, starts Fastify server
│       ├── app.ts                 ← Fastify app factory (testable, used by inject)
│       ├── config.ts              ← env var loading and validation
│       ├── data/
│       │   ├── cereals.json
│       │   ├── proteins.json
│       │   ├── vegetables.json
│       │   └── rules.json
│       ├── routes/
│       │   ├── index.ts           ← router aggregator
│       │   ├── plan.ts            ← GET /api/plan, GET /api/plan/:day
│       │   └── health.ts          ← GET /api/health
│       ├── services/
│       │   ├── planGenerator.ts   ← 30-day meal plan generation engine
│       │   ├── planGenerator.test.ts
│       │   ├── dataLoader.ts      ← reads and validates JSON data files
│       │   └── dataLoader.test.ts
│       ├── plugins/
│       │   └── errorHandler.ts    ← Fastify error handler plugin
│       └── types/
│           └── index.ts           ← Meal, PlanDay, Ingredient, etc.
│
├── frontend/
│   ├── Dockerfile
│   ├── package.json
│   ├── svelte.config.js           ← adapter-node config
│   ├── vite.config.ts             ← vite-plugin-pwa config
│   ├── tsconfig.json
│   ├── .env.example
│   ├── playwright.config.ts
│   ├── static/
│   │   ├── manifest.webmanifest
│   │   ├── favicon.ico
│   │   └── icons/                 ← PWA icons (192x192, 512x512)
│   ├── src/
│   │   ├── app.html               ← HTML shell
│   │   ├── app.css                ← global styles / CSS custom properties
│   │   ├── service-worker.ts      ← custom SW additions (vite-plugin-pwa base)
│   │   ├── lib/
│   │   │   ├── api.ts             ← fetch wrapper for backend API
│   │   │   ├── api.test.ts
│   │   │   ├── types.ts           ← mirrors backend types
│   │   │   └── utils.ts           ← date helpers, formatting
│   │   ├── routes/
│   │   │   ├── +layout.ts         ← loads full plan once, caches in page data
│   │   │   ├── +layout.svelte     ← app shell, nav
│   │   │   ├── +page.svelte       ← monthly calendar view (day grid)
│   │   │   ├── +error.svelte      ← error boundary page
│   │   │   ├── api/
│   │   │   │   └── [...path]/
│   │   │   │       └── +server.ts ← catch-all proxy: forwards /api/* → backend:3001
│   │   │   └── day/[day]/
│   │   │       ├── +page.ts       ← load function for single day
│   │   │       └── +page.svelte   ← day detail: lunch + dinner cards
│   │   └── components/
│   │       ├── CalendarGrid.svelte      ← 30-day grid
│   │       ├── CalendarGrid.test.ts
│   │       ├── DayCell.svelte           ← single day tile in grid
│   │       ├── DayCell.test.ts
│   │       ├── MealCard.svelte          ← lunch/dinner ingredient breakdown
│   │       └── MealCard.test.ts
│   └── e2e/
│       ├── calendar.spec.ts       ← views full calendar, navigates to day
│       └── meal-detail.spec.ts    ← checks ingredient list renders correctly
│
├── _bmad-output/                  ← planning artifacts (this file)
├── _bmad/                         ← bmad config
└── docs/                          ← project knowledge base
```

### Component Responsibilities

| Component | Responsibility | Does NOT do |
|-----------|---------------|-------------|
| `planGenerator.ts` | Apply variety rules, build 30-day plan from data | Serve HTTP, read files |
| `dataLoader.ts` | Read + validate JSON data files at startup | Generate plans |
| `plan.ts` route | Accept request, delegate to in-memory plan, format response | Business logic |
| `+layout.ts` | Fetch plan from API once, inject into page data | Display |
| `CalendarGrid.svelte` | Render 30-day grid, handle day selection | Fetch data |
| `MealCard.svelte` | Render ingredient list for one meal | Navigation |

---

## 7. Docker Compose Architecture

```yaml
# docker-compose.yml (production)
services:
  backend:
    build: ./backend
    environment:
      - NODE_ENV=production
      - API_PORT=${API_PORT:-3001}
    env_file: .env
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3001/api/health"]
      interval: 30s
      timeout: 5s
      retries: 3

  frontend:
    build: ./frontend
    ports:
      - "${FRONTEND_PORT:-3000}:3000"
    environment:
      - NODE_ENV=production
      - PUBLIC_API_URL=http://backend:${API_PORT:-3001}
    env_file: .env
    depends_on:
      backend:
        condition: service_healthy
```

**API proxy:** The frontend container handles `/api/*` forwarding via a SvelteKit catch-all server route at `src/routes/api/[...path]/+server.ts`. This route runs on the SvelteKit Node server (SSR context), where it forwards the request to `http://backend:${API_PORT}` using the internal Docker network, then streams the response back to the client. The backend is NOT exposed to the host — only port 3000 (frontend) is published. Client-side `fetch('/api/plan')` hits the SvelteKit server, which proxies internally; this works seamlessly in both SSR and client navigation contexts.

**Development overrides (`docker-compose.override.yml`):** Docker Compose automatically merges this file in development (`docker compose up` without `--file`). It mounts source directories as volumes for hot reload in both services:
```yaml
# docker-compose.override.yml (development — not committed, generated from template)
services:
  backend:
    volumes:
      - ./backend/src:/app/src
    command: npm run dev
  frontend:
    volumes:
      - ./frontend/src:/app/src
      - ./frontend/static:/app/static
    command: npm run dev
```
The production `docker-compose.yml` has no volume mounts — images are self-contained.

---

## 8. Architecture Validation

### Requirements Coverage

| FR | Architectural Support |
|----|----------------------|
| FR1 Meal generation engine | `planGenerator.ts` + JSON data files + in-memory plan |
| FR2 Calendar interface | `CalendarGrid.svelte` + `+page.svelte` route |
| FR3 Meal detail view | `day/[day]/+page.svelte` + `MealCard.svelte` |
| FR4 Data storage | JSON files in `backend/src/data/` |

| NFR | Architectural Support |
|-----|----------------------|
| PWA | `vite-plugin-pwa` + `manifest.webmanifest` + service worker |
| Offline | Service worker precaches `/api/plan` response on install |
| Instant load | Plan pre-generated at startup, served from memory |
| Mobile-first | SvelteKit responsive routes, CSS mobile-first breakpoints |
| Self-hosted | Docker Compose, adapter-node, no cloud dependencies |
| Env vars | `.env` + Docker Compose `env_file`, all vars documented in `.env.example` |

### Technology Compatibility

- SvelteKit 2 + Vite 5 + `vite-plugin-pwa` ✅ (well-supported combination)
- `@sveltejs/adapter-node` + Docker (Node 22 Alpine) ✅
- Fastify 4 + TypeScript 5 + Vitest ✅
- Playwright + SvelteKit e2e ✅ (official recommendation)
- Fastify `inject` + Vitest for API integration ✅ (no extra dependencies)

### Known Trade-offs

| Trade-off | Decision | Acceptable Because |
|-----------|----------|--------------------|
| Plan regenerated on restart | Acceptable for MVP | No user accounts, no plan persistence needed |
| Shared types duplicated | Acceptable for MVP | Avoids monorepo tooling complexity for solo dev |
| No auth/rate-limiting | Acceptable for MVP | Read-only public data, no sensitive information |
| CSS custom properties, no framework | Keeps bundle small | Simple UI, no complex component library needed |
| No TLS termination in Docker Compose | **Known gap** — PWA install (A2HS) requires HTTPS in production (except localhost). The provided `docker-compose.yml` terminates plaintext only. For a real self-hosted deployment, a TLS-terminating reverse proxy must sit in front of the frontend service. Recommended approach: add a Caddy or nginx container to the compose stack with automatic HTTPS (Caddy Let's Encrypt) or mount certificates manually. This is out of scope for the MVP local/dev workflow but must be addressed before deploying to a public URL. |
