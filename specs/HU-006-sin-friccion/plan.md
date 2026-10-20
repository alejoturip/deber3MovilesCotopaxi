# Plan HU-006

## Archivos
- `src/app/_layout.tsx`: Stack sin rutas de autenticación.
- `src/storage/*`: persistencia local.
- `app.json`: `blockedPermissions` para permisos que la app no usa (micrófono, almacenamiento externo, superposición).

## Nota
El permiso `INTERNET` lo agrega React Native para el modo desarrollo (Metro). La app en producción no hace ninguna petición de red.
