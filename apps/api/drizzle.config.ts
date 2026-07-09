import { defineConfig } from 'drizzle-kit';
import { loadApiEnv } from './src/config/load-env';

loadApiEnv();

export default defineConfig({
  schema: './src/database/schema/index.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL ?? 'postgresql://nexus:nexus@localhost:5432/nexuscrm',
  },
  strict: true,
  verbose: true,
});
