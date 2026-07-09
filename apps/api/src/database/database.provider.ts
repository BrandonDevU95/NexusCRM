import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { DATABASE } from './database.constants';
import * as schema from './schema';

export type NexusDatabase = NodePgDatabase<typeof schema>;

export const databaseProvider: Provider = {
  provide: DATABASE,
  inject: [ConfigService],
  useFactory: (config: ConfigService): NexusDatabase => {
    const connectionString = config.get<string>('DATABASE_URL');

    if (!connectionString) {
      throw new Error('DATABASE_URL is required');
    }

    const pool = new Pool({ connectionString });
    return drizzle(pool, { schema });
  },
};

