# Roadmap NexusCRM

## Fase 0 — Preparación

- Documentar arquitectura.
- Documentar Git workflow.
- Documentar seed strategy.
- Definir módulos y orden.
- Crear rama `sdd/add-monorepo-foundation`.

## Fase 1 — Foundation — `v0.1.0`

Entregable: app levantable localmente.

- Monorepo.
- NestJS API.
- Next.js web.
- PostgreSQL con Docker Compose.
- TypeORM.
- Swagger.
- Health check.
- Variables de entorno.
- Seed runner base.

## Fase 2 — Seguridad y organizaciones — `v0.2.0`

- Users.
- Auth.
- Sessions.
- Refresh token rotation.
- Roles.
- Permisos.
- CASL.
- Organizations.
- Organization members.
- Seeds de usuarios, roles y permisos.

## Fase 3 — CRM core — `v0.3.0`

- Customers.
- Contacts.
- Leads.
- Lead conversion.
- Customer timeline inicial.
- Seeds de clientes/contactos/leads.

## Fase 4 — Pipeline comercial — `v0.4.0`

- Pipelines.
- Pipeline stages.
- Deals.
- Deal stage history.
- Kanban básico.
- Activities.
- Tasks.
- Seeds comerciales.

## Fase 5 — Ventas — `v0.5.0`

- Products.
- Product categories.
- Price lists.
- Quotes.
- Quote approvals.
- Orders.
- PDF básico de cotización.
- Snapshot de precios.
- Seeds de productos, precios, cotizaciones y órdenes.

## Fase 6 — Inventario básico — `v0.6.0`

- Warehouses.
- Warehouse locations.
- Inventory stocks.
- Inventory movements.
- Reservations.
- Low stock alerts.
- Integración con orders.
- Seeds de inventario.

## Fase 7 — Postventa — `v0.7.0`

- Tickets.
- Ticket comments.
- Ticket categories.
- Ticket status history.
- Knowledge base.
- Customer support timeline.
- Seeds de tickets y artículos.

## Fase 8 — Automatización y notificaciones — `v0.8.0`

- Automation rules.
- Triggers.
- Conditions.
- Actions.
- Automation runs.
- In-app notifications.
- Email preparado para futuro.
- Seeds de automatizaciones demo.

## Fase 9 — Reportes, import/export y auditoría — `v0.9.0`

- Dashboard principal.
- Reportes comerciales.
- Reportes operativos.
- Import CSV/Excel.
- Export CSV/Excel/PDF.
- Audit logs.
- Security logs.
- Admin panel.

## Fase 10 — Primer release usable — `v1.0.0`

Flujo completo aceptado:

```txt
Lead
  -> Customer / Contact / Deal
  -> Quote
  -> Order
  -> Inventory reservation/movement
  -> Ticket si hay postventa
  -> Reports
  -> Audit logs
```
