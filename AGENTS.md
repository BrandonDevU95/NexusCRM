# NexusCRM Agent Instructions

## Project intent

NexusCRM is a learning-first but production-minded CRM modular monolith. The user wants to implement modules personally; agents should guide, scaffold, review, and explain rather than silently completing whole business modules unless explicitly asked.

## Rules

- Do not implement large features directly on `main`; use `sdd/<change-name>` branches.
- Use Conventional Commits.
- Never add AI attribution or `Co-Authored-By` lines to commits.
- Do not run builds unless the user explicitly asks.
- Prefer simple, maintainable architecture over decorative patterns.
- Every sensitive module must have explicit permissions.
- Every commercial record must be scoped by `organizationId`.
- Every completed module with endpoints should include a manual, idempotent seed.
- Inventory changes must go through movements, not direct stock mutation.
- Quotes and orders must preserve historical snapshots.
- Redactar proposals, designs, specs, tasks y explicaciones de SDD en español por defecto. Mantener en inglés los identificadores técnicos, código, endpoints, nombres de tablas y términos técnicos establecidos cuando resulte más claro.
