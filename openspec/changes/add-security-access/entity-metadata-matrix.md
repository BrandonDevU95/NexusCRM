# Matriz de metadata de entidades de seguridad

Esta matriz convierte el modelo de persistencia del diseño en contratos
verificables de TypeORM. Se completa antes de agregar las expectativas de cada
entidad a la suite de metadata.

| Entidad                    | Tabla                       | Relaciones esperadas                                                                          | Unicidad obligatoria              | Índices de consulta                                          | Columnas ocultas              |
| -------------------------- | --------------------------- | --------------------------------------------------------------------------------------------- | --------------------------------- | ------------------------------------------------------------ | ----------------------------- |
| `UserEntity`               | `users`                     | uno a muchos con membresías y sesiones                                                        | `normalizedEmail`                 | Por definir desde las consultas administrativas              | `passwordHash`                |
| `OrganizationMemberEntity` | `organization_members`      | muchos a uno con organización y usuario; muchos a muchos con roles; uno a muchos con sesiones | `organizationId` + `userId`       | Por definir desde las consultas de membresías                | Ninguna                       |
| `PermissionEntity`         | `permissions`               | muchos a muchos con roles                                                                     | `code`                            | Por definir desde la consulta del catálogo                   | Ninguna                       |
| `RoleEntity`               | `roles`                     | muchos a uno con organización; muchos a muchos con permisos y membresías                      | organización + nombre normalizado | Por definir desde las consultas de roles                     | Ninguna                       |
| `SessionEntity`            | `sessions`                  | muchos a uno con usuario, organización y membresía                                            | Por definir                       | Por usuario, organización y membresía según los casos de uso | Hash del refresh token actual |
| Relación rol-permiso       | `role_permissions`          | rol con permiso                                                                               | pareja rol-permiso                | Por definir según ambos sentidos de consulta                 | Ninguna                       |
| Relación membresía-rol     | `organization_member_roles` | membresía con rol                                                                             | pareja membresía-rol              | Por definir según ambos sentidos de consulta                 | Ninguna                       |

## Primer contrato cerrado: usuario

| Elemento            | Decisión verificable                                              |
| ------------------- | ----------------------------------------------------------------- |
| Nombre lógico       | `UserEntity`                                                      |
| Tabla física        | `users`                                                           |
| Identificador       | UUID generado                                                     |
| Email de entrada    | Columna `email`, `varchar(320)`                                   |
| Email para comparar | Columna `normalized_email`, `varchar(320)`                        |
| Unicidad            | Índice único sobre `normalizedEmail`                              |
| Nombre visible      | Columna `display_name`, `varchar(160)`                            |
| Credencial          | Columna `password_hash`, tipo `text`, no seleccionada por defecto |
| Estado              | Columna `is_active`, booleano, activo por defecto                 |
| Último acceso       | Columna nullable `last_login_at`                                  |
| Auditoría temporal  | Columnas `created_at` y `updated_at`                              |
| Relaciones          | Se comprobarán al introducir membresías y sesiones                |

## Segundo contrato cerrado: Organization Members

| Elemento              | Decisión verificable                                                      |
| --------------------- | ------------------------------------------------------------------------- |
| Nombre lógico         | `OrganizationMemberEntity`                                                |
| Tabla física          | `organization_members`                                                    |
| Identificador         | UUID generado                                                             |
| Id de la Organizacion | Columna `organization_id`, `UUID`                                         |
| Id del Usuario        | Columna `user_id`, `UUID`                                                 |
| Status                | Enum `organization_member_status_enum`: `active`, `suspended` o `removed` |
| Fecha de unión        | Columna obligatoria `joined_at`, con fecha de creación por defecto        |
| Auditoría temporal    | Columnas `created_at` y `updated_at`                                      |
| Relaciones            | Muchos-a-uno obligatorias con organización y usuario; borrado restrictivo |

Las longitudes son límites de persistencia, no sustituyen la validación de los
DTOs. Las filas marcadas como "Por definir" no deben convertirse todavía en
expectativas de prueba.
