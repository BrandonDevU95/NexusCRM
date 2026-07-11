# Diseño: seguridad y acceso por organización

## Contexto

NexusCRM es un modular monolith. La autenticación establece actor y tenant; la
autorización consume ese contexto en los límites de cada módulo. El diseño debe
seguir siendo comprensible para que una sola persona pueda implementarlo y
depurarlo.

## Propiedad del dominio

| Módulo          | Es propietario de                                  | No es propietario de                  |
| --------------- | -------------------------------------------------- | ------------------------------------- |
| `users`         | Identidad global, password hash y estado de cuenta | Acceso a organizaciones o roles       |
| `organizations` | Organización y ciclo de vida de membresías         | Credenciales o evaluación de permisos |
| `auth`          | Credenciales, tokens, cookies y sesiones           | Administración de roles               |
| `authorization` | Permisos, roles, abilities de CASL y guards        | Credenciales de autenticación         |

Un módulo accede a datos de otro mediante servicios exportados o contratos de
repositorio, nunca importando repositories privados.

## Modelo de persistencia

### Usuarios

`users` almacena una identidad global por email normalizado:

- `id`
- `email` y `normalized_email`
- `display_name`
- `password_hash`
- `is_active`
- `last_login_at`
- `created_at` y `updated_at`

Las contraseñas usan Argon2id. Los hashes de contraseña y tokens NUNCA DEBEN
aparecer en DTOs, logs o eventos de dominio.

### Membresías de organización

`organization_members` relaciona un usuario con una organización y almacena:

- `id`
- `organization_id`
- `user_id`
- `status`: `active`, `suspended` o `removed`
- `joined_at`
- `created_at` y `updated_at`

La pareja `(organization_id, user_id)` es única. Las membresías se cambian de
estado en lugar de borrarse. Cada request autenticado DEBE resolver usuario,
organización y membresía activos.

### Permisos y roles

`permissions` es un catálogo global e inmutable identificado por códigos
estables como `users:read`. Código y seeds pueden agregar entradas; los
administradores no pueden renombrarlas ni eliminarlas.

Cada registro de `roles` pertenece a una organización, tiene nombre único dentro
de ella y un indicador de protección `is_system`. `role_permissions` asigna
permisos a roles y `organization_member_roles` asigna roles a membresías. No se
permiten permisos directos por usuario.

El rol `Admin` generado por seed está protegido. Toda organización DEBE conservar
al menos una membresía activa con rol administrativo.

### Sesiones y familias de tokens

`sessions` pertenece a un usuario, membresía y organización, y almacena:

- `id` como identificador de la familia de refresh tokens
- `user_id`, `organization_id` y `organization_member_id`
- hash e identificador del refresh token actual
- user agent e IP opcionales
- `expires_at`, `last_used_at`, `revoked_at` y `revoke_reason`
- `created_at` y `updated_at`

Solo el hash actual es válido. El refresh token es un JWT firmado con session id,
token id, subject y contexto de organización. Su valor también se guarda
hasheado en la base de datos.

## Flujo de autenticación

### Login

El login recibe email, contraseña y slug de organización. El servicio:

1. busca al usuario sin revelar si existe;
2. verifica credenciales Argon2id;
3. verifica usuario, organización y membresía activos;
4. crea una sesión ligada a la organización;
5. devuelve un DTO seguro y establece las cookies de access y refresh.

Cualquier fallo de credenciales o membresía devuelve el mismo unauthorized.

### Access token

El access JWT incluye `sub`, `sid`, `organizationId`, `membershipId`, issuer y
audience. No incluye roles ni permisos, para que los cambios de autorización se
apliquen sin esperar su expiración. Cada request protegido consulta el estado
actual.

### Rotación de refresh token

El refresh obtiene un lock transaccional sobre la sesión, verifica JWT y hash,
emite un token id nuevo y reemplaza el hash atómicamente. Reutilizar un token
anterior revoca la sesión completa.

Con refreshes concurrentes puede ocurrir un éxito seguido de una revocación. El
frontend DEBE serializar sus intentos de refresh.

### Cookies y protección cross-site

Las cookies son `HttpOnly`, `SameSite=Lax` y `Secure` en producción. La cookie de
refresh se limita al endpoint de refresh. Logout limpia ambas cookies aunque la
sesión ya sea inválida.

Los requests inseguros autenticados con cookies DEBEN validar `Origin` contra
`WEB_ORIGIN`. CORS por sí solo no se considera protección CSRF.

## Flujo de autorización

1. `AccessTokenGuard` valida firma, issuer, audience y expiración.
2. `OrganizationContextGuard` resuelve usuario, organización, membresía y sesión activos.
3. `PermissionsGuard` obtiene el permiso requerido desde metadata del endpoint.
4. `CaslAbilityFactory` construye el ability a partir de los roles actuales.
5. Los servicios conservan predicados por organización e invariantes críticas.

Los controllers declaran permisos mediante un decorator. Los endpoints públicos
requieren una marca explícita. Estar autenticado nunca implica estar autorizado.

Permisos activos de Fase 2:

- `users:create`, `users:read`, `users:update`, `users:delete`
- `roles:read`, `roles:manage`
- `permissions:read`, `permissions:manage`
- `organizations:read`, `organizations:update`
- `organization-members:create`, `organization-members:read`
- `organization-members:update`, `organization-members:remove`
- `sessions:read`, `sessions:revoke`

`permissions:manage` queda reservado para administración futura; Fase 2 no
expone endpoints que muten el catálogo. Un usuario puede consultar y revocar sus
propias sesiones sin permisos administrativos. Gestionar sesiones ajenas sí
requiere permisos de sesión.

## Superficie de API

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

Los endpoints de lista incluyen paginación, búsqueda y orden estable. Los
`DELETE` desactivan o cambian estados; no borran registros históricos.

Los administradores gestionan acceso mediante membresías, no modificando una
identidad global. `POST /users` crea identidad y membresía actual atómicamente.
El usuario puede actualizar su propio nombre o contraseña. Cambiar contraseña
revoca sus demás sesiones. Fase 2 no expone desactivación global de cuentas.

## Límites del frontend

La feature de auth es responsable de login, logout, restauración de sesión y
refresh serializado. Expone actor y autorización a layouts protegidos. Los API
requests incluyen credentials, pero JavaScript nunca lee las cookies.

Las features de admin/settings contienen las vistas básicas de usuarios,
membresías y roles. La navegación oculta acciones no disponibles, pero la API
sigue siendo la fuente de verdad.

## Eventos e integración futura de auditoría

Los servicios emiten eventos sanitizados para login, revocación de sesión,
cambios de membresía y roles. Fase 2 no persiste audit logs; el módulo futuro
podrá suscribirse sin cambiar contratos de servicios.

## Estrategia de migración

Una migración versionada crea tablas, foreign keys e índices de seguridad.
Extiende `organizations` sin sustituir el registro foundation. `synchronize`
permanece deshabilitado.

## Estrategia de seeds

El orden es: permisos, roles, usuarios, membresías y asignaciones. Emails, slugs
y nombres estables funcionan como claves de idempotencia. Las contraseñas demo
provienen de una variable de entorno exclusiva para seeds no productivos.

## Estrategia de pruebas

- Unit tests: contraseñas, abilities e invariantes de servicios.
- Integration tests: scoping por organización y locking de refresh.
- HTTP integration tests: cookies, guards y contratos de respuesta.
- Web tests: restauración, refresh serializado y navegación por permisos.

Las pruebas se escriben antes o junto a cada corte conforme a `strict_tdd`.

## Alternativas descartadas

- Incluir permisos en JWT: los cambios de roles quedarían obsoletos.
- Roles globales: los tenants no podrían personalizar acceso de forma segura.
- Guardar refresh tokens sin hash: una fuga de DB expondría sesiones.
- Permisos directos por usuario: complican la revisión de acceso.
- Borrar usuarios o membresías: el historial comercial necesitará actores estables.
