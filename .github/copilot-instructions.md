# Instrucciones para GitHub Copilot

Este proyecto se rige por `AGENTS.md` (raíz). Léelo antes de proponer cambios.

Resumen:
- Metodología SDD: HU (`docs/historias/`) → spec/plan/tasks (`specs/`) → código + tests → verificación.
- Arquitectura: `src/app` solo pantallas; reglas en `src/domain`; AsyncStorage solo en `src/storage`; expo-notifications solo en `src/services`.
- Diseño: tokens de `src/constants/theme.ts` y skill `.github/skills/cotopaxi-school/`.
- Antes de terminar: `npm run typecheck` y `npm test`.
