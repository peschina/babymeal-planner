import Fastify from 'fastify';
import cors from '@fastify/cors';
import { errorHandler } from './plugins/errorHandler.js';
import { registerRoutes } from './routes/index.js';

export async function buildApp() {
  const app = Fastify({
    logger: {
      level: process.env.NODE_ENV === 'test' ? 'silent' : 'info',
    },
  });

  // CORS — safety net for direct browser-to-backend calls in development.
  // In normal flow the SvelteKit proxy handles all client traffic server-to-server;
  // CORS is irrelevant for those requests. This only applies when a browser
  // directly calls :3001 (e.g. dev tooling, REST clients from :3000).
  await app.register(cors, {
    origin:
      process.env.NODE_ENV === 'production'
        ? false // no browser should reach backend directly in production
        : 'http://localhost:3000',
  });

  await app.register(errorHandler);
  await registerRoutes(app);

  return app;
}
