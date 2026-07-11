# Propuesta: agregar seguridad y acceso por organización

## Resumen

Implementar la base de seguridad de NexusCRM para `v0.2.0`: usuarios,
membresías de organizaciones, autenticación, sesiones revocables, rotación de
refresh tokens, roles por organización, permisos explícitos y autorización con
CASL.

## Motivación

Todos los módulos de negocio posteriores dependen de un actor confiable y de un
contexto de organización. Antes de agregar datos comerciales, NexusCRM necesita
autenticar usuarios, aislar organizaciones y autorizar operaciones sensibles.

## Objetivos

- Modelar identidades globales y membresías por organización.
- Autenticar con cookies HttpOnly y errores de credenciales genéricos.
- Emitir access tokens de corta duración y rotar el refresh token en cada uso.
- Detectar la reutilización de refresh tokens y revocar la sesión afectada.
- Permitir que el usuario consulte y revoque sus sesiones.
- Definir un catálogo estable de permisos compartido por API y web.
- Asignar roles propios de la organización a membresías activas.
- Aplicar permisos y contexto de organización mediante guards de NestJS y CASL.
- Proporcionar flujos web básicos para login, restauración de sesión y gestión de acceso.
- Agregar seeds determinísticos e idempotentes para usuarios, roles y permisos demo.

## Áreas afectadas

- `apps/api/src/modules/auth`
- `apps/api/src/modules/users`
- `apps/api/src/modules/authorization`
- `apps/api/src/modules/organizations`
- `apps/api/src/database`
- `apps/web/src/features/auth`
- `apps/web/src/features/admin`
- `apps/web/src/features/settings`
- `packages/shared`

## Fuera de alcance

- Registro público y creación autoservicio de organizaciones.
- Envío de email, invitaciones y verificación de correo.
- Recuperación y restablecimiento de contraseña.
- MFA y proveedores de identidad externos.
- Audit logs y security logs persistentes, previstos para `v0.9.0`.
- Permisos por campo y excepciones directas por usuario.
- Impersonation o un bypass global de autorización.

## Dependencias

- Foundation de TypeORM y flujo de migraciones de `v0.1.0`.
- Organización inicial y seed runner modular existentes.
- Catálogos compartidos de permisos y roles.

## Riesgos

- La ausencia de un predicado por organización podría exponer datos de otro tenant.
- Una rotación incorrecta podría mantener válido un refresh token robado.
- La autenticación con cookies podría permitir solicitudes cross-site.
- La edición de roles podría eliminar al último administrador de una organización.

El diseño y las especificaciones establecen guards e invariantes obligatorias
para mitigar estos riesgos.

## Rollback

Revertir esta rama, revertir la migración de Fase 2 y restaurar los catálogos
compartidos anteriores. Se DEBE conservar la organización y la configuración de
la foundation. El rollback invalida todas las sesiones de Fase 2 y obliga a los
usuarios a iniciar sesión nuevamente después de reaplicar el cambio.
