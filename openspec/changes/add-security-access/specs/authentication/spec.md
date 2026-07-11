# Especificación delta de autenticación

## Requisitos agregados

### Requisito: Login ligado a organización

La API DEBE autenticar con email, contraseña y slug, y solo DEBE crear una sesión
para usuario, organización y membresía activos.

#### Escenario: Credenciales y membresía válidas

- **Dado** un usuario activo con membresía activa en una organización activa
- **Cuando** envía credenciales y slug válidos
- **Entonces** se crea una sesión ligada a la organización
- **Y** se establecen cookies de access y refresh
- **Y** se devuelve una representación segura del actor

#### Escenario: Algún dato del login es inválido

- **Dado** email, contraseña, organización o membresía inválidos o inactivos
- **Cuando** se intenta login
- **Entonces** la API devuelve siempre el mismo unauthorized genérico
- **Y** no revela qué dato falló

### Requisito: Entrega segura de cookies

Las cookies DEBEN ser HttpOnly, usar `SameSite=Lax`, ser `Secure` en producción
y tener expiración y path apropiados.

#### Escenario: Login exitoso en producción

- **Dado** que la API corre en producción
- **Cuando** el usuario inicia sesión correctamente
- **Entonces** ambas cookies incluyen `HttpOnly` y `Secure`
- **Y** la cookie de refresh se limita al endpoint de refresh

### Requisito: Access tokens de corta duración

La API DEBE validar firma, issuer, audience y expiración, y DEBE ligar cada
request protegido con sesión y organización.

#### Escenario: La sesión fue revocada después de emitir el access token

- **Dado** un access token válido y no vencido que referencia una sesión revocada
- **Cuando** se usa en un endpoint protegido
- **Entonces** la API rechaza el request como unauthorized

### Requisito: Rotación de refresh token

La API DEBE rotar el refresh token atómicamente en cada refresh exitoso y solo
DEBE persistir el hash del token actual.

#### Escenario: Se usa el refresh token actual

- **Dado** una sesión activa y su refresh token vigente
- **Cuando** el cliente hace refresh
- **Entonces** se invalida el token enviado
- **Y** se guarda el hash de un token nuevo
- **Y** se reemplazan ambas cookies

#### Escenario: Se reutiliza un refresh token rotado

- **Dado** un refresh token ya rotado
- **Cuando** se vuelve a enviar
- **Entonces** se revoca la sesión completa
- **Y** se limpian las cookies y se responde unauthorized

### Requisito: Sesiones revocables

El usuario autenticado DEBE poder listar y revocar sus propias sesiones sin
recibir material de refresh tokens.

#### Escenario: El usuario revoca otra sesión propia

- **Dado** un usuario con dos sesiones activas
- **Cuando** revoca una por id
- **Entonces** solo esa sesión queda revocada
- **Y** sus intentos posteriores de access y refresh fallan

### Requisito: Cambio autenticado de contraseña

El usuario DEBE demostrar la contraseña actual para cambiarla y la operación
DEBE revocar sus demás sesiones.

#### Escenario: La contraseña actual es válida

- **Dado** un usuario autenticado con la contraseña actual correcta
- **Cuando** envía una contraseña nueva válida
- **Entonces** se guarda un hash Argon2id nuevo
- **Y** se revocan todas sus demás sesiones
- **Y** se conserva la sesión actual

### Requisito: Logout idempotente

Logout DEBE revocar la sesión actual cuando exista y siempre DEBE limpiar las
cookies.

#### Escenario: Logout recibe un token expirado

- **Dado** cookies expiradas o inválidas
- **Cuando** se solicita logout
- **Entonces** la API responde exitosamente
- **Y** limpia ambas cookies

### Requisito: Validación de Origin

Los requests inseguros autenticados con cookies DEBEN rechazar un `Origin`
ausente o diferente de `WEB_ORIGIN`.

#### Escenario: Se intenta una mutación cross-site

- **Dado** una cookie válida
- **Cuando** un request inseguro contiene un `Origin` no confiable
- **Entonces** la API lo rechaza antes de ejecutar el caso de uso

#### Escenario: La mutación omite Origin

- **Dado** un request con cookie válida
- **Cuando** un método inseguro omite `Origin`
- **Entonces** la API lo rechaza antes de ejecutar el caso de uso
