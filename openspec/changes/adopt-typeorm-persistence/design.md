# Design: adopt TypeORM persistence

## Decisions

- Use TypeORM `0.3.x` with `@nestjs/typeorm` and PostgreSQL.
- Use the Data Mapper pattern; services and repositories will receive TypeORM repositories instead of extending active-record entities.
- Keep `synchronize: false` in every environment and evolve the schema only through versioned migrations.
- Share one database options factory between the NestJS connection and the CLI data source to avoid configuration drift.
- Register entity and migration classes explicitly instead of relying on runtime glob discovery.
- Use PostgreSQL's `gen_random_uuid()` default and disable automatic extension installation so the application role does not need elevated database permissions.
- Keep seeds manual, deterministic and idempotent, using the TypeORM `DataSource` as their persistence context.

## Runtime integration

`DatabaseModule` owns `TypeOrmModule.forRootAsync` and obtains `DATABASE_URL` through `ConfigService`. Feature modules will register only the entities they own with `TypeOrmModule.forFeature`.

## Migration integration

The CLI loads `src/database/data-source.ts`. Migration generation, execution, inspection and rollback are exposed as pnpm scripts. Migrations never run implicitly when the API starts.

## Risks

- The initial migration assumes an empty database. Mitigation: this development-only change recreates the project Docker volumes before running it.
- Entity metadata can diverge from migrations. Mitigation: keep schema synchronization disabled and use migration generation/schema comparison during development.
- ORM entities can leak into HTTP contracts. Mitigation: controllers continue using DTOs and never expose persistence models directly.
