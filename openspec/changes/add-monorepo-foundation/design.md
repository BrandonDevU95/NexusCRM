# Design: add monorepo foundation

## Decisions

- Use npm workspaces with `apps/api`, `apps/web` and `packages/shared`.
- Use NestJS as a modular monolith, not microservices.
- Use Next.js App Router for the frontend shell.
- Use Drizzle with PostgreSQL from the first phase.
- Use manual modular seeds, never automatic app-start seeding.
- Use OpenSpec-style SDD files tracked in Git.

## Backend boundaries

Each backend module owns its controller/service/repository/policies/events/seeds/tests folders. Controllers must not access Drizzle directly.

## Frontend boundaries

Each frontend feature owns components/hooks/services/schemas/types/views. Business workflows should be composed in hooks/services, not buried inside visual components.

## Seed design

Seeds are registered centrally, ordered explicitly and filtered by module. Each seed receives a context with database, Faker and logger.

## Risks

- Creating too many placeholders can look like progress without business value. Mitigation: each future module must add real endpoints, tests and seeds.
- Drizzle schema may evolve heavily during early auth/CRM phases. Mitigation: keep foundation schema minimal.

