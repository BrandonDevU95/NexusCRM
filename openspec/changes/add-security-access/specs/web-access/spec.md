# Web access delta specification

## ADDED Requirements

### Requirement: Login experience

The web application MUST validate email, password and organization slug before
submitting login and MUST display a generic authentication failure.

#### Scenario: Login succeeds

- **Given** a signed-out user enters valid login data
- **When** the login request succeeds
- **Then** the web application stores only the safe actor state
- **And** redirects to the protected application shell
- **And** does not read or persist authentication tokens in JavaScript storage

### Requirement: Session restoration

The protected web shell MUST restore actor state through the authenticated API
and MUST avoid rendering protected content before restoration resolves.

#### Scenario: Existing session is valid

- **Given** the browser has valid HttpOnly authentication cookies
- **When** the protected application loads
- **Then** the web application restores the safe actor and organization context
- **And** renders authorized navigation

#### Scenario: Existing session is invalid

- **Given** the browser cookies are expired or revoked
- **When** session restoration fails after at most one refresh attempt
- **Then** client authentication state is cleared
- **And** the user returns to login without a redirect loop

### Requirement: Serialized refresh

The web API client MUST coordinate concurrent unauthorized responses through one
refresh request and MUST retry each original request at most once.

#### Scenario: Multiple requests expire together

- **Given** several requests receive unauthorized because the access token expired
- **When** refresh is still possible
- **Then** the client sends one refresh request
- **And** retries the waiting requests once after successful rotation

### Requirement: Permission-aware interface

The web application MUST hide or disable actions unavailable to the current
actor, while treating API authorization as the source of truth.

#### Scenario: Read-only member opens administration

- **Given** the actor lacks role and membership management permissions
- **When** administration navigation is rendered
- **Then** mutation actions are not offered
- **And** a direct forbidden API response is handled without exposing data

### Requirement: Access management states

Users, memberships, roles and sessions views MUST provide loading, empty,
forbidden and backend-validation error states.

#### Scenario: Membership list is empty

- **Given** a permitted list request returns no matching memberships
- **When** the view renders
- **Then** it shows an explicit empty state
- **And** does not present the result as a loading or error state
