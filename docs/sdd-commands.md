# Comandos y operaciones SDD en NexusCRM

En este proyecto, SDD funciona principalmente con archivos OpenSpec dentro de `openspec/`. Todavía no existe una CLI propia tipo `sdd new` o `sdd status`.

Hay tres formas de trabajar:

1. Pedírselo a Codex en lenguaje natural.
2. Revisar/editar los archivos manualmente.
3. Más adelante, crear scripts auxiliares cuando exista `package.json`.

## 1. Operaciones recomendadas con Codex

### Ver estado actual

Puedes pedir:

```txt
Revisa el estado SDD actual
```

Codex debería leer:

```txt
openspec/changes/*/state.yaml
```

Y decirte qué cambios están activos, pendientes, aplicados, verificados o archivados.

### Crear un nuevo change

Puedes pedir:

```txt
Crear el cambio SDD add-security-access
```

Codex debería crear:

```txt
openspec/changes/add-security-access/state.yaml
openspec/changes/add-security-access/proposal.md
openspec/changes/add-security-access/specs/<capability>/spec.md
openspec/changes/add-security-access/design.md
openspec/changes/add-security-access/tasks.md
```

### Implementar un change

Puedes pedir:

```txt
Implementa el change add-monorepo-foundation siguiendo tasks.md
```

Codex debería:

1. recomendar/confirmar rama Git
2. leer `state.yaml`
3. leer `proposal.md`
4. leer `specs`
5. leer `design.md`
6. ejecutar tareas de `tasks.md` en orden
7. marcar tareas completadas

### Verificar un change

Puedes pedir:

```txt
Verifica el change add-monorepo-foundation
```

Codex debería:

1. correr tests/build/lint si existen
2. revisar escenarios de specs
3. crear `verify-report.md`
4. actualizar `state.yaml`

### Cerrar/archivar un change

Puedes pedir:

```txt
Archiva el change add-monorepo-foundation
```

Codex debería:

1. confirmar que verify está completo
2. fusionar specs estables hacia `openspec/specs/`
3. mover el change a:

```txt
openspec/changes/archive/YYYY-MM-DD-add-monorepo-foundation/
```

4. actualizar estado final
5. recomendar tag/release si aplica

## 2. Comandos manuales útiles

### Ver changes activos

```bash
find openspec/changes -maxdepth 2 -name state.yaml -print
```

### Ver estado de un change

```bash
cat openspec/changes/add-monorepo-foundation/state.yaml
```

### Ver tareas pendientes

```bash
grep -n "\[ \]" openspec/changes/add-monorepo-foundation/tasks.md
```

### Ver tareas completadas

```bash
grep -n "\[x\]" openspec/changes/add-monorepo-foundation/tasks.md
```

### Crear rama recomendada

```bash
git checkout main
git pull origin main
git checkout -b sdd/add-monorepo-foundation
```

### Ver cambios Git actuales

```bash
git status
```

## 3. Qué significa cerrar un change

Cerrar un change no es borrar la carpeta.

Cerrar significa:

```txt
apply completo
verify completo
specs actualizadas
change movido a archive
historial preservado
```

La carpeta final debe quedar así:

```txt
openspec/changes/archive/2026-07-09-add-monorepo-foundation/
```

## 4. Posibles scripts futuros

Cuando exista `package.json`, podemos agregar scripts como:

```json
{
  "scripts": {
    "sdd:status": "node scripts/sdd-status.mjs",
    "sdd:tasks": "node scripts/sdd-tasks.mjs",
    "sdd:new": "node scripts/sdd-new.mjs",
    "sdd:archive": "node scripts/sdd-archive.mjs"
  }
}
```

Pero al inicio lo más seguro es hacerlo con Codex + archivos OpenSpec para que entiendas el proceso antes de automatizarlo.
