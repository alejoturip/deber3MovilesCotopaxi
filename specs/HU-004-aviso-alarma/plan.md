# Plan HU-004

## Archivos
- `src/services/notificationService.ts`: canal `pomodoro-alarm-v1`, categoría con acción "Detener", agendar/cancelar/detener, respuesta al abrir en frío.
- `src/domain/rules/phaseMessages.ts`: textos del aviso según fase terminada y siguiente.
- `src/hooks/useNotificationPermission.ts`: flujo explicación → solicitud.
- `src/components/PermissionExplainer.tsx`, `PhaseFinishedBanner.tsx`.
- `src/app/_layout.tsx`: configura avisos y escucha la respuesta de la notificación.
- `app.json`: plugin `expo-notifications` (sonido `assets/sounds/alarm.wav`, icono, color) y permisos.

## Decisión: expo-notifications vs alternativas
| Opción | Ventajas | Desventajas | Decisión |
|---|---|---|---|
| **expo-notifications** | Oficial de Expo, config plugin, SDK 58 soporta `delivery: 'alarmClock'` y canales con audio ALARM | Sin sonido en bucle infinito | ✅ Elegida |
| Notifee | Full-screen intent, sonido en bucle | Librería de terceros; más configuración nativa y otra dependencia que mantener | Plan B |
| Push remoto (FCM) | — | Requiere servidor e internet: viola HU-006 | ❌ |

## Notas
- Los ajustes de un canal Android no se pueden cambiar después de crearlo: si se modifican, subir la versión del id (`-v2`).
- Requiere development build o APK; Expo Go no incluye sonidos ni canales personalizados.
