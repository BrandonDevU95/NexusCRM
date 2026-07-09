import type { Faker } from '@faker-js/faker';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import type * as schema from '../schema';

export type SeedDatabase = NodePgDatabase<typeof schema>;

export interface SeedLogger {
  info(message: string): void;
  warn(message: string): void;
  error(message: string): void;
}

export interface SeedOptions {
  module?: string;
  reset: boolean;
  fakerSeed: number;
}

export interface SeedContext {
  db: SeedDatabase;
  faker: Faker;
  logger: SeedLogger;
  options: SeedOptions;
}

export interface SeedDefinition {
  name: string;
  module: string;
  order: number;
  run(context: SeedContext): Promise<void>;
  reset?(context: SeedContext): Promise<void>;
}

