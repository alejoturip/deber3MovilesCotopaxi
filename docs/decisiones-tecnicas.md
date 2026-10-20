# Decisiones técnicas

Registro de por qué se eligió cada herramienta sobre sus alternativas. Sirve de base para la justificación técnica del video.

| # | Decisión | Alternativas consideradas | Motivo |
|---|---|---|---|
| D1 | **Expo SDK 58 + React Native** | React Native CLI puro, Flutter, Kotlin nativo | Continuidad con el curso; EAS genera el APK en la nube sin Android Studio; config plugins evitan tocar código nativo |
| D2 | **TypeScript estricto** | JavaScript | Los modelos (`PomodoroSession`) y estados quedan tipados; errores detectados antes de ejecutar |
| D3 | **Expo Router** (`src/app/`) | React Navigation manual | Rutas basadas en archivos, estándar actual de Expo; solo 2 pantallas |
| D4 | **Tiempo basado en `endsAt`** | `setInterval` que cuenta, tareas en segundo plano, foreground service | Es la única opción que no depende de que el JS siga vivo; cero batería extra (HU-003) |
| D5 | **expo-notifications con `delivery: 'alarmClock'` y canal ALARM** | Notifee, push remoto FCM | Oficial de Expo; SDK 58 trae `setAlarmClock()` (no lo retrasa Doze) y audio de alarma que suena en silencio (HU-004). Push viola HU-006 |
| D6 | **AsyncStorage** | MMKV, SQLite, expo-secure-store | Datos pequeños (ajustes + sesión); incluido en Expo Go/dev build sin configuración extra. MMKV/SQLite serían sobreingeniería |
| D7 | **Estado con hooks propios** | Redux, Zustand, Context global | Solo dos pantallas; los ajustes se releen al enfocar la pantalla (`useFocusEffect`). Menos dependencias |
| D8 | **Dominio puro + Jest (`jest-expo`)** | Lógica dentro de los componentes | Las reglas se prueban en milisegundos sin emulador; la UI no esconde reglas |
| D9 | **react-native-svg** para el anillo | Solo texto, librerías de progreso | Paquete estándar de Expo; permite la metáfora del sol naciente del logo sin otra dependencia de UI |
| D10 | **Validación propia** de ajustes | react-hook-form + zod | Son 4 campos numéricos; un validador puro de ~50 líneas es suficiente y testeable |
| D11 | **Rango mínimo de 1 minuto** | Mínimos de 5–15 min | Permite demostrar el ciclo completo y las alarmas en el video |
| D12 | **SDD con agentes y skills en `.github/`** | Prompts sueltos | Mismo estándar de clase (AGENTS.md + SKILL.md), compatible con Copilot, OpenCode y Claude Code |

## Colores
Medidos sobre el archivo del logo entregado por el cliente: azul `#16145F` y dorado `#D1A417` (la skill inicial proponía aproximaciones `#17165C` y `#E2B323`).

## Pendientes / mejoras posibles
- Sonido en bucle hasta detener (requiere Notifee o módulo nativo).
- Historial de sesiones y estadísticas semanales.
- Botón "saltar fase".
