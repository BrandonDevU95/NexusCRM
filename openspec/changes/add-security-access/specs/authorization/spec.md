# Authorization delta specification

## ADDED Requirements

### Requirement: Stable permission catalog

The system MUST maintain globally unique immutable permission codes shared by the
API and web applications.

#### Scenario: Permission seed runs repeatedly

- **Given** the Phase 2 permission catalog exists
- **When** the permission seed runs more than once
- **Then** each permission code exists exactly once
- **And** existing role assignments remain valid

### Requirement: Organization-scoped roles

Every role MUST belong to one organization and role names MUST be unique within
that organization.

#### Scenario: Same role name is used by different organizations

- **Given** organization A has a role named `Sales Manager`
- **When** organization B creates a role with the same name
- **Then** the role is created only for organization B

#### Scenario: Duplicate role name is used in one organization

- **Given** the current organization has a role with a normalized name
- **When** an administrator creates another role with that name
- **Then** the API rejects the duplicate

### Requirement: Role permission assignment

Only members with `roles:manage` MUST be able to create roles or replace their
permission assignments, and assigned codes MUST exist in the catalog.

#### Scenario: Role permissions are replaced

- **Given** an authenticated member has `roles:manage`
- **When** the member updates a current-organization role with valid permission codes
- **Then** the role contains exactly the submitted permission set
- **And** authorization changes apply to subsequent requests

### Requirement: Membership role assignment

Roles MUST be assignable only to active memberships from the same organization.

#### Scenario: Role belongs to another organization

- **Given** a membership belongs to organization A
- **And** a role belongs to organization B
- **When** an administrator attempts the assignment
- **Then** the API rejects it without modifying either organization

### Requirement: Explicit endpoint permissions

Every sensitive endpoint MUST declare required permission metadata and MUST be
evaluated by the authentication, organization-context and permissions guards.

#### Scenario: Authenticated member lacks permission

- **Given** an active member has a valid session but lacks the endpoint permission
- **When** the member calls the sensitive endpoint
- **Then** the API returns forbidden
- **And** the use case does not execute

### Requirement: CASL ability evaluation

The API MUST build CASL abilities from the membership's current organization
roles and MUST not rely on client navigation or token-embedded permissions.

#### Scenario: Role permission is removed

- **Given** a member has a valid access token
- **And** an administrator removes a permission from the member's role
- **When** the member makes a subsequent protected request
- **Then** the new ability no longer permits that action

### Requirement: Administrative continuity

An organization MUST retain at least one active administrative membership and
the protected seeded `Admin` role MUST not be deletable.

#### Scenario: Last administrator would lose access

- **Given** an organization has one active administrative membership
- **When** an operation would suspend it or remove its administrative role
- **Then** the system rejects the operation
