# NexusCRM

NexusCRM es un CRM modular fullstack diseñado como modular monolith con Next.js, NestJS, PostgreSQL, TypeORM, seeds modulares y flujo Git/SDD.

## Estado actual

Este repo contiene la foundation inicial del proyecto:

- Monorepo `apps/packages`.
- API NestJS en `apps/api`.
- Web Next.js en `apps/web`.
- Paquete compartido en `packages/shared`.
- Docker Compose para PostgreSQL y pgAdmin.
- TypeORM configurado con entidades y migraciones explícitas.
- Seed runner manual, modular e idempotente.
- Documentación base de arquitectura, Git/SDD, seeds y roadmap.
- Esqueletos de módulos backend y features frontend para el alcance completo.

## Primeros comandos

```bash
corepack pnpm install
cp .env.example .env
docker compose up -d
pnpm db:migrate
pnpm db:seed
pnpm dev
```

pgAdmin queda disponible en `http://localhost:5050`. Inicia sesión con
`PGADMIN_DEFAULT_EMAIL` y `PGADMIN_DEFAULT_PASSWORD` de `.env`, y registra el
servidor con host `postgres`, puerto `5432` y las credenciales `POSTGRES_*`.

> Si ya inicializaste el volumen de PostgreSQL con otras credenciales, estas no
> cambian al editar `.env`. Elimina únicamente el volumen local si puedes perder
> esos datos y necesitas reinicializarlo.

> No ejecutes seeds ni resets contra producción. Sí, parece obvio. También parecía obvio no usar `admin123`.

## Documentación

- `docs/architecture.md`
- `docs/git-workflow.md`
- `docs/seed-strategy.md`
- `docs/roadmap.md`

## Flujo recomendado

```bash
git checkout main
git pull origin main
git checkout -b sdd/add-monorepo-foundation
```

Cada módulo nuevo debe agregar:

- Entidades/migraciones.
- Controller/service/repository.
- DTOs y validaciones.
- Policies/permisos.
- Eventos cuando aplique.
- Seed modular.
- Pruebas mínimas.
- Documentación si introduce reglas nuevas.
