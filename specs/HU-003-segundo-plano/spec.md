# Spec HU-003 — Mantener el conteo con el celular bloqueado o la app cerrada

Historia: [`docs/historias/HU-003.md`](../../docs/historias/HU-003.md) · **Riesgo alto**

## Problema técnico
Android congela el JavaScript en segundo plano y "cerrar desde recientes" mata el proceso. Un `setInterval` que reste segundos pierde el tiempo: es exactamente la queja del cliente sobre las otras apps.

## Solución
1. **Calcular, no contar**: al iniciar se guarda `endsAt` (epoch ms). Restante = `max(0, endsAt − Date.now())`.
2. **Persistir** la sesión en AsyncStorage en cada transición (iniciar, pausar, reiniciar, terminar fase).
3. **Reconciliar** al abrir la app y al volver a primer plano (`AppState` = `active`): si `ahora ≥ endsAt`, la fase se marca como terminada (`completePhase`) y queda lista la siguiente.
4. **Alarma agendada** en el sistema al iniciar (ver HU-004) → llega aunque el proceso no exista.
5. **Pausa**: se guarda el restante, `endsAt = null` y se cancela la alarma → al reabrir sigue pausado y sin aviso.

## Verificación en dispositivo (obligatoria)
| # | Paso | Esperado |
|---|---|---|
| 1 | Iniciar 25:00, bloquear 2 min, desbloquear | ≈ 23:00 |
| 2 | Iniciar, cerrar desde recientes, esperar 1 min, abrir | Restante correcto y corriendo |
| 3 | Ajustar estudio a 1 min, iniciar, cerrar la app, esperar | Suena la alarma; al abrir: "¡Terminó tu tiempo de estudio!" y descanso corto listo |
| 4 | Iniciar, pausar, cerrar, esperar más que el restante, abrir | Sigue pausado con el mismo tiempo; no llegó ningún aviso |
