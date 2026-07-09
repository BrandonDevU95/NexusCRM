export const env = () => ({
  nodeEnv: process.env.NODE_ENV ?? 'development',
  apiPort: Number(process.env.API_PORT ?? 3001),
  apiGlobalPrefix: process.env.API_GLOBAL_PREFIX ?? 'api/v1',
  webOrigin: process.env.WEB_ORIGIN ?? 'http://localhost:3000',
  databaseUrl: process.env.DATABASE_URL,
  seedFakerSeed: Number(process.env.SEED_FAKER_SEED ?? 20260709),
});

