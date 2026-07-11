# Design: security and organization access

## Context

NexusCRM is a modular monolith. Authentication establishes an actor and tenant
context; authorization consumes that context at module boundaries. The design
must remain understandable enough for one maintainer to implement and debug.

## Domain ownership

| Module          | Owns                                                  | Does not own                         |
| --------------- | ----------------------------------------------------- | ------------------------------------ |
| `users`         | Global identity, password hash, account state         | Organization access or roles         |
| `organizations` | Organization and membership lifecycle                 | Credentials or permission evaluation |
| `auth`          | Credential verification, tokens, cookies and sessions | Role administration                  |
| `authorization` | Permissions, roles, CASL abilities and guards         | Authentication credentials           |

Modules access another module's data through exported services or repository
contracts, not by importing private repositories.

## Persistence model

### Users

`users` stores one global identity per normalized email:

- `id`
- `email` and `normalized_email`
- `display_name`
- `password_hash`
- `is_active`
- `last_login_at`
- `created_at` and `updated_at`

Passwords use Argon2id. Password hashes and token hashes MUST never appear in
DTOs, logs or domain events.

### Organization memberships

`organization_members` joins a user to one organization and stores:

- `id`
- `organization_id`
- `user_id`
- `status`: `active`, `suspended` or `removed`
- `joined_at`
- `created_at` and `updated_at`

The `(organization_id, user_id)` pair is unique. Historical memberships are
status-transitioned rather than hard-deleted. Every authenticated request MUST
resolve an active user, active organization and active membership.

### Permissions and roles

`permissions` is a global immutable catalog keyed by a stable code such as
`users:read`. Application code and seeds may add catalog entries; organization
administrators cannot rename or delete them.

`roles` belongs to one organization and stores a unique name within that
organization plus an `is_system` protection flag. `role_permissions` assigns catalog permissions to a role, and
`organization_member_roles` assigns roles to memberships. Direct per-user
permission grants are intentionally excluded.

The seeded `Admin` role is protected from deletion. An organization MUST always
retain at least one active membership with an administrative role.

### Sessions and token families

`sessions` belongs to a user, membership and organization and stores:

- `id` used as the refresh token family identifier
- `user_id`, `organization_id` and `organization_member_id`
- current refresh token hash and token identifier
- optional user agent and IP metadata
- `expires_at`, `last_used_at`, `revoked_at` and `revoke_reason`
- `created_at` and `updated_at`

Only the current refresh token hash is valid. Refresh tokens are signed JWTs
containing the session id, token id, subject and organization context. The token
value is additionally hashed before persistence.

## Authentication flow

### Login

Login accepts normalized email, password and organization slug. The service:

1. loads the user without exposing whether it exists;
2. verifies Argon2id credentials;
3. verifies active user, organization and membership states;
4. creates an organization-bound session;
5. returns a safe actor/session DTO and sets access and refresh cookies.

All credential and membership failures return the same unauthorized response.

### Access token

The short-lived access JWT contains `sub`, `sid`, `organizationId`,
`membershipId`, issuer and audience. Roles and permissions are not embedded so
role changes take effect without waiting for token expiration. The API resolves
current authorization state for protected requests.

### Refresh rotation

Refresh acquires a transaction lock on the session, verifies the JWT and stored
hash, issues a new token id and replaces the stored hash atomically. A second
use of an old token is treated as reuse and revokes the complete session.

Concurrent refresh requests may result in one success and one revoked session;
the frontend MUST serialize refresh attempts.

### Cookies and cross-site protection

Access and refresh cookies are `HttpOnly`, `SameSite=Lax` and `Secure` in
production. The refresh cookie is scoped to the refresh endpoint. Logout clears
both cookies even when the server session is already invalid.

Unsafe cookie-authenticated requests MUST validate their `Origin` against
`WEB_ORIGIN`. CORS configuration alone is not treated as CSRF protection.

## Authorization flow

1. `AccessTokenGuard` validates signature, issuer, audience and expiry.
2. `OrganizationContextGuard` resolves active user, organization, membership and
   session context.
3. `PermissionsGuard` reads required permission metadata from the endpoint.
4. `CaslAbilityFactory` builds an ability from the membership's current roles.
5. Services still enforce organization predicates and critical invariants.

Controllers declare permissions through a decorator. Public endpoints require an
explicit public marker. Authentication never implies authorization.

The first permission additions for Phase 2 are:

- `users:create`, `users:read`, `users:update`, `users:delete`
- `roles:read`, `roles:manage`
- `permissions:read`, `permissions:manage`
- `organizations:read`, `organizations:update`
- `organization-members:create`, `organization-members:read`
- `organization-members:update`, `organization-members:remove`
- `sessions:read`, `sessions:revoke`

`permissions:manage` remains a reserved catalog code for future controlled
administration; Phase 2 does not expose permission mutation endpoints.

Users may view and revoke their own sessions without an administrative
permission. Managing another user's sessions requires the session permissions.

## API surface

The initial API is intentionally small:

- `POST /auth/login`
- `POST /auth/refresh`
- `POST /auth/logout`
- `PUT /auth/password`
- `GET /auth/me`
- `GET /auth/sessions`
- `DELETE /auth/sessions/:sessionId`
- `GET /users`, `POST /users`, `GET /users/:id`, `PATCH /users/me`
- `GET /organizations/current`, `PATCH /organizations/current`
- `GET /organizations/current/members`
- `POST /organizations/current/members`
- `PATCH /organizations/current/members/:memberId`
- `DELETE /organizations/current/members/:memberId`
- `GET /authorization/permissions`
- `GET /authorization/roles`, `POST /authorization/roles`
- `PATCH /authorization/roles/:roleId`
- `DELETE /authorization/roles/:roleId`

List endpoints use pagination, search and stable sorting. `DELETE` operations in
this phase deactivate or status-transition records rather than hard-delete them.

Organization administrators manage access through memberships; they do not
deactivate or rewrite a global identity. `POST /users` creates a new identity and
current-organization membership atomically. An authenticated user may update
their own display name or password. Password changes revoke the user's other
sessions. Global account deactivation has no Phase 2 HTTP endpoint.

## Frontend boundaries

The auth feature owns login, logout, session restoration and serialized refresh.
It exposes actor and authorization state to protected layouts. API calls include
credentials but never read authentication cookies from JavaScript.

Admin/settings features own basic user, membership and role management views.
Navigation hides unavailable actions, while the API remains the source of truth.

## Events and future audit integration

Services emit sanitized events for login success/failure, session revocation,
membership state changes and role changes. Phase 2 does not persist audit logs;
the future audit module may subscribe without changing the service contracts.

## Migration strategy

One versioned Phase 2 migration creates the security tables, foreign keys and
indexes. It evolves the existing `organizations` table without replacing its
foundation record. `synchronize` remains disabled.

## Seed strategy

Seeds run in dependency order: permissions, organization roles, users,
memberships and role assignments. Stable emails, slugs and role names are used as
natural idempotency keys. Demo passwords come only from a non-production seed
environment variable and are never committed as real credentials.

## Testing strategy

- Unit tests cover password verification, abilities and service invariants.
- Repository integration tests cover organization scoping and refresh locking.
- HTTP integration tests cover cookies, guards and response contracts.
- Web tests cover session restoration, serialized refresh and permission-driven
  navigation.

Tests are written before or alongside each implementation slice under the
project's strict TDD rule.

## Alternatives rejected

- Embedding permissions in access JWTs: role changes would remain stale.
- Global roles shared by all organizations: tenants could not safely customize
  access.
- Storing raw refresh tokens: a database leak would immediately expose sessions.
- Direct user permissions: they complicate access review and are unnecessary for
  the first release.
- Hard-deleting memberships or users: future commercial history needs stable
  actor references.
