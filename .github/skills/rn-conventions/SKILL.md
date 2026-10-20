---
name: rn-conventions
description: Convenciones de arquitectura y código del proyecto (Expo Router, carpetas por responsabilidad, TypeScript estricto). Usar antes de crear o mover cualquier archivo de código.
---

# SKILL: Convenciones React Native / Expo

## Objetivo
Que el proyecto parezca planificado: cada responsabilidad en un solo lugar y fácil de encontrar.

## Cuándo utilizarla
Antes de crear, mover o renombrar archivos en `src/`, o de instalar dependencias.

## Reglas por carpeta
| Carpeta | Contiene | No contiene |
|---|---|---|
| `src/app/` | Pantallas y `_layout.tsx` (Expo Router) | Reglas de negocio, AsyncStorage, notificaciones |
| `src/components/` | Componentes reutilizables con props | Acceso a almacenamiento o servicios |
| `src/components/ui/` | Piezas visuales genéricas (Button, Card) | Conocimiento del dominio Pomodoro |
| `src/constants/` | `theme.ts`, `pomodoro.ts` | Lógica |
| `src/domain/` | `models/`, `rules/`, `validators/`, `__tests__/` | React, Expo, AsyncStorage |
| `src/hooks/` | Conexión dominio ↔ React ↔ storage/services | JSX |
| `src/storage/` | Único acceso a AsyncStorage | Reglas de negocio |
| `src/services/` | Único acceso a expo-notifications | Estado de React |

## Convenciones de código
- TypeScript estricto; sin `any`.
- Imports con alias `@/` (`@/domain/...`).
- Componentes en PascalCase con export nombrado; pantallas con `export default` (requisito de Expo Router).
- Estilos con `StyleSheet.create` y tokens de `theme.ts`.
- Funciones pequeñas con nombres que expliquen la intención; comentarios que referencian la HU cuando una regla viene de ella.
- Dependencias: `npx expo install`; justificar en `docs/decisiones-tecnicas.md`.

## Antes de crear un archivo
> ¿Esta responsabilidad ya existe en otro lugar?

Si existe `src/services/notificationService.ts`, no se crea `src/utils/notifications.ts`.

## Ejemplo de cambio bien anunciado
```text
Nuevos archivos:
- src/components/SkipPhaseButton.tsx
Archivos modificados:
- src/domain/rules/pomodoroRules.ts  (nueva regla skipPhase + test)
- src/hooks/usePomodoro.ts           (expone skip)
- src/app/index.tsx                  (muestra el botón)
```

## Criterios
- `npm run typecheck` y `npm test` en verde.
- Ninguna importación de `expo-notifications` o AsyncStorage fuera de `services/` y `storage/`.
