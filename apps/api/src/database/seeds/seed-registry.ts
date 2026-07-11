import { foundationSeed } from './foundation/foundation.seed';
import type { SeedDefinition } from './seed.types';

export const seedRegistry: SeedDefinition[] = [foundationSeed].sort(
  (left, right) => left.order - right.order,
);

export function selectSeeds(moduleName?: string): SeedDefinition[] {
  if (!moduleName) {
    return seedRegistry;
  }

  return seedRegistry.filter((seed) => seed.module === moduleName || seed.name === moduleName);
}

