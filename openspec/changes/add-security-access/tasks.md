# Tareas: agregar seguridad y acceso por organización

Implementar en orden. Una tarea de comportamiento solo se completa cuando pasa
su prueba y se revisó el aislamiento por organización.

## 1. SDD y contratos compartidos

- [ ] Revisar y aceptar propuesta, diseño y especificaciones delta de Fase 2.
- [ ] Definir tipos seguros para actor autenticado, contexto de organización y paginación.
- [ ] Agregar permisos de organizaciones, membresías y sesiones.
- [ ] Agregar estados de membresía y nombres de roles compartidos necesarios.
- [ ] Probar unicidad de catálogos y formato de códigos de permiso.

## 2. Migración y modelo de entidades

- [ ] Probar metadata de relaciones, índices y columnas de credenciales ocultas.
- [ ] Agregar entidad global de usuario con email normalizado único.
- [ ] Agregar entidad de membresía con pareja organización-usuario única.
- [ ] Agregar entidades de permisos, roles y sus tablas de relación.
- [ ] Agregar entidad de sesión con organización, expiración y revocación.
- [ ] Registrar explícitamente las entidades de Fase 2 en TypeORM.
- [ ] Crear una migración explícita con tablas, foreign keys e índices.
- [ ] Confirmar que la migración conserva la organización foundation.
- [ ] Confirmar que `synchronize` permanece deshabilitado.

## 3. Corte de identidad de usuario

- [ ] Probar normalización de email y rechazo de duplicados.
- [ ] Probar que password hashes no salen de servicios o serializers.
- [ ] Implementar DTOs con validación backend y respuestas seguras.
- [ ] Implementar repository con consultas administrativas por organización.
- [ ] Encapsular hashing y verificación Argon2id en un servicio.
- [ ] Implementar creación atómica de usuario y membresía actual.
- [ ] Implementar consulta y lista de usuarios por organización.
- [ ] Implementar actualización del perfil propio, no de identidades ajenas.
- [ ] Implementar cambio de contraseña y revocación de otras sesiones.
- [ ] Exponer endpoints con paginación, búsqueda, validación y Swagger.

## 4. Corte de membresías

- [ ] Probar que lecturas y escrituras exigen `organizationId`.
- [ ] Probar transiciones `active`, `suspended` y `removed`.
- [ ] Probar reactivación sin duplicar una membresía removida.
- [ ] Implementar DTOs de organización actual y respuestas seguras.
- [ ] Implementar repository para configuración del tenant actual.
- [ ] Implementar repository de membresías con predicados de organización.
- [ ] Implementar consulta y actualización permitida de organización actual.
- [ ] Implementar lista, alta, suspensión, reactivación y remoción.
- [ ] Revocar sesiones al suspender o remover una membresía.
- [ ] Exponer endpoints con paginación, filtros y Swagger.

## 5. Corte de permisos y roles

- [ ] Probar códigos inmutables y upserts idempotentes de permisos.
- [ ] Probar unicidad de nombre de rol dentro de una organización.
- [ ] Probar rechazo de asignaciones entre organizaciones.
- [ ] Probar protección del rol `Admin` y del último administrador.
- [ ] Implementar DTOs de permisos y roles.
- [ ] Implementar consulta del catálogo de permisos.
- [ ] Implementar repositories de roles por organización.
- [ ] Implementar creación, lista, actualización de permisos y desactivación de roles.
- [ ] Implementar reemplazo transaccional de roles de una membresía.
- [ ] Exponer endpoints de permisos y roles con Swagger.

## 6. Primitivas de autenticación

- [ ] Probar claims, issuer, audience y expiración de JWTs.
- [ ] Probar hash y comparación constante de refresh tokens.
- [ ] Probar atributos de cookies en development y production.
- [ ] Agregar nombres de cookies y variables de seed validadas, sin secretos reales.
- [ ] Implementar servicios separados para access y refresh tokens.
- [ ] Centralizar creación y limpieza de cookies.
- [ ] Implementar contratos sanitizados de eventos de autenticación.

## 7. Login y contexto autenticado

- [ ] Probar login válido con membresía de organización.
- [ ] Probar en tabla que todos los fallos usan una respuesta genérica.
- [ ] Probar rechazo de usuario, organización o membresía inactivos.
- [ ] Implementar login ligado a organización y creación de sesión.
- [ ] Implementar `AccessTokenGuard` con validación JWT completa.
- [ ] Implementar `OrganizationContextGuard` consultando estado actual.
- [ ] Implementar accessors tipados para actor y contexto.
- [ ] Implementar `GET /auth/me` sin credenciales ni tokens.
- [ ] Marcar explícitamente login, refresh y health como públicos.

## 8. Rotación y ciclo de vida de sesiones

- [ ] Probar con integración el lock transaccional durante refresh.
- [ ] Probar concurrencia donde dos refreshes invalidan la familia.
- [ ] Probar tokens expirados, revocados y no coincidentes.
- [ ] Implementar rotación atómica y actualización de `last_used_at`.
- [ ] Implementar detección de reuse y revocación completa.
- [ ] Implementar logout idempotente y limpieza de cookies.
- [ ] Implementar lista y revocación de sesiones propias.
- [ ] Implementar policies administrativas para sesiones ajenas.
- [ ] Exponer endpoints con DTOs seguros y Swagger.

## 9. CASL y aplicación de permisos

- [ ] Probar abilities de roles admin, ventas, soporte, almacén y read-only.
- [ ] Probar guards para requests sin autenticar, forbidden y permitidos.
- [ ] Probar que cambiar un rol afecta requests posteriores sin token nuevo.
- [ ] Implementar `CaslAbilityFactory` desde roles actuales.
- [ ] Implementar metadata y decorator de permiso requerido.
- [ ] Implementar `PermissionsGuard` y respuesta forbidden consistente.
- [ ] Aplicar permisos explícitos a todos los endpoints sensibles de Fase 2.
- [ ] Confirmar que los servicios conservan predicados de organización.

## 10. Protección de requests con cookies

- [ ] Probar origins confiables, ausentes y no confiables en métodos inseguros.
- [ ] Validar `Origin` contra `WEB_ORIGIN`.
- [ ] Confirmar comportamiento de métodos seguros y endpoints públicos.
- [ ] Documentar seguridad en Swagger sin revelar cookies ni secretos.

## 11. Foundation de autenticación web

- [ ] Probar que el API client usa credentials sin leer cookies HttpOnly.
- [ ] Probar refresh serializado ante respuestas unauthorized concurrentes.
- [ ] Implementar API client y tipos seguros de actor/sesión.
- [ ] Implementar un coordinador de refresh con un solo retry.
- [ ] Implementar schema del login y validación del slug.
- [ ] Implementar login, logout y restauración de sesión.
- [ ] Agregar estados protegido y forbidden al shell.
- [ ] Evitar redirect loops al fallar la restauración.

## 12. Gestión de acceso web

- [ ] Probar navegación y acciones condicionadas por permisos.
- [ ] Implementar checks visuales sin sustituir autorización de API.
- [ ] Implementar vista básica de configuración de organización.
- [ ] Implementar vistas paginadas de usuarios y membresías.
- [ ] Implementar formularios de estado y roles con Zod.
- [ ] Implementar vistas de roles y asignación de permisos.
- [ ] Implementar lista y revocación de sesiones propias.
- [ ] Cubrir estados loading, vacío, forbidden y errores backend.

## 13. Seeds modulares de seguridad

- [ ] Agregar variable no productiva para contraseña demo.
- [ ] Probar creación determinística e idempotente de permisos.
- [ ] Probar idempotencia de roles, usuarios, membresías y asignaciones.
- [ ] Implementar seed de permisos antes de roles.
- [ ] Implementar seeds de roles y asignaciones de permisos.
- [ ] Implementar usuarios y membresías demo con hashes Argon2id.
- [ ] Proteger continuidad del administrador durante reset.
- [ ] Registrar seeds en orden de dependencia.
- [ ] Documentar credenciales demo sin una contraseña real reutilizable.

## 14. Verificación integrada y documentación

- [ ] Ejecutar migración de Fase 2 en una base local limpia.
- [ ] Ejecutar seeds dos veces y verificar conteos sin duplicados.
- [ ] Probar por HTTP login, rotation, reuse, logout y revocación.
- [ ] Verificar que ids de otro tenant no exponen ni modifican datos.
- [ ] Verificar endpoints y contratos de error en Swagger.
- [ ] Ejecutar lint, typecheck, tests y audit de producción.
- [ ] Ejecutar build solo al cerrar el hito `v0.2.0`.
- [ ] Actualizar READMEs y arquitectura con comportamiento final.
- [ ] Promover specs, archivar el change y publicar `v0.2.0`.
