# Especificación delta de identidad

## Requisitos agregados

### Requisito: Identidad global de usuario

El sistema DEBE almacenar una identidad global por email normalizado y NUNCA
DEBE exponer password hashes mediante HTTP, logs o eventos.

#### Escenario: Un administrador crea un usuario

- **Dado** un miembro autenticado con `users:create`
- **Cuando** envía email único, nombre y contraseña válidos
- **Entonces** se guarda el email normalizado y un hash Argon2id
- **Y** la respuesta excluye credenciales

#### Escenario: El email solo difiere en mayúsculas

- **Dado** un usuario existente con el mismo email normalizado
- **Cuando** se intenta crear otro con distinto casing
- **Entonces** se rechaza la identidad duplicada

### Requisito: Ciclo de vida de la cuenta

El sistema DEBE conservar identidades globales para referencias históricas y
DEBE limitar sus modificaciones al propietario autenticado.

#### Escenario: El usuario actualiza su perfil

- **Dado** un usuario autenticado
- **Cuando** modifica sus propios campos permitidos
- **Entonces** se actualiza la identidad global
- **Y** credenciales y estado permanecen sin cambios

#### Escenario: Un administrador apunta a otra identidad global

- **Dado** un administrador y otro usuario de la misma organización
- **Cuando** intenta modificar el perfil global o estado del otro usuario
- **Entonces** el sistema rechaza la operación

### Requisito: Administración de usuarios por organización

Los endpoints administrativos DEBEN devolver o modificar únicamente identidades
con membresía en la organización actual.

#### Escenario: El usuario solo pertenece a otra organización

- **Dado** un administrador autenticado en la organización A
- **Y** un usuario que solo pertenece a la organización B
- **Cuando** solicita ese usuario por id
- **Entonces** la API responde como si no estuviera disponible en A

#### Escenario: Un administrador crea un usuario de organización

- **Dado** un miembro con `users:create`
- **Cuando** envía una identidad global nueva
- **Entonces** identidad y membresía actual se crean atómicamente
- **Y** no queda una identidad parcial si falla la membresía

### Requisito: Contrato de lista de usuarios

La lista DEBE proporcionar paginación, búsqueda normalizada y orden estable.

#### Escenario: Un administrador busca usuarios

- **Dado** que existen varios miembros en la organización actual
- **Cuando** un miembro con `users:read` busca por email o nombre
- **Entonces** recibe solo coincidencias de su organización
- **Y** la respuesta incluye metadata de paginación
