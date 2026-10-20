# Spec HU-006 — Sin registro, sin internet y sin publicidad

Historia: [`docs/historias/HU-006.md`](../../docs/historias/HU-006.md)

## Requisitos
- La ruta inicial (`src/app/index.tsx`) es el temporizador. No existen pantallas de registro ni login.
- No hay ninguna llamada de red: almacenamiento local (AsyncStorage) y notificaciones locales.
- No se instala ningún SDK de anuncios, analítica, autenticación ni push remoto.
- Pie de pantalla visible: "Sin anuncios · Sin registro · Funciona sin internet".

## Verificación
1. Instalar el APK, activar modo avión, abrir → llega directo al temporizador.
2. Usar temporizador, ajustes y alarma en modo avión → todo funciona; cerrar y abrir → ajustes conservados.
3. Revisar `package.json`: no hay dependencias de anuncios/analítica.
