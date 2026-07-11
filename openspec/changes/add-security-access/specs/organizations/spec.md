# Organizations delta specification

## ADDED Requirements

### Requirement: Active organization context

Every protected request MUST resolve exactly one active organization and active
membership from the authenticated session.

#### Scenario: Organization is deactivated

- **Given** a session belongs to an organization that becomes inactive
- **When** the session calls a protected endpoint
- **Then** the API rejects the request as unauthorized

### Requirement: Membership lifecycle

Organization memberships MUST transition between `active`, `suspended` and
`removed` states and MUST not be hard-deleted.

#### Scenario: Member is suspended

- **Given** an authenticated administrator has `organization-members:update`
- **When** the administrator suspends a current-organization membership
- **Then** the membership is preserved with `suspended` status
- **And** all sessions for that membership are revoked

#### Scenario: Removed member is added again

- **Given** a user has a removed membership in the current organization
- **When** an authorized administrator adds the same user again
- **Then** the existing membership transitions to active
- **And** no duplicate organization-user pair is created

### Requirement: Organization isolation

Organization and membership repositories MUST require an explicit
`organizationId` for tenant-scoped reads and writes.

#### Scenario: Identifier belongs to another organization

- **Given** an actor is authenticated in organization A
- **And** a membership id belongs to organization B
- **When** the actor requests or mutates that membership
- **Then** no organization B data is returned or changed

### Requirement: Current organization management

Members with `organizations:read` MUST be able to view their current organization
and members with `organizations:update` MUST be able to update allowed settings.

#### Scenario: Organization settings are updated

- **Given** an authenticated member has `organizations:update`
- **When** the member submits a valid name, timezone or currency
- **Then** only the current organization is updated
- **And** immutable identifiers are unchanged

### Requirement: Membership list contract

The membership list MUST provide pagination, search, status filters and stable
sorting within the current organization.

#### Scenario: Administrator filters suspended members

- **Given** active and suspended memberships exist in the current organization
- **When** a member with `organization-members:read` filters by `suspended`
- **Then** only suspended current-organization memberships are returned
- **And** pagination metadata is included

### Requirement: Idempotent security seeds

Phase 2 seeds MUST create demo users, organization memberships, roles and
permission assignments deterministically without storing real credentials.

#### Scenario: Security seeds run twice

- **Given** the foundation organization exists
- **When** Phase 2 seeds execute twice with the same configuration
- **Then** logical users, memberships, roles and assignments are not duplicated
- **And** the organization retains an active administrator
