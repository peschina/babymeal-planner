import type { MealPlan, PlanDay } from './types.js';

/**
 * Resolves the API base URL for the current execution context.
 *
 * - Server-side (SSR / proxy route): uses PUBLIC_API_BASE env var which
 *   SvelteKit injects at build time. Default: '/api'.
 * - The fetch is always sent to a relative path, so in the browser it hits
 *   the SvelteKit proxy route; on the server it also uses the relative path
 *   which SvelteKit internally resolves to the origin.
 */
function apiBase(): string {
  return import.meta.env.PUBLIC_API_BASE ?? '/api';
}

export async function getPlan(fetchFn: typeof fetch = fetch): Promise<MealPlan> {
  const response = await fetchFn(`${apiBase()}/plan`);
  if (!response.ok) {
    throw new Error(`Failed to fetch plan: ${response.status} ${response.statusText}`);
  }
  return response.json() as Promise<MealPlan>;
}

export async function getDay(day: number, fetchFn: typeof fetch = fetch): Promise<PlanDay> {
  const response = await fetchFn(`${apiBase()}/plan/${day}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch day ${day}: ${response.status} ${response.statusText}`);
  }
  return response.json() as Promise<PlanDay>;
}
