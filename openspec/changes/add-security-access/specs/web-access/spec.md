# Especificación delta de acceso web

## Requisitos agregados

### Requisito: Experiencia de login

La aplicación web DEBE validar email, contraseña y slug antes de enviar login, y
DEBE mostrar un error de autenticación genérico.

#### Escenario: Login exitoso

- **Dado** un usuario sin sesión con datos válidos
- **Cuando** el login tiene éxito
- **Entonces** la web almacena únicamente el estado seguro del actor
- **Y** redirige al shell protegido
- **Y** no lee ni persiste tokens desde JavaScript

### Requisito: Restauración de sesión

El shell protegido DEBE restaurar el actor mediante la API y NO DEBE mostrar
contenido protegido antes de resolver la restauración.

#### Escenario: La sesión existente es válida

- **Dado** cookies HttpOnly válidas
- **Cuando** carga la aplicación protegida
- **Entonces** se restaura actor y organización
- **Y** se muestra la navegación autorizada

#### Escenario: La sesión existente es inválida

- **Dado** cookies expiradas o revocadas
- **Cuando** la restauración falla tras un máximo de un refresh
- **Entonces** se limpia el estado de autenticación
- **Y** se vuelve al login sin redirect loop

### Requisito: Refresh serializado

El API client DEBE coordinar respuestas unauthorized concurrentes mediante un
solo refresh y DEBE reintentar cada request original como máximo una vez.

#### Escenario: Varios requests expiran juntos

- **Dado** varios requests unauthorized por access token expirado
- **Cuando** todavía es posible hacer refresh
- **Entonces** el cliente envía un solo refresh
- **Y** reintenta una vez los requests en espera

### Requisito: Interfaz consciente de permisos

La web DEBE ocultar o deshabilitar acciones no disponibles, pero DEBE considerar
la autorización de la API como fuente de verdad.

#### Escenario: Un miembro read-only abre administración

- **Dado** un actor sin permisos para roles ni membresías
- **Cuando** se renderiza la navegación administrativa
- **Entonces** no se ofrecen acciones de mutación
- **Y** un forbidden directo se maneja sin exponer datos

### Requisito: Estados de gestión de acceso

Las vistas de usuarios, membresías, roles y sesiones DEBEN representar estados
de loading, vacío, forbidden y errores de validación del backend.

#### Escenario: La lista de membresías está vacía

- **Dado** un request permitido sin resultados
- **Cuando** se renderiza la vista
- **Entonces** muestra un estado vacío explícito
- **Y** no lo confunde con loading o error
