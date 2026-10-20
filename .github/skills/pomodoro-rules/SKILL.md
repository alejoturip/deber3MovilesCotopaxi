---
name: pomodoro-rules
description: Reglas de negocio del temporizador Pomodoro de Cotopaxi Focus (fases, ciclo, cálculo del tiempo, ajustes). Usar al modificar src/domain, usePomodoro o cualquier comportamiento del temporizador.
---

# SKILL: Reglas del Pomodoro

## Objetivo
Mantener las reglas del temporizador en un solo lugar (`src/domain/rules/pomodoroRules.ts`), puras y probadas.

## Cuándo utilizarla
Al tocar fases, tiempos, ciclo, ajustes, persistencia de la sesión o el hook `usePomodoro`.

## Modelo
```ts
PomodoroSession {
  phase: 'study' | 'shortBreak' | 'longBreak'
  status: 'idle' | 'running' | 'paused'
  phaseDurationMs   // fijada al preparar la fase
  remainingMs       // válido en idle/paused
  endsAt            // epoch ms, solo en running
  completedPomodoros
  lastFinishedPhase // para el aviso "terminó X"
}
```

## Reglas
1. **Calcular, no contar**: `restante = max(0, endsAt − ahora)` en `running`; `remainingMs` en otros estados.
2. Iniciar/reanudar: `endsAt = ahora + remainingMs`. Pausar: `remainingMs = endsAt − ahora`, `endsAt = null`.
3. Reiniciar: `idle` con `remainingMs = phaseDurationMs`; no cambia fase ni contador.
4. Fin de estudio: contador + 1; si llega a `pomodorosPerCycle` → descanso largo y contador 0; si no → descanso corto.
5. Fin de descanso: estudio; contador sin cambio.
6. La fase siguiente queda en `idle` (no arranca sola).
7. Ajustes nuevos: solo afectan a fases en `idle` y a las siguientes.
8. Defaults 25/5/15/4; rangos 1–90 / 1–30 / 1–60 / 2–8.

## Restricciones
- Las funciones reciben `now` como parámetro; nunca llaman a `Date.now()` dentro del dominio (testeable).
- El dominio no importa React, React Native, Expo ni AsyncStorage.
- Toda regla nueva lleva test en `src/domain/__tests__/`.

## Ejemplo
```ts
const running = startTimer(createInitialSession(settings), now);
const later = reconcileSession(running, settings, now + 30 * 60_000);
// later.phase === 'shortBreak', later.status === 'idle', later.lastFinishedPhase === 'study'
```

## Criterios
- `npm test` en verde.
- Ningún cálculo de tiempo fuera del dominio (la UI solo formatea con `formatRemaining`).
