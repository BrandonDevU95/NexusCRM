import {
  boolean,
  jsonb,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

export const systemSettings = pgTable(
  'system_settings',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    key: varchar('key', { length: 120 }).notNull(),
    value: jsonb('value').$type<unknown>().notNull(),
    description: text('description'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    keyIdx: uniqueIndex('system_settings_key_idx').on(table.key),
  }),
);

export const organizations = pgTable(
  'organizations',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    name: varchar('name', { length: 160 }).notNull(),
    slug: varchar('slug', { length: 120 }).notNull(),
    timezone: varchar('timezone', { length: 80 }).notNull().default('America/Mexico_City'),
    currency: varchar('currency', { length: 3 }).notNull().default('MXN'),
    isActive: boolean('is_active').default(true).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    slugIdx: uniqueIndex('organizations_slug_idx').on(table.slug),
  }),
);

export const seedRuns = pgTable(
  'seed_runs',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    name: varchar('name', { length: 160 }).notNull(),
    module: varchar('module', { length: 120 }).notNull(),
    metadata: jsonb('metadata').$type<Record<string, unknown>>().notNull().default({}),
    lastRunAt: timestamp('last_run_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    nameIdx: uniqueIndex('seed_runs_name_idx').on(table.name),
  }),
);

