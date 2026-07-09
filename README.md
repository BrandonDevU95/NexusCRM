# NexusCRM

NexusCRM es un CRM modular fullstack diseñado como modular monolith con Next.js, NestJS, PostgreSQL, Drizzle, seeds modulares y flujo Git/SDD.

## Estado actual

Este repo contiene la foundation inicial del proyecto:

- Monorepo `apps/packages`.
- API NestJS en `apps/api`.
- Web Next.js en `apps/web`.
- Paquete compartido en `packages/shared`.
- Docker Compose para PostgreSQL.
- Drizzle configurado.
- Seed runner manual, modular e idempotente.
- Documentación base de arquitectura, Git/SDD, seeds y roadmap.
- Esqueletos de módulos backend y features frontend para el alcance completo.

## Primeros comandos

```bash
npm install
cp .env.example .env
docker compose up -d
npm run db:generate
npm run db:migrate
npm run db:seed
npm run dev
```

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

- Schema/migración.
- Controller/service/repository.
- DTOs y validaciones.
- Policies/permisos.
- Eventos cuando aplique.
- Seed modular.
- Pruebas mínimas.
- Documentación si introduce reglas nuevas.

