import type { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateFoundationTables2026071000000 implements MigrationInterface {
  name = 'CreateFoundationTables2026071000000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "organizations" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "name" varchar(160) NOT NULL,
        "slug" varchar(120) NOT NULL,
        "timezone" varchar(80) DEFAULT 'America/Mexico_City' NOT NULL,
        "currency" varchar(3) DEFAULT 'MXN' NOT NULL,
        "is_active" boolean DEFAULT true NOT NULL,
        "created_at" timestamptz DEFAULT now() NOT NULL,
        "updated_at" timestamptz DEFAULT now() NOT NULL
      )
    `);
    await queryRunner.query(`
      CREATE TABLE "seed_runs" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "name" varchar(160) NOT NULL,
        "module" varchar(120) NOT NULL,
        "metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
        "last_run_at" timestamptz DEFAULT now() NOT NULL
      )
    `);
    await queryRunner.query(`
      CREATE TABLE "system_settings" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "key" varchar(120) NOT NULL,
        "value" jsonb NOT NULL,
        "description" text,
        "created_at" timestamptz DEFAULT now() NOT NULL,
        "updated_at" timestamptz DEFAULT now() NOT NULL
      )
    `);
    await queryRunner.query(
      'CREATE UNIQUE INDEX "organizations_slug_idx" ON "organizations" ("slug")',
    );
    await queryRunner.query(
      'CREATE UNIQUE INDEX "seed_runs_name_idx" ON "seed_runs" ("name")',
    );
    await queryRunner.query(
      'CREATE UNIQUE INDEX "system_settings_key_idx" ON "system_settings" ("key")',
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE "system_settings"');
    await queryRunner.query('DROP TABLE "seed_runs"');
    await queryRunner.query('DROP TABLE "organizations"');
  }
}
