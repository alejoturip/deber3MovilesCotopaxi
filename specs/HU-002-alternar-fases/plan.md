# Plan HU-002

## Archivos
- `src/domain/rules/pomodoroRules.ts`: `getNextPhase`, `completePhase`.
- `src/components/CycleProgress.tsx`: puntos + texto del avance.
- `src/components/PhaseBadge.tsx`: fase y estado con texto (no solo color).

## Decisiones
- `completePhase` toma la duración de la fase siguiente de los ajustes vigentes → conecta con HU-005 (el cambio se aplica desde la próxima fase).
- `lastFinishedPhase` guarda la fase que terminó para mostrar el aviso al volver (HU-003/HU-004).
