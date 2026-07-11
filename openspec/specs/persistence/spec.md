# Persistence specification

## Requirements

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

### Requirement: Entry-point environment validation

The API, migration CLI and seed runner MUST reject invalid required environment configuration before performing application or database work.

#### Scenario: API secrets are invalid

- **Given** an application environment with missing, short or reused JWT secrets
- **When** the API validates its runtime configuration
- **Then** startup fails with a validation error before modules initialize

### Requirement: Consistent global HTTP handling

The API MUST normalize HTTP error responses, MUST hide unexpected internal error details and MUST log request completion and failure.

#### Scenario: Unexpected endpoint failure

- **Given** an endpoint throws an unexpected error
- **When** the global exception filter handles it
- **Then** the client receives a generic 500 response containing the request path

### Requirement: Enforced workspace quality gates

Every executable or shared workspace MUST run real lint and tests rather than placeholder commands or empty test suites.

#### Scenario: Root quality commands run

- **Given** dependencies are installed for all workspaces
- **When** root lint, typecheck and test commands execute
- **Then** API, web and shared source code is validated successfully
