import type { Faker } from '@faker-js/faker';
import type { DataSource } from 'typeorm';

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
  dataSource: DataSource;
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
