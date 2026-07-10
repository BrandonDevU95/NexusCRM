import type { DataSourceOptions } from 'typeorm';
import { foundationEntities } from './entities';
import { databaseMigrations } from './migrations';

export function createDatabaseOptions(
  connectionString: string,
): DataSourceOptions {
  return {
    type: 'postgres',
    url: connectionString,
    entities: foundationEntities,
    migrations: databaseMigrations,
    migrationsTableName: 'migrations',
    uuidExtension: 'pgcrypto',
    installExtensions: false,
    synchronize: false,
  };
}
