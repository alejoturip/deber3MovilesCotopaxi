# Plan HU-001

## Archivos
| Capa | Archivo | Responsabilidad |
|---|---|---|
| Dominio | `src/domain/models/pomodoro.ts` | Tipos `Phase`, `TimerStatus`, `PomodoroSession` |
| Dominio | `src/domain/rules/pomodoroRules.ts` | `startTimer`, `pauseTimer`, `resetTimer`, `getRemainingMs` |
| Dominio | `src/domain/rules/time.ts` | `formatRemaining`, `minutesToMs` |
| Hook | `src/hooks/usePomodoro.ts` | Conecta reglas, persistencia y alarma |
| UI | `src/components/TimerRing.tsx`, `TimerControls.tsx`, `PhaseBadge.tsx` | Presentación |
| Pantalla | `src/app/index.tsx` | Composición y diálogo de confirmación (`Alert`) |

## Decisiones
- Máquina de estados de 3 estados (`idle`, `running`, `paused`) como funciones puras → testeable sin emulador.
- Confirmación con `Alert.alert` nativo: cumple el escenario sin crear un modal propio.
