# BabyMeal Planner

A PWA for generating a 30-day meal plan for 7-month-old babies, using Italian market vegetables and nutritional variety rules.

## Tech Stack

- **Frontend:** SvelteKit 2 + TypeScript + `@sveltejs/adapter-node` + `vite-plugin-pwa`
- **Backend:** Node.js 22 + Fastify 4 + TypeScript
- **Testing:** Vitest (unit + integration), Playwright (E2E)
- **Deployment:** Docker Compose

## Project Structure

```
babymeal-planner/
├── backend/        # Fastify API — generates and serves the meal plan
├── frontend/       # SvelteKit PWA — calendar and meal detail views
├── .env.example    # Document all environment variables here
└── package.json    # npm workspaces root
```

## Local Development

### Prerequisites

- Node.js ≥ 22
- npm ≥ 10

### Setup

```bash
cp .env.example .env
npm install          # installs both workspaces
```

### Run services

```bash
# In separate terminals:
npm run dev:backend   # http://localhost:4001
npm run dev:frontend  # http://localhost:3000
```

### Tests

```bash
npm run test                        # all unit + integration tests (Vitest)
cd frontend && npx playwright test  # E2E tests (requires dev server running)
```

## Environment Variables

See `.env.example` for the full list with descriptions.

| Variable          | Service  | Default                 | Notes                                    |
|-------------------|----------|-------------------------|------------------------------------------|
| `API_PORT`        | backend  | `4001`                  | Fastify listen port                      |
| `FRONTEND_PORT`   | frontend | `3000`                  | SvelteKit listen port                    |
| `API_URL`         | frontend | `http://localhost:4001` | Server-only — never read by browser      |
| `PUBLIC_API_BASE` | frontend | `/api`                  | Client-side API prefix (proxied)         |
| `NODE_ENV`        | both     | `development`           | `development` or `production`            |

## Docker

```bash
docker compose up --build    # production (docker-compose.yml only)
docker compose up            # development (auto-merges docker-compose.override.yml)
```
