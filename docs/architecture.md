# Arquitectura NexusCRM

## Enfoque

NexusCRM será un CRM modular fullstack construido como **modular monolith**. La idea es mantener despliegue simple, pero con límites internos claros por dominio.

## Stack

```txt
Frontend: Next.js
Backend: NestJS
DB: PostgreSQL
ORM: TypeORM
Auth: propia con cookies HttpOnly
Autorización: RBAC + permisos + CASL
UI: Tailwind CSS + shadcn/ui
Data fetching: TanStack Query
API docs: Swagger/OpenAPI
Dev env: Docker Compose
Repo: Monorepo apps/packages
Workflow: Git + SDD + seeds modulares
```

## Estructura

```txt
apps/
  api/      NestJS modular monolith
  web/      Next.js
packages/
  shared/   tipos, permisos, catálogos y constantes compartidas
docs/       documentación técnica
infra/      recursos de infraestructura local
openspec/   artefactos SDD
```

## Reglas globales

1. Todo dato comercial debe tener `organizationId`.
2. Todo módulo sensible debe tener permisos explícitos.
3. Toda acción crítica debe generar audit log.
4. Toda lista debe tener búsqueda, filtros y paginación.
5. Todo formulario debe validar en frontend y backend.
6. Ningún controller consulta la base directamente.
7. Ningún componente React contiene lógica de negocio pesada.
8. Los reportes no deben bloquear el sistema principal.
9. Las automatizaciones deben guardar historial de ejecución.
10. El inventario se modifica con movimientos, no con updates directos al stock.
11. Las órdenes no borran historial.
12. Las cotizaciones conservan snapshot de precios.
13. Los refresh tokens se rotan.
14. Las sesiones son revocables.
15. Los seeds son manuales, modulares e idempotentes.

## Backend

Cada módulo backend seguirá esta forma:

```txt
modules/<module>/
  <module>.module.ts
  controllers/
  services/
  repositories/
  dto/
  policies/
  events/
  seeds/
  tests/
```

Responsabilidades:

- Controller: HTTP, auth guards, DTOs, status codes.
- Service: reglas de negocio y casos de uso.
- Repository: acceso a datos mediante repositorios y QueryBuilder de TypeORM.
- Policies: reglas CASL y permisos por recurso.
- Events: eventos de dominio para auditoría, notificaciones y automatizaciones.
- Seeds: datos demo idempotentes del módulo.

## Frontend

Cada feature frontend seguirá esta forma:

```txt
features/<feature>/
  components/
  hooks/
  services/
  schemas/
  types/
  views/
```

Responsabilidades:

- Components: UI reusable.
- Hooks: composición de queries/mutations.
- Services: cliente API.
- Schemas: validación Zod.
- Types: tipos de la feature.
- Views: pantallas de la feature.

## Módulos finales

1. Plataforma y configuración
2. Seguridad, usuarios y permisos
3. Organizaciones / empresas internas
4. Clientes / cuentas
5. Contactos
6. Leads / prospectos
7. Pipeline comercial
8. Oportunidades / deals
9. Actividades y seguimiento
10. Calendario y tareas
11. Productos y servicios
12. Listas de precios
13. Cotizaciones
14. Órdenes / ventas
15. Inventario básico
16. Tickets de soporte
17. Base de conocimiento interna
18. Automatizaciones
19. Notificaciones
20. Reportes y dashboards
21. Importación y exportación
22. Auditoría y logs
23. Administración del sistema
