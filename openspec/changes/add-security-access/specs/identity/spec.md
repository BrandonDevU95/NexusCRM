# Identity delta specification

## ADDED Requirements

### Requirement: Global user identity

The system MUST store one global user identity per normalized email and MUST
never expose password hashes through HTTP contracts, logs or events.

#### Scenario: Administrator creates a user

- **Given** an authenticated member with `users:create`
- **When** the member submits a valid unique email, display name and password
- **Then** the system stores the normalized email and an Argon2id password hash
- **And** the response excludes credential fields

#### Scenario: Email differs only by case

- **Given** a user already exists with a normalized email
- **When** an administrator creates another user with different email casing
- **Then** the system rejects the duplicate identity

### Requirement: User account lifecycle

The system MUST preserve global user records needed by future historical
references and MUST limit identity updates to the authenticated owner.

#### Scenario: User updates their profile

- **Given** an authenticated user
- **When** the user updates their own allowed profile fields
- **Then** the global identity is updated
- **And** credential and account-state fields remain unchanged

#### Scenario: Organization administrator targets another global identity

- **Given** an administrator and another user belong to the same organization
- **When** the administrator attempts to update the other user's global profile or account state
- **Then** the system rejects the operation

### Requirement: Organization-scoped user administration

User administration endpoints MUST return or modify only identities connected to
the actor's current organization through a membership.

#### Scenario: User belongs only to another organization

- **Given** an administrator authenticated in organization A
- **And** a user belongs only to organization B
- **When** the administrator requests that user by id
- **Then** the API responds as if the user were not available in organization A

#### Scenario: Administrator creates an organization user

- **Given** an authenticated member with `users:create`
- **When** the member submits a new global identity
- **Then** the identity and current-organization membership are created atomically
- **And** a partial identity is not retained if membership creation fails

### Requirement: User list contract

The users list MUST provide pagination, normalized search and stable sorting.

#### Scenario: Administrator searches users

- **Given** multiple members exist in the current organization
- **When** an authenticated member with `users:read` searches by email or display name
- **Then** the API returns only matching organization members
- **And** includes pagination metadata
