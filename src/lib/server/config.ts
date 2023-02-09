if (process.env?.NODE_ENV !== 'production') {
  const { config } = await import('dotenv');
  config();
}

export function getEnv(key: string): string {
  const value = process.env[key];
  if (value === undefined) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
}
