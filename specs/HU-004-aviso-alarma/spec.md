# Spec HU-004 — Recibir aviso al terminar el tiempo

Historia: [`docs/historias/HU-004.md`](../../docs/historias/HU-004.md) · **Riesgo alto**

## Requisitos técnicos derivados
| Escenario | Requisito Android |
|---|---|
| Con sonido | Notificación local con sonido propio (`alarm.wav`) y vibración |
| En silencio / vibración | Canal con `AudioAttributes.usage = ALARM` → suena por el volumen de alarma |
| Pantalla de bloqueo | `lockscreenVisibility = PUBLIC`, importancia `MAX` |
| A tiempo aunque haya ahorro de batería | `delivery: 'alarmClock'` → `AlarmManager.setAlarmClock()` + permisos `USE_EXACT_ALARM` / `SCHEDULE_EXACT_ALARM` |
| Detener | Tocar la notificación o el botón "Detener" → se descarta la notificación (se calla) y se abre la app en el temporizador con la fase siguiente lista. En la app, botón "Detener alarma" |
| Permiso | Android 13+: `POST_NOTIFICATIONS` en tiempo de ejecución. Antes del diálogo del sistema se muestra `PermissionExplainer` |

## Mensajes
- Título: "¡Terminó tu tiempo de estudio!" / "Terminó el descanso corto" / "Terminó el descanso largo".
- Cuerpo: qué fase sigue ("Te toca un descanso corto. Abre la app para iniciarlo.").

## Si el estudiante niega el permiso
El temporizador sigue funcionando; se muestra un aviso con botón "Activar en ajustes del sistema".

## Limitaciones conocidas
- iOS no permite sonar en silencio sin el permiso especial *Critical Alerts* de Apple. El entregable es un APK Android.
- Algunos fabricantes (Xiaomi, Huawei) pueden restringir apps en segundo plano; `setAlarmClock` es el mecanismo más resistente disponible.
- El sonido dura ~12 s y se detiene al tocar la notificación o "Detener".

## Verificación en dispositivo
1. Primer inicio sin permiso → aparece la explicación → "Permitir avisos" → diálogo del sistema.
2. Estudio de 1 min, celular en sonido, bloqueado → suena, vibra, se ve en bloqueo.
3. Igual pero en **silencio** → suena por volumen de alarma.
4. Tocar "Detener" → se calla y abre la app con "Descanso corto · Listo para iniciar".
