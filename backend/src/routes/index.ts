import type { FastifyInstance } from 'fastify';
import type { MealPlan } from '../types/index.js';
import { healthRoutes } from './health.js';
import { planRoutes } from './plan.js';

export async function registerRoutes(app: FastifyInstance, plan?: MealPlan): Promise<void> {
  await app.register(healthRoutes);
  if (plan) {
    await app.register(planRoutes(plan));
  }
}
