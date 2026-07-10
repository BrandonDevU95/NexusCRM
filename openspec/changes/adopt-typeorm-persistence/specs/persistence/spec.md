# Persistence delta specification

## ADDED Requirements

### Requirement: TypeORM database integration

The API MUST configure PostgreSQL through the NestJS TypeORM integration using `DATABASE_URL` and MUST keep automatic schema synchronization disabled.

#### Scenario: API starts with valid database configuration

- **Given** PostgreSQL is reachable and `DATABASE_URL` is valid
- **When** the NestJS application initializes
- **Then** TypeORM establishes the default data source with all foundation entities registered

### Requirement: Versioned schema migrations

The project MUST manage database schema changes through committed TypeORM migrations and MUST expose commands to generate, run, inspect and revert them.

#### Scenario: Empty local database is initialized

- **Given** a fresh PostgreSQL database
- **When** the migration command runs
- **Then** the foundation tables and indexes are created and the migration is recorded

### Requirement: Modular seed compatibility

The seed runner MUST use the TypeORM data source, MUST remain manual and MUST preserve deterministic, idempotent and reset-guarded behavior.

#### Scenario: Foundation seed runs repeatedly

- **Given** the foundation migration has run
- **When** the foundation seed executes more than once
- **Then** it updates or preserves the same logical records without creating duplicates
