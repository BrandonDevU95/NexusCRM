import appDataSourcePromise from "../data-source";
import { validateSeedEnvironment } from "../../config/app.validation";
import { SeedRunEntity } from "../entities";
import {
  configureFaker,
  consoleSeedLogger,
  createSeedOptions,
} from "./seed-context";
import { selectSeeds } from "./seed-registry";

async function main() {
  const appDataSource = await appDataSourcePromise;
  const environment = validateSeedEnvironment(process.env);
  const options = createSeedOptions(
    process.argv.slice(2),
    environment.SEED_FAKER_SEED,
  );

  if (environment.NODE_ENV === "production") {
    throw new Error("Refusing to run seeds in production.");
  }

  if (options.reset && !environment.ALLOW_DB_RESET) {
    throw new Error("Seed reset requires ALLOW_DB_RESET=true.");
  }

  await appDataSource.initialize();
  const faker = configureFaker(options.fakerSeed);
  const logger = consoleSeedLogger;

  const seeds = selectSeeds(options.module);

  if (seeds.length === 0) {
    logger.warn(`No seeds found for module: ${options.module ?? "all"}`);
    await appDataSource.destroy();
    return;
  }

  const context = { dataSource: appDataSource, faker, logger, options };
  const seedRunRepository = appDataSource.getRepository(SeedRunEntity);

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
      await seedRunRepository.upsert(
        {
          name: seed.name,
          module: seed.module,
          metadata: {
            fakerSeed: options.fakerSeed,
            reset: options.reset,
          },
          lastRunAt: new Date(),
        },
        ["name"],
      );
    }

    logger.info("Seed execution completed.");
  } finally {
    await appDataSource.destroy();
  }
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
