# Plan HU-003

## Archivos
- `src/domain/rules/pomodoroRules.ts`: `getRemainingMs`, `isPhaseFinished`, `reconcileSession`.
- `src/storage/sessionStorage.ts`: `loadSession`, `saveSession` con validación del formato guardado.
- `src/hooks/usePomodoro.ts`: carga inicial + reconciliación, listener de `AppState`, intervalo solo de repintado (250 ms).
- `src/services/notificationService.ts`: `schedulePhaseEndAlarm`, `cancelPhaseEndAlarm`.

## Alternativas descartadas
| Alternativa | Por qué no |
|---|---|
| `setInterval` contando segundos | Se congela en segundo plano; pierde tiempo |
| Tarea en segundo plano (`expo-background-task`/headless JS) | Android no garantiza ejecución; mayor complejidad y batería |
| Foreground service con notificación persistente | Necesita módulo nativo y permiso especial; innecesario si el tiempo se calcula |

## Riesgos
- Si el usuario cambia la hora del sistema, el cálculo se desplaza (aceptado; caso raro).
