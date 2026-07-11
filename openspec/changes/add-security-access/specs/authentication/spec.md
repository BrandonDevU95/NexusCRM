# Authentication delta specification

## ADDED Requirements

### Requirement: Organization-bound login

The API MUST authenticate with email, password and organization slug and MUST
create a session only for an active user, organization and membership.

#### Scenario: Valid credentials and membership

- **Given** an active user has an active membership in an active organization
- **When** the user submits valid credentials and the organization slug
- **Then** the API creates an organization-bound session
- **And** sets access and refresh cookies
- **And** returns a safe actor and organization representation

#### Scenario: Any login input is invalid

- **Given** the email, password, organization or membership is invalid or inactive
- **When** a login attempt is submitted
- **Then** the API returns the same generic unauthorized response
- **And** does not disclose which input failed

### Requirement: Secure cookie delivery

Authentication cookies MUST be HttpOnly, MUST use `SameSite=Lax`, MUST be secure
in production and MUST have appropriate expiration and path scopes.

#### Scenario: Production login succeeds

- **Given** the API runs in production
- **When** a user authenticates successfully
- **Then** both authentication cookies include `HttpOnly` and `Secure`
- **And** the refresh cookie is scoped to the refresh endpoint

### Requirement: Short-lived access tokens

The API MUST validate access token signature, issuer, audience and expiry and MUST
bind every protected request to its session and organization context.

#### Scenario: Session was revoked after access token issuance

- **Given** a structurally valid unexpired access token references a revoked session
- **When** it is used on a protected endpoint
- **Then** the API rejects the request as unauthorized

### Requirement: Refresh token rotation

The API MUST rotate the refresh token atomically on every successful refresh and
MUST persist only a hash of the current token.

#### Scenario: Current refresh token is used

- **Given** a valid active session and its current refresh token
- **When** the client refreshes the session
- **Then** the API invalidates the submitted token
- **And** stores a hash for a newly issued refresh token
- **And** replaces both authentication cookies

#### Scenario: Rotated refresh token is reused

- **Given** a refresh token has already been rotated
- **When** that old token is submitted again
- **Then** the API revokes the complete session
- **And** clears authentication cookies
- **And** returns an unauthorized response

### Requirement: Revocable user sessions

An authenticated user MUST be able to list and revoke their own sessions without
receiving refresh token material.

#### Scenario: User revokes another own session

- **Given** a user has two active sessions
- **When** the user revokes one session by id
- **Then** only that session is revoked
- **And** subsequent access and refresh attempts for it fail

### Requirement: Authenticated password change

An authenticated user MUST be able to replace their password only after proving
the current password, and the operation MUST revoke their other sessions.

#### Scenario: Current password is valid

- **Given** an authenticated user provides the correct current password
- **When** the user submits a valid new password
- **Then** the system stores a new Argon2id hash
- **And** revokes every other session for that user
- **And** preserves the current session

### Requirement: Idempotent logout

Logout MUST revoke the current session when available and MUST always clear
authentication cookies.

#### Scenario: Logout receives an expired token

- **Given** the browser contains expired or invalid authentication cookies
- **When** logout is requested
- **Then** the API returns a successful idempotent response
- **And** clears both cookies

### Requirement: Origin validation

Unsafe cookie-authenticated requests MUST reject origins that do not match the
configured web origin.

#### Scenario: Cross-site mutation is attempted

- **Given** a valid authentication cookie
- **When** an unsafe request carries an untrusted `Origin`
- **Then** the API rejects the request before the use case executes

#### Scenario: Cookie-authenticated mutation omits origin

- **Given** a request carries a valid authentication cookie
- **When** an unsafe request omits the `Origin` header
- **Then** the API rejects the request before the use case executes
