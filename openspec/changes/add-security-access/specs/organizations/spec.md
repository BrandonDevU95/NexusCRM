# Especificación delta de organizaciones

## Requisitos agregados

### Requisito: Contexto de organización activo

Cada request protegido DEBE resolver exactamente una organización y una
membresía activas desde la sesión.

#### Escenario: La organización fue desactivada

- **Dado** una sesión ligada a una organización ahora inactiva
- **Cuando** llama un endpoint protegido
- **Entonces** la API responde unauthorized

### Requisito: Ciclo de vida de membresías

Las membresías DEBEN transicionar entre `active`, `suspended` y `removed`, y NO
DEBEN borrarse físicamente.

#### Escenario: Se suspende un miembro

- **Dado** un administrador con `organization-members:update`
- **Cuando** suspende una membresía de su organización
- **Entonces** se conserva con estado `suspended`
- **Y** se revocan todas sus sesiones

#### Escenario: Se agrega nuevamente un miembro removido

- **Dado** un usuario con membresía `removed`
- **Cuando** un administrador lo agrega otra vez
- **Entonces** la membresía existente pasa a `active`
- **Y** no se duplica la pareja organización-usuario

### Requisito: Aislamiento por organización

Los repositories DEBEN exigir `organizationId` explícito para lecturas y
escrituras con alcance de tenant.

#### Escenario: El identificador pertenece a otra organización

- **Dado** un actor autenticado en A y una membresía de B
- **Cuando** intenta consultar o modificar esa membresía
- **Entonces** no se devuelve ni modifica información de B

### Requisito: Gestión de la organización actual

Un miembro con `organizations:read` DEBE poder consultar su organización y uno
con `organizations:update` DEBE poder modificar la configuración permitida.

#### Escenario: Se actualiza la configuración

- **Dado** un miembro con `organizations:update`
- **Cuando** envía nombre, timezone o currency válidos
- **Entonces** solo se actualiza la organización actual
- **Y** los identificadores inmutables no cambian

### Requisito: Contrato de lista de membresías

La lista DEBE ofrecer paginación, búsqueda, filtro de estado y orden estable
dentro de la organización actual.

#### Escenario: Se filtran miembros suspendidos

- **Dado** membresías activas y suspendidas
- **Cuando** un miembro con `organization-members:read` filtra `suspended`
- **Entonces** recibe solo membresías suspendidas de su organización
- **Y** metadata de paginación

### Requisito: Seeds de seguridad idempotentes

Los seeds DEBEN crear usuarios demo, membresías, roles y asignaciones de forma
determinística, sin usar credenciales reales.

#### Escenario: Los seeds se ejecutan dos veces

- **Dado** la organización foundation
- **Cuando** los seeds de Fase 2 se ejecutan dos veces
- **Entonces** no se duplican registros lógicos
- **Y** la organización conserva un administrador activo
