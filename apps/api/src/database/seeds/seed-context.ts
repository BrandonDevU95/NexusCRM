import { faker } from "@faker-js/faker";
import type { SeedLogger, SeedOptions } from "./seed.types";

export function createSeedOptions(
  args: string[],
  fakerSeed: number,
): SeedOptions {
  const moduleArg = getArgValue(args, "--module");
  const reset = args.includes("--reset");

  const options: SeedOptions = {
    reset,
    fakerSeed,
  };

  if (moduleArg) {
    options.module = moduleArg;
  }

  return options;
}

export function configureFaker(seed: number) {
  faker.seed(seed);
  return faker;
}

export const consoleSeedLogger: SeedLogger = {
  info: (message) => console.log(`[seed] ${message}`),
  warn: (message) => console.warn(`[seed] ${message}`),
  error: (message) => console.error(`[seed] ${message}`),
};

function getArgValue(args: string[], name: string): string | undefined {
  const exactIndex = args.indexOf(name);
  if (exactIndex >= 0) {
    return args[exactIndex + 1];
  }

  const prefixed = args.find((arg) => arg.startsWith(`${name}=`));
  return prefixed?.slice(name.length + 1);
}
