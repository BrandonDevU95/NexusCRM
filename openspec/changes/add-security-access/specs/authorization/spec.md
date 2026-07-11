# Especificación delta de autorización

## Requisitos agregados

### Requisito: Catálogo estable de permisos

El sistema DEBE mantener códigos de permiso globales, únicos e inmutables,
compartidos por API y web.

#### Escenario: El seed de permisos se ejecuta varias veces

- **Dado** el catálogo de Fase 2
- **Cuando** el seed se ejecuta más de una vez
- **Entonces** cada código existe una sola vez
- **Y** las asignaciones de roles siguen siendo válidas

### Requisito: Roles por organización

Cada rol DEBE pertenecer a una organización y su nombre DEBE ser único dentro de
ella.

#### Escenario: Organizaciones distintas usan el mismo nombre

- **Dado** un rol `Sales Manager` en la organización A
- **Cuando** la organización B crea un rol con el mismo nombre
- **Entonces** el rol se crea exclusivamente para B

#### Escenario: Nombre duplicado en la misma organización

- **Dado** un rol con cierto nombre normalizado
- **Cuando** se intenta crear otro igual en la organización actual
- **Entonces** la API rechaza el duplicado

### Requisito: Asignación de permisos a roles

Solo miembros con `roles:manage` DEBEN poder crear roles o reemplazar sus
permisos, y todos los códigos DEBEN existir en el catálogo.

#### Escenario: Se reemplazan los permisos de un rol

- **Dado** un miembro con `roles:manage`
- **Cuando** actualiza un rol actual con códigos válidos
- **Entonces** el rol contiene exactamente el conjunto enviado
- **Y** el cambio aplica a los requests posteriores

### Requisito: Asignación de roles a membresías

Los roles solo DEBEN asignarse a membresías activas de la misma organización.

#### Escenario: El rol pertenece a otra organización

- **Dado** una membresía de A y un rol de B
- **Cuando** se intenta asignar el rol
- **Entonces** la API rechaza la operación sin modificar ninguna organización

### Requisito: Permisos explícitos por endpoint

Cada endpoint sensible DEBE declarar metadata de permisos y DEBE pasar por los
guards de autenticación, organización y permisos.

#### Escenario: El miembro autenticado no tiene permiso

- **Dado** una sesión válida sin el permiso requerido
- **Cuando** se llama al endpoint sensible
- **Entonces** la API responde forbidden
- **Y** el caso de uso no se ejecuta

### Requisito: Evaluación de ability con CASL

La API DEBE construir abilities desde los roles actuales de la membresía y NO
DEBE confiar en la navegación del cliente ni en permisos dentro del token.

#### Escenario: Se retira un permiso del rol

- **Dado** un miembro con access token válido
- **Y** un administrador retira un permiso de su rol
- **Cuando** el miembro hace otro request protegido
- **Entonces** el ability nuevo ya no permite la acción

### Requisito: Continuidad administrativa

La organización DEBE conservar al menos una membresía administrativa activa y el
rol `Admin` protegido NO DEBE poder eliminarse.

#### Escenario: El último administrador perdería acceso

- **Dado** una sola membresía administrativa activa
- **Cuando** una operación intenta suspenderla o retirar su rol administrativo
- **Entonces** el sistema rechaza la operación
