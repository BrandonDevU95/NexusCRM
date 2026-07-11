# Tasks: add security and organization access

Implement in order. Each behavior task is complete only when its corresponding
test passes and organization isolation has been reviewed.

## 1. SDD and shared contracts

- [ ] Review and accept the Phase 2 proposal, design and delta specifications.
- [ ] Define shared DTO-safe types for authenticated actor, organization context and pagination.
- [ ] Add Phase 2 organization, membership and session permission codes.
- [ ] Add typed membership statuses and stable role names where shared use is required.
- [ ] Add shared catalog tests for uniqueness and permission code format.

## 2. Migration and entity model

- [ ] Write entity metadata tests for security relations, indexes and hidden credential columns.
- [ ] Add the global user entity with normalized-email uniqueness and inactive state.
- [ ] Add the organization membership entity with unique organization-user membership.
- [ ] Add permission, role, role-permission and member-role entities.
- [ ] Add the session entity with organization, membership, expiry and revocation fields.
- [ ] Register Phase 2 entities explicitly in the TypeORM data source.
- [ ] Create one explicit Phase 2 migration with tables, foreign keys and indexes.
- [ ] Confirm the migration preserves the existing foundation organization.
- [ ] Confirm automatic schema synchronization remains disabled.

## 3. User identity slice

- [ ] Write tests for email normalization and duplicate identity rejection.
- [ ] Write tests proving password hashes never leave user services or serializers.
- [ ] Implement user DTOs with backend validation and safe response mapping.
- [ ] Implement the user repository with explicit organization-scoped administration queries.
- [ ] Implement Argon2id password hashing and verification behind a dedicated service.
- [ ] Implement atomic user and current-organization membership creation.
- [ ] Implement organization-scoped user read and list use cases.
- [ ] Implement self-profile update without administrative global identity mutation.
- [ ] Implement authenticated password change and revoke other user sessions.
- [ ] Expose user endpoints with pagination, search, validation and Swagger contracts.

## 4. Organization membership slice

- [ ] Write repository tests proving membership reads and writes require `organizationId`.
- [ ] Write service tests for active, suspended and removed transitions.
- [ ] Write tests for reactivating an existing removed membership without duplication.
- [ ] Implement current-organization DTOs and safe response mapping.
- [ ] Implement organization repository operations for current-tenant settings only.
- [ ] Implement membership repository operations with organization predicates.
- [ ] Implement current organization read and allowed-settings update use cases.
- [ ] Implement membership list, add, suspend, reactivate and remove use cases.
- [ ] Revoke membership sessions on suspension or removal.
- [ ] Expose organization and membership endpoints with pagination, filters and Swagger contracts.

## 5. Permission and role slice

- [ ] Write tests for immutable permission codes and idempotent catalog upserts.
- [ ] Write tests for role-name uniqueness within one organization.
- [ ] Write tests rejecting cross-organization role assignments.
- [ ] Write tests protecting the seeded `Admin` role and last active administrator.
- [ ] Implement permission and role DTOs with validation.
- [ ] Implement permission catalog read operations.
- [ ] Implement organization-scoped role repositories.
- [ ] Implement role create, list, update-permissions and deactivate/delete use cases.
- [ ] Implement membership role replacement inside one organization transaction.
- [ ] Expose permission and role endpoints with Swagger contracts.

## 6. Authentication primitives

- [ ] Write tests for access and refresh JWT claims, issuer, audience and expiry.
- [ ] Write tests for hashing and constant-time comparison of refresh tokens.
- [ ] Write tests for production and development cookie attributes.
- [ ] Add validated cookie names and seed credential variables without committing secrets.
- [ ] Implement access and refresh token services using separate secrets.
- [ ] Implement centralized authentication cookie creation and clearing.
- [ ] Implement sanitized authentication event contracts.

## 7. Login and authenticated context

- [ ] Write login tests for valid credentials and organization membership.
- [ ] Write table-driven tests proving login failures use one generic response.
- [ ] Write tests rejecting inactive users, organizations and memberships.
- [ ] Implement organization-bound login and session creation.
- [ ] Implement `AccessTokenGuard` with signature, issuer, audience and expiry validation.
- [ ] Implement `OrganizationContextGuard` with current database state checks.
- [ ] Implement typed request actor/context accessors.
- [ ] Implement `GET /auth/me` without credential or token material.
- [ ] Add explicit public-route metadata for login, refresh and health endpoints.

## 8. Refresh rotation and session lifecycle

- [ ] Write a repository integration test for transaction-locked refresh rotation.
- [ ] Write a concurrency test where one of two refresh attempts invalidates the session family.
- [ ] Write tests for expired, revoked and mismatched refresh tokens.
- [ ] Implement atomic refresh token rotation and session last-used updates.
- [ ] Implement refresh reuse detection and complete session revocation.
- [ ] Implement idempotent logout and cookie clearing.
- [ ] Implement own-session list and revoke use cases.
- [ ] Implement administrative session read/revoke policies for other users.
- [ ] Expose refresh, logout and session endpoints with safe DTOs and Swagger contracts.

## 9. CASL and permission enforcement

- [ ] Write ability tests for representative admin, sales, support, warehouse and read-only roles.
- [ ] Write guard tests for unauthenticated, forbidden and allowed requests.
- [ ] Write tests proving role changes affect subsequent requests without new access tokens.
- [ ] Implement the CASL ability factory from current membership roles.
- [ ] Implement required-permission metadata and decorator.
- [ ] Implement the permissions guard and consistent forbidden response.
- [ ] Apply explicit permissions to every Phase 2 sensitive endpoint.
- [ ] Confirm services retain organization predicates even after guard authorization.

## 10. Cookie request protection

- [ ] Write tests for trusted, missing and untrusted origins on unsafe requests.
- [ ] Implement unsafe-method origin validation against `WEB_ORIGIN`.
- [ ] Confirm safe methods and explicitly public authentication endpoints behave as designed.
- [ ] Add security-focused Swagger notes without exposing cookie values or secrets.

## 11. Web authentication foundation

- [ ] Write web service tests proving requests use credentials without reading HttpOnly cookies.
- [ ] Write tests for serialized refresh when multiple requests receive unauthorized responses.
- [ ] Implement the typed auth API client and safe actor/session types.
- [ ] Implement one serialized refresh coordinator with a single retry limit.
- [ ] Implement login form schema and organization-slug field validation.
- [ ] Implement login, logout and session restoration flows.
- [ ] Add protected and forbidden states to the application shell.
- [ ] Ensure failed session restoration clears client auth state without redirect loops.

## 12. Web access management

- [ ] Write component/hook tests for permission-driven navigation and actions.
- [ ] Implement reusable permission checks for display only, never as API enforcement.
- [ ] Implement basic current-organization settings view.
- [ ] Implement paginated users and organization-members views.
- [ ] Implement member status and role assignment forms with Zod validation.
- [ ] Implement roles and permission-assignment views.
- [ ] Implement own-session list and revoke controls.
- [ ] Provide loading, empty, forbidden and backend-validation error states.

## 13. Modular security seeds

- [ ] Add a non-production seed credential variable and validation contract.
- [ ] Write seed tests for deterministic and idempotent permission creation.
- [ ] Write seed tests for role, user, membership and assignment idempotency.
- [ ] Implement permission catalog seed before role seeds.
- [ ] Implement organization role and permission assignment seeds.
- [ ] Implement demo user and membership seeds with Argon2id password hashes.
- [ ] Protect seeded administrator continuity during reset.
- [ ] Register security seeds in dependency order.
- [ ] Document demo credentials without committing a real reusable password.

## 14. Integrated verification and documentation

- [ ] Run the Phase 2 migration against a fresh local database.
- [ ] Run all security seeds twice and verify logical record counts are unchanged.
- [ ] Exercise login, refresh rotation, reuse detection, logout and session revocation through HTTP.
- [ ] Verify cross-organization identifiers never expose or mutate another tenant.
- [ ] Verify every Phase 2 endpoint appears in Swagger with auth and error contracts.
- [ ] Run lint, type checking, tests and production dependency audit.
- [ ] Run the production build only when closing the `v0.2.0` milestone.
- [ ] Update module READMEs and architecture documentation with final implemented behavior.
- [ ] Promote accepted delta specs, archive this change and publish `v0.2.0`.
