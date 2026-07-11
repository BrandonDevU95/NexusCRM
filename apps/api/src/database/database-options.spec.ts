import { describe, expect, it } from 'vitest';
import { foundationEntities } from './entities';
import { databaseMigrations } from './migrations';
import { createDatabaseOptions } from './database-options';

describe('createDatabaseOptions', () => {
  it('creates explicit and migration-driven PostgreSQL options', () => {
    const connectionString =
      'postgresql://user:password@localhost:5432/nexuscrm';

    const options = createDatabaseOptions(connectionString);

    expect(options).toMatchObject({
      type: 'postgres',
      url: connectionString,
      migrationsTableName: 'migrations',
      uuidExtension: 'pgcrypto',
      installExtensions: false,
      synchronize: false,
    });
    expect(options.entities).toEqual(foundationEntities);
    expect(options.migrations).toEqual(databaseMigrations);
  });
});
