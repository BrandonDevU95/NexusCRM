# Proposal: add monorepo foundation

## Summary

Create the initial NexusCRM foundation so future modules can be developed incrementally with SDD, Git workflow, modular seeds and clear boundaries.

## Motivation

The project scope includes 23 modules. Implementing them without a foundation would create inconsistent folders, duplicated patterns and fragile seed/test workflows.

## Scope

- Create monorepo structure.
- Add API/web/shared package scaffolding.
- Configure Docker Compose for PostgreSQL.
- Configure TypeORM foundation.
- Add seed runner base.
- Add documentation for architecture, Git workflow, seeds and roadmap.
- Add backend module placeholders and frontend feature placeholders.

## Out of scope

- Full auth implementation.
- Full CRUD modules.
- Production deployment.
- CI/CD.
- Complete v1 business flows.

## Rollback

Remove the scaffolded directories/files from this change and return to the empty repo state on `main`.
