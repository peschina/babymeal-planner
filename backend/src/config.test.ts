import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { loadConfig } from './config.js';

describe('loadConfig', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('returns config when API_PORT is set', () => {
    process.env.API_PORT = '3001';
    const config = loadConfig();
    expect(config.apiPort).toBe(3001);
  });

  it('throws when API_PORT is missing', () => {
    delete process.env.API_PORT;
    expect(() => loadConfig()).toThrow('Missing required environment variable: API_PORT');
  });

  it('throws when API_PORT is not a number', () => {
    process.env.API_PORT = 'abc';
    expect(() => loadConfig()).toThrow('Invalid API_PORT value');
  });

  it('throws when API_PORT is zero', () => {
    process.env.API_PORT = '0';
    expect(() => loadConfig()).toThrow('Invalid API_PORT value');
  });

  it('defaults NODE_ENV to development when not set', () => {
    process.env.API_PORT = '3001';
    delete process.env.NODE_ENV;
    const config = loadConfig();
    expect(config.nodeEnv).toBe('development');
  });
});
