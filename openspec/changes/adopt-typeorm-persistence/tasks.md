# Tasks: adopt TypeORM persistence

## 1. Dependencies and configuration

- [x] Create a dedicated SDD branch.
- [x] Install TypeORM and the NestJS integration.
- [x] Configure a shared database options factory and CLI data source.

## 2. Persistence model

- [x] Replace the foundation schema with TypeORM entities.
- [x] Replace the initial database migration.
- [x] Keep automatic schema synchronization disabled.

## 3. Seeds and tooling

- [x] Adapt the seed context and runner to a TypeORM data source.
- [x] Adapt the foundation seed to idempotent TypeORM repository operations.
- [x] Replace database package scripts.

## 4. Documentation and cleanup

- [x] Align project documentation and module scaffolds.
- [x] Confirm no obsolete persistence references or artifacts remain.

## 5. Verification

- [x] Run type checking and tests.
- [x] Recreate Docker containers and project volumes.
- [x] Run migration and seed commands against the fresh database.
- [x] Verify migration state, seed idempotency and container health.
- [x] Run a production dependency audit and confirm no known vulnerabilities.
