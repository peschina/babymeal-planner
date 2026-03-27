import type { FastifyPluginAsync } from 'fastify';
import type { MealPlan, PlanDay } from '../types/index.js';

export function planRoutes(plan: MealPlan): FastifyPluginAsync {
  return async function (app) {
    app.get('/api/plan', async (_request, reply) => {
      return reply.send(plan);
    });

    app.get<{ Params: { day: string } }>('/api/plan/:day', async (request, reply) => {
      const dayNum = parseInt(request.params.day, 10);

      if (isNaN(dayNum) || dayNum < 1 || dayNum > 30) {
        return reply.status(400).send({
          error: {
            code: 'INVALID_DAY',
            message: 'Day must be between 1 and 30',
          },
        });
      }

      const dayData = plan.days.find((d) => d.day === dayNum) as PlanDay;
      return reply.send(dayData);
    });
  };
}
