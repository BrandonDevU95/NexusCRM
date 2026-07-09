import { eq } from 'drizzle-orm';
import { organizations, seedRuns, systemSettings } from '../../schema';
import type { SeedDefinition } from '../seed.types';

const DEMO_ORGANIZATION_ID = '00000000-0000-4000-8000-000000000001';

export const foundationSeed: SeedDefinition = {
  name: 'foundation',
  module: 'settings',
  order: 10,
  async run({ db, logger }) {
    const now = new Date();

    await db
      .insert(organizations)
      .values({
        id: DEMO_ORGANIZATION_ID,
        name: 'NexusCRM Demo',
        slug: 'nexus-demo',
        timezone: 'America/Mexico_City',
        currency: 'MXN',
        isActive: true,
        updatedAt: now,
      })
      .onConflictDoUpdate({
        target: organizations.slug,
        set: {
          name: 'NexusCRM Demo',
          timezone: 'America/Mexico_City',
          currency: 'MXN',
          isActive: true,
          updatedAt: now,
        },
      });

    await db
      .insert(systemSettings)
      .values([
        {
          key: 'crm.name',
          value: 'NexusCRM',
          description: 'Nombre público del CRM.',
          updatedAt: now,
        },
        {
          key: 'crm.baseCurrency',
          value: 'MXN',
          description: 'Moneda base del CRM.',
          updatedAt: now,
        },
        {
          key: 'crm.timezone',
          value: 'America/Mexico_City',
          description: 'Zona horaria base del CRM.',
          updatedAt: now,
        },
        {
          key: 'numbering.quotes.prefix',
          value: 'COT',
          description: 'Prefijo de cotizaciones.',
          updatedAt: now,
        },
        {
          key: 'numbering.orders.prefix',
          value: 'ORD',
          description: 'Prefijo de órdenes.',
          updatedAt: now,
        },
      ])
      .onConflictDoNothing();

    logger.info('Foundation seed applied: settings + demo organization.');
  },
  async reset({ db, logger }) {
    await db.delete(systemSettings).where(eq(systemSettings.key, 'crm.name'));
    await db.delete(systemSettings).where(eq(systemSettings.key, 'crm.baseCurrency'));
    await db.delete(systemSettings).where(eq(systemSettings.key, 'crm.timezone'));
    await db.delete(systemSettings).where(eq(systemSettings.key, 'numbering.quotes.prefix'));
    await db.delete(systemSettings).where(eq(systemSettings.key, 'numbering.orders.prefix'));
    await db.delete(seedRuns).where(eq(seedRuns.name, 'foundation'));
    await db.delete(organizations).where(eq(organizations.slug, 'nexus-demo'));
    logger.warn('Foundation seed reset applied.');
  },
};

