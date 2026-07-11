# Design: adopt TypeORM persistence and harden the application foundation

## Decisions

- Use TypeORM `0.3.x` with `@nestjs/typeorm` and PostgreSQL.
- Use the Data Mapper pattern; services and repositories will receive TypeORM repositories instead of extending active-record entities.
- Keep `synchronize: false` in every environment and evolve the schema only through versioned migrations.
- Share one database options factory between the NestJS connection and the CLI data source to avoid configuration drift.
- Register entity and migration classes explicitly instead of relying on runtime glob discovery.
- Use PostgreSQL's `gen_random_uuid()` default and disable automatic extension installation so the application role does not need elevated database permissions.
- Keep seeds manual, deterministic and idempotent, using the TypeORM `DataSource` as their persistence context.
- Validate only the variables required by each entry point: the API validates its complete runtime contract, while migration and seed commands validate smaller dedicated contracts.
- Normalize unhandled HTTP errors in one global filter without exposing internal error details, and record request completion or failure through one interceptor.
- Keep lint configuration owned by each workspace because the API, Next.js app and ESM shared package require different rule presets.

## Runtime integration

`DatabaseModule` owns `TypeOrmModule.forRootAsync` and obtains `DATABASE_URL` through `ConfigService`. Feature modules will register only the entities they own with `TypeOrmModule.forFeature`.

## Migration integration

The CLI loads `src/database/data-source.ts`. Migration generation, execution, inspection and rollback are exposed as pnpm scripts. Migrations never run implicitly when the API starts.

## Application foundation integration

`AppModule` loads the validated application environment before database and feature modules initialize. Global pipes, filters and interceptors are registered during bootstrap so every future endpoint inherits the same HTTP behavior.

Foundation tests remain unit-level and do not require a running database. Local migration, seed and smoke verification continues to exercise the integrated runtime separately.

## Ownership and permissions

The hardening behavior is platform infrastructure and owns no commercial data. It adds no endpoints or permissions. Future sensitive modules remain responsible for explicit policies and organization scoping.

## Risks

- The initial migration assumes an empty database. Mitigation: this development-only change recreates the project Docker volumes before running it.
- Entity metadata can diverge from migrations. Mitigation: keep schema synchronization disabled and use migration generation/schema comparison during development.
- ORM entities can leak into HTTP contracts. Mitigation: controllers continue using DTOs and never expose persistence models directly.
- Global error logging can accidentally disclose secrets. Mitigation: client responses use a generic message for unknown errors and tests enforce it.
