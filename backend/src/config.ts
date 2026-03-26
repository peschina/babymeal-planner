export interface Config {
  apiPort: number;
  nodeEnv: string;
}

export function loadConfig(): Config {
  const rawPort = process.env.API_PORT;
  if (!rawPort) {
    throw new Error('Missing required environment variable: API_PORT');
  }
  const apiPort = parseInt(rawPort, 10);
  if (isNaN(apiPort) || apiPort < 1 || apiPort > 65535) {
    throw new Error(`Invalid API_PORT value: "${rawPort}". Must be a valid port number (1–65535).`);
  }

  return {
    apiPort,
    nodeEnv: process.env.NODE_ENV ?? 'development',
  };
}
