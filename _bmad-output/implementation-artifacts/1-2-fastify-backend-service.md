---
id: story-1-2
title: 'Story 1.2: Set Up Fastify Backend Service'
epic: 'Epic 1: Project Bootstrap'
status: done
completedAt: '2026-03-25'
---

## Files Created

- `backend/package.json` — Fastify 4, @fastify/cors, TypeScript 5, Vitest, tsx devServer
- `backend/tsconfig.json` — NodeNext modules, ES2022, strict
- `backend/vitest.config.ts` — test runner config
- `backend/.env.example` — API_PORT, NODE_ENV
- `backend/eslint.config.js` — flat config with @typescript-eslint
- `backend/.prettierrc` — single quote, 100 printWidth
- `backend/src/config.ts` — loads + validates API_PORT from process.env
- `backend/src/config.test.ts` — 5 unit tests for config loading
- `backend/src/plugins/errorHandler.ts` — Fastify error handler, no stack traces
- `backend/src/routes/health.ts` — GET /api/health → { status, uptime }
- `backend/src/routes/health.test.ts` — inject-based integration test
- `backend/src/routes/index.ts` — route aggregator
- `backend/src/app.ts` — Fastify app factory (testable)
- `backend/src/index.ts` — entry point

## AC Verification

- [x] Fastify server starts on API_PORT
- [x] GET /api/health returns { status: "ok", uptime: number }
- [x] Error handler returns { error: { code, message } }, no stack traces
- [x] CORS registered with correct localhost:3000 origin in dev
- [x] All tests in health.test.ts and config.test.ts passing
- [x] `npm run dev` starts with tsx watch
- [x] `npm run build` compiles to dist/
