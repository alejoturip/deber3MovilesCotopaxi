# Spec HU-005 — Ajustar los tiempos del pomodoro

Historia: [`docs/historias/HU-005.md`](../../docs/historias/HU-005.md)

## Campos y rangos
| Campo | Por defecto | Rango |
|---|---|---|
| Tiempo de estudio | 25 min | 1–90 min |
| Descanso corto | 5 min | 1–30 min |
| Descanso largo | 15 min | 1–60 min |
| Pomodoros antes del descanso largo | 4 | 2–8 |

El mínimo de 1 minuto es intencional: permite demostrar el ciclo completo en el video.

## Validación
- Vacío → "Este campo es obligatorio. Usa un valor entre X y Y."
- No entero → "Solo números enteros…"
- 0 o fuera de rango → "Valor fuera de rango…"
- Con cualquier error **no se guarda nada**; cada campo muestra su mensaje y el rango permitido.

## Aplicación de cambios
- Fase corriendo o pausada: conserva su duración (`phaseDurationMs` se fija al prepararla).
- Fase lista que aún no empezó: toma el nuevo valor.
- Siguientes fases: usan el nuevo valor.
- Persisten en el celular aunque se cierre la app.

## Restablecer
Pide confirmación mostrando los valores 25/5/15/4; al confirmar se borran los ajustes guardados.

## Verificación
- Tests: `settingsValidator.test.ts` y bloque "HU-005" de `pomodoroRules.test.ts`.
