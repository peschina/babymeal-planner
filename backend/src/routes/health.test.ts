import { describe, it, expect } from 'vitest';
import { buildApp } from '../app.js';

describe('GET /api/health', () => {
  it('returns 200 with status ok and uptime', async () => {
    const app = await buildApp();
    const response = await app.inject({
      method: 'GET',
      url: '/api/health',
    });

    expect(response.statusCode).toBe(200);
    const body = response.json<{ status: string; uptime: number }>();
    expect(body.status).toBe('ok');
    expect(typeof body.uptime).toBe('number');
    expect(body.uptime).toBeGreaterThanOrEqual(0);

    await app.close();
  });
});
