# Spec HU-002 — Alternar entre estudio y descanso

Historia: [`docs/historias/HU-002.md`](../../docs/historias/HU-002.md)

## Objetivo
Al terminar una fase, la app prepara automáticamente la siguiente y muestra el avance del ciclo.

## Transiciones
| Fase que termina | Condición | Fase lista | Contador |
|---|---|---|---|
| Estudio | `completados + 1 < pomodorosPorCiclo` | Descanso corto | +1 |
| Estudio | `completados + 1 ≥ pomodorosPorCiclo` | Descanso largo | 0 |
| Descanso corto / largo | — | Estudio | sin cambio |

- La fase siguiente queda **lista (idle)**: el estudiante la inicia. ("deja listo … para que yo lo inicie").
- La pantalla muestra la fase con texto ("Estudio", "Descanso corto", "Descanso largo"), el estado ("En curso", "En pausa", "Listo para iniciar") y "N de M pomodoros" con puntos dorados.

## Interpretación documentada
La descripción dice "pase sola", y los criterios dicen "deja listo para que yo lo inicie". Se sigue el criterio de aceptación: la transición es automática, el arranque es manual.

## Verificación
- Tests: bloque "HU-002".
- Manual con ajustes 1/1/1/2: completar 2 estudios → aparece descanso largo y contador 0 de 2.
