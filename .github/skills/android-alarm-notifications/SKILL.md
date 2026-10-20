---
name: android-alarm-notifications
description: Cómo hacer que el aviso de fin de fase suene a tiempo en Android con la app cerrada, el celular bloqueado o en silencio usando expo-notifications (SDK 58). Usar al modificar notificationService, permisos o app.json.
---

# SKILL: Alarmas confiables en Android

## Objetivo
Cumplir HU-003 (aviso con la app cerrada) y HU-004 (sonar en silencio, pantalla de bloqueo, detener, permiso).

## Cuándo utilizarla
Al modificar `src/services/notificationService.ts`, `useNotificationPermission`, el plugin de `expo-notifications` o los permisos de `app.json`.

## Reglas
1. **Agendar al iniciar**, no al llegar a cero: el JS puede no estar vivo cuando termine el tiempo.
   ```ts
   trigger: { type: SchedulableTriggerInputTypes.DATE, date: endsAt, channelId, delivery: 'alarmClock' }
   ```
2. `delivery: 'alarmClock'` → `AlarmManager.setAlarmClock()`: Android no lo retrasa por Doze. Requiere `USE_EXACT_ALARM` (API 33+) y `SCHEDULE_EXACT_ALARM` (API 31–32) en `app.json`.
3. **Canal de alarma** (Android 8+): `importance: MAX`, `sound: 'alarm.wav'`, `audioAttributes.usage: ALARM`, `lockscreenVisibility: PUBLIC`, vibración. El uso ALARM hace que suene en silencio.
4. Los canales son **inmutables** tras crearse: si cambias su configuración, cambia el id (`pomodoro-alarm-v2`) o reinstala la app.
5. El sonido se registra en el plugin: `"sounds": ["./assets/sounds/alarm.wav"]` y se referencia por nombre de archivo.
6. **Cancelar** al pausar o reiniciar (`cancelAllScheduledNotificationsAsync`): solo existe una alarma pendiente.
7. **Detener**: `dismissAllNotificationsAsync()` calla el sonido. Atender tanto el listener como `getLastNotificationResponseAsync()` (apertura en frío).
8. **Permiso** Android 13+: primero explicación propia, luego `requestPermissionsAsync()`. Si se niega, la app sigue funcionando.

## Restricciones
- Solo `src/services/notificationService.ts` importa `expo-notifications`.
- Expo Go no sirve para probar esto: usar development build o APK.
- No usar push remoto (viola HU-006).
- iOS no suena en silencio sin el permiso *Critical Alerts* de Apple: fuera de alcance (entregable APK).

## Checklist de prueba en dispositivo
- [ ] Primer inicio → explicación → diálogo del sistema
- [ ] 1 min, bloqueado, con sonido → suena y vibra
- [ ] 1 min, bloqueado, **en silencio** → suena por volumen de alarma
- [ ] 1 min, app cerrada desde recientes → suena; al abrir, fase terminada
- [ ] Pausar y cerrar → no suena
- [ ] "Detener" → se calla y abre en la fase siguiente
