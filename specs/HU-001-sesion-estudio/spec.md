# Spec HU-001 — Iniciar y controlar una sesión de estudio

Historia: [`docs/historias/HU-001.md`](../../docs/historias/HU-001.md)

## Objetivo
El estudiante puede iniciar, pausar, reanudar y reiniciar la cuenta regresiva de la fase actual viendo minutos y segundos.

## Comportamiento
| Estado actual | Acción | Resultado |
|---|---|---|
| Listo (idle) | Iniciar | Corriendo; `endsAt = ahora + restante` |
| Corriendo | Pausar | Pausado; `restante = endsAt − ahora` |
| Pausado | Reanudar | Corriendo desde el restante guardado |
| Corriendo / Pausado | Reiniciar → Confirmar | Listo con la duración inicial de la fase actual |
| Corriendo / Pausado | Reiniciar → Cancelar | Sin cambios |

- Formato `mm:ss`, redondeando hacia arriba (00:00 solo cuando terminó).
- "Reiniciar" está deshabilitado si la fase está lista (no hay nada que reiniciar).

## Fuera de alcance
Saltar fase manualmente (posible mejora futura).

## Verificación
- Tests: `src/domain/__tests__/pomodoroRules.test.ts` → bloque "HU-001".
- Manual: iniciar, esperar 10 s, pausar 10 s, reanudar → el reloj no descuenta la pausa. Reiniciar → Cancelar → conserva; Reiniciar → Reiniciar → vuelve a 25:00.
