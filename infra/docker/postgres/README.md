# PostgreSQL local

La base local se levanta desde `compose.yaml` en la raíz del proyecto.

```bash
docker compose up -d
```

Credenciales por defecto para desarrollo:

```txt
postgresql://nexus:nexus@localhost:5432/nexuscrm
```

No reutilices estas credenciales fuera de desarrollo local.

