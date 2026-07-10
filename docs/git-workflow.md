# Guía Git para NexusCRM

Esta guía define cómo usar ramas, commits, tags y releases mientras desarrollas NexusCRM con SDD.

## Regla principal

No implementes features grandes directamente en `main`.

Flujo normal:

```txt
main actualizado
  -> crear rama sdd/<change-name>
  -> escribir/actualizar proposal, specs, design y tasks
  -> implementar código por tareas pequeñas
  -> agregar seed del módulo cuando tenga endpoints
  -> ejecutar verify
  -> merge a main
  -> archivar cambio SDD
  -> tag/release si el cambio completa un hito
```

## Ramas

```txt
main
sdd/<change-name>
fix/<short-description>
docs/<short-description>
```

Ejemplos:

```txt
sdd/add-monorepo-foundation
sdd/add-security-access
sdd/add-customers-module
sdd/add-leads-module
sdd/add-quotes-module
```

## Comandos por cambio

```bash
git checkout main
git pull origin main
git checkout -b sdd/add-monorepo-foundation
```

Durante el trabajo:

```bash
git status
git add <files>
git commit -m "feat: scaffold monorepo foundation"
```

Antes de cerrar:

```bash
git status
pnpm lint
pnpm typecheck
pnpm test
# pnpm build solo cuando se decida cerrar hito o el usuario lo pida
git log --oneline --decorate -10
```

## Commits

Usar Conventional Commits:

```txt
feat: nueva funcionalidad
fix: corrección de bug
docs: documentación
refactor: mejora interna sin cambiar comportamiento
test: pruebas
chore: configuración, tooling o mantenimiento
build: build/dependencias
ci: integración continua
```

Ejemplos:

```txt
feat: scaffold monorepo foundation
feat: add customer module
feat: add customer seed data
test: add customer service tests
fix: prevent duplicate seeded customers
docs: add git workflow guide
```

## Tags

```txt
v0.1.0  foundation ejecutable
v0.2.0  seguridad y organizaciones
v0.3.0  CRM core: clientes/contactos/leads
v0.4.0  pipeline y oportunidades
v0.5.0  ventas: productos/cotizaciones/órdenes
v0.6.0  inventario básico
v0.7.0  soporte y base de conocimiento
v0.8.0  automatizaciones/notificaciones
v0.9.0  reportes/import/export/auditoría
v1.0.0  CRM usable end-to-end
```

Crear tag:

```bash
git checkout main
git pull origin main
git tag -a v0.1.0 -m "v0.1.0 - foundation"
git push origin v0.1.0
```

## Releases

Un release debe incluir:

```txt
- Qué se agregó
- Qué se corrigió
- Cómo probarlo
- Limitaciones conocidas
- Siguiente hito recomendado
```
