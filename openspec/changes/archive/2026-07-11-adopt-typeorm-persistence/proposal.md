# Proposal: adopt TypeORM persistence and harden the application foundation

## Summary

Standardize the NexusCRM persistence foundation on TypeORM and its NestJS
integration, and complete the global application safeguards needed before the
security phase begins.

## Motivation

The project should use persistence tooling already understood by its maintainer
so future modules can be implemented, debugged and reviewed without unnecessary
learning overhead. The executable foundation also needs validated configuration,
consistent request error handling and real quality gates across every workspace.

## Scope

- Configure the NestJS TypeORM integration and CLI data source.
- Model the foundation tables as TypeORM entities.
- Add an explicit initial migration with automatic synchronization disabled.
- Adapt the modular seed runner to TypeORM repositories.
- Align package scripts, dependencies and project documentation.
- Recreate the local database from an empty Docker volume.
- Validate runtime, migration and seed environment variables at their boundaries.
- Add global exception normalization and request lifecycle logging.
- Replace placeholder lint commands in the web and shared workspaces.
- Add foundation tests for API safeguards, the web shell and shared catalogs.

## Out of scope

- New business entities or endpoints.
- Production data migration.
- Automatic migration execution during API startup.
- Authentication, authorization or organization membership behavior.

## Rollback

Revert this change branch, recreate the local Docker volumes and run the persistence commands from the restored revision.
