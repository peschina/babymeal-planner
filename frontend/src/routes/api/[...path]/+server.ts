import type { RequestHandler } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

/**
 * Catch-all proxy: forwards all /api/* requests from the client to the
 * Fastify backend. Runs on the SvelteKit Node server (SSR context only).
 *
 * API_URL is a server-only environment variable — it contains the internal
 * Docker hostname (e.g. http://backend:3001) and must never be exposed
 * to the browser. The browser always calls a relative /api/* path which
 * hits this proxy route; the proxy then forwards to API_URL internally.
 */
export const GET: RequestHandler = async ({ params, request }) => {
  const apiUrl = env.API_URL ?? 'http://localhost:3001';
  const path = params.path ?? '';
  const targetUrl = `${apiUrl}/api/${path}`;

  const upstreamResponse = await fetch(targetUrl, {
    headers: {
      accept: request.headers.get('accept') ?? 'application/json',
    },
  });

  const body = await upstreamResponse.arrayBuffer();

  return new Response(body, {
    status: upstreamResponse.status,
    headers: {
      'content-type': upstreamResponse.headers.get('content-type') ?? 'application/json',
    },
  });
};
