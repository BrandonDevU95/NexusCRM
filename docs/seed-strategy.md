# Estrategia de Seeds

Los seeds de NexusCRM serán **manuales, modulares, determinísticos e idempotentes**.

## Objetivo

Cada vez que termines un módulo con endpoints, ese módulo debe poder poblar datos demo para probar Swagger, frontend y flujos reales sin llenar todo a mano.

## Reglas

- No correr seeds automáticamente al iniciar la app.
- Usar Faker con seed fija.
- No duplicar datos si se ejecutan dos veces.
- No correr contra producción.
- `reset` solo con `ALLOW_DB_RESET=true`.
- Cada seed debe declarar nombre, módulo y orden.
- Cada módulo con endpoints debe tener su propio seed.

## Estructura

```txt
apps/api/src/database/seeds/
  seed-runner.ts
  seed-registry.ts
  seed-context.ts
  seed.types.ts

apps/api/src/modules/customers/seeds/
  customers.seed.ts
  customers.factory.ts
```

## Comandos

```bash
npm run db:seed
npm run db:seed -- --module customers
npm run db:seed -- --module leads
npm run db:seed:reset
```

## Orden recomendado

```txt
settings
organizations
users
roles
permissions
customers
contacts
leads
pipelines
deals
activities
tasks
products
price-lists
quotes
orders
inventory
tickets
knowledge-base
automations
notifications
reports
```

## Criterio para considerar seed terminado

Un seed está terminado cuando:

- Genera datos suficientes para probar todos los endpoints principales del módulo.
- Respeta `organizationId`.
- No duplica datos al ejecutarse otra vez.
- Puede ejecutarse aislado si sus dependencias ya existen.
- Usa datos realistas, pero no datos sensibles reales.

