# Proposal: adopt TypeORM persistence

## Summary

Standardize the NexusCRM persistence foundation on TypeORM and its NestJS integration.

## Motivation

The project should use persistence tooling already understood by its maintainer so future modules can be implemented, debugged and reviewed without unnecessary learning overhead.

## Scope

- Configure the NestJS TypeORM integration and CLI data source.
- Model the foundation tables as TypeORM entities.
- Add an explicit initial migration with automatic synchronization disabled.
- Adapt the modular seed runner to TypeORM repositories.
- Align package scripts, dependencies and project documentation.
- Recreate the local database from an empty Docker volume.

## Out of scope

- New business entities or endpoints.
- Production data migration.
- Automatic migration execution during API startup.

## Rollback

Revert this change branch, recreate the local Docker volumes and run the persistence commands from the restored revision.
