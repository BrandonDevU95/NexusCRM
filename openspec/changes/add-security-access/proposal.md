# Proposal: add security and organization access

## Summary

Implement the `v0.2.0` security foundation for NexusCRM: users, organization
memberships, authentication, revocable sessions, refresh token rotation,
organization-scoped roles, explicit permissions and CASL authorization.

## Motivation

Every business module after the foundation depends on a trustworthy actor and
organization context. NexusCRM needs to authenticate users, isolate tenants and
authorize sensitive operations before customer or commercial data is added.

## Goals

- Model global user identities and organization-scoped memberships.
- Authenticate with secure HttpOnly cookies and generic credential errors.
- Issue short-lived access tokens and rotate refresh tokens on every use.
- Detect refresh token reuse and revoke the affected session family.
- Make sessions visible and revocable by their owner.
- Define a stable permission catalog shared by API and web.
- Assign organization-scoped roles to active memberships.
- Enforce permissions and organization context through NestJS guards and CASL.
- Provide basic web flows for login, session restoration and access management.
- Add deterministic, idempotent seeds for demo users, roles and permissions.

## Affected areas

- `apps/api/src/modules/auth`
- `apps/api/src/modules/users`
- `apps/api/src/modules/authorization`
- `apps/api/src/modules/organizations`
- `apps/api/src/database`
- `apps/web/src/features/auth`
- `apps/web/src/features/admin`
- `apps/web/src/features/settings`
- `packages/shared`

## Out of scope

- Public self-registration and organization self-service signup.
- Email delivery, invitations and email verification.
- Password reset and account recovery flows.
- Multi-factor authentication and external identity providers.
- Persistent audit/security logs, which belong to the `v0.9.0` audit phase.
- Field-level permissions and user-specific permission overrides.
- Impersonation or a platform-wide authorization bypass.

## Dependencies

- The TypeORM foundation and migration workflow from `v0.1.0`.
- The existing organization foundation record and modular seed runner.
- The shared permission and role catalogs.

## Risks

- A missing organization predicate could expose tenant data.
- Incorrect refresh rotation could allow a stolen token to remain usable.
- Cookie authentication could be vulnerable to cross-site requests.
- Role edits could accidentally remove the last organization administrator.

The design and specifications define mandatory guards and invariants for each
risk.

## Rollback

Revert the change branch, revert the Phase 2 migration and restore the previous
shared catalogs. Existing foundation organization and settings records MUST be
preserved. Rollback invalidates all Phase 2 sessions and requires users to sign
in again after reapplication.
