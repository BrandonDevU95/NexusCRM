import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { seedRuns } from '../schema';
import * as schema from '../schema';
import { configureFaker, consoleSeedLogger, createSeedOptions } from './seed-context';
import { selectSeeds } from './seed-registry';

async function main() {
  const options = createSeedOptions(process.argv.slice(2));

  if (process.env.NODE_ENV === 'production') {
    throw new Error('Refusing to run seeds in production.');
  }

  if (options.reset && process.env.ALLOW_DB_RESET !== 'true') {
    throw new Error('Seed reset requires ALLOW_DB_RESET=true.');
  }

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL is required to run seeds.');
  }

  const pool = new Pool({ connectionString });
  const db = drizzle(pool, { schema });
  const faker = configureFaker(options.fakerSeed);
  const logger = consoleSeedLogger;

  const seeds = selectSeeds(options.module);

  if (seeds.length === 0) {
    logger.warn(`No seeds found for module: ${options.module ?? 'all'}`);
    await pool.end();
    return;
  }

  const context = { db, faker, logger, options };

  try {
    if (options.reset) {
      for (const seed of [...seeds].reverse()) {
        if (seed.reset) {
          logger.warn(`Resetting seed: ${seed.name}`);
          await seed.reset(context);
        }
      }
    }

    for (const seed of seeds) {
      logger.info(`Running seed: ${seed.name}`);
      await seed.run(context);
      await db
        .insert(seedRuns)
        .values({
          name: seed.name,
          module: seed.module,
          metadata: {
            fakerSeed: options.fakerSeed,
            reset: options.reset,
          },
          lastRunAt: new Date(),
        })
        .onConflictDoUpdate({
          target: seedRuns.name,
          set: {
            module: seed.module,
            metadata: {
              fakerSeed: options.fakerSeed,
              reset: options.reset,
            },
            lastRunAt: new Date(),
          },
        });
    }

    logger.info('Seed execution completed.');
  } finally {
    await pool.end();
  }
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});

