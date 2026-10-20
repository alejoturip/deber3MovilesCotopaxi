# AGENTS.md — Cotopaxi Focus

Instrucciones generales para cualquier agente de IA (Claude Code, GitHub Copilot, OpenCode, Antigravity) que trabaje en este proyecto. **Léelo completo antes de modificar código.** Si una carpeta tiene instrucciones propias, esas mandan sobre sus archivos.

## Contexto

App móvil Pomodoro para el Departamento de Bienestar Estudiantil de la **Academia Cotopaxi**. Deber N°3 de *Desarrollo App Móviles* (ESFOT‑EPN).

- Usuarios: estudiantes de primeros niveles.
- Problemas que resuelve: apps gratuitas con publicidad, que piden cuenta y que "se detienen" al bloquear el celular.
- Línea base obligatoria: las 6 historias de usuario en `docs/historias/`. Se pueden agregar mejoras, nunca romper la línea base.

## Metodología: Spec‑Driven Development (SDD)

Ningún cambio de funcionalidad se implementa sin spec. El flujo es:

```text
docs/historias/HU-XXX.md   →  ¿qué quiere el cliente?           (fuente: reunión con el cliente)
specs/HU-XXX-*/spec.md     →  ¿qué se construye exactamente?    (agente: spec-writer)
specs/HU-XXX-*/plan.md     →  ¿dónde y cómo en esta arquitectura? (agente: spec-writer)
specs/HU-XXX-*/tasks.md    →  pasos pequeños y verificables      (agente: mobile-implementer)
código + tests             →  implementación                     (agente: mobile-implementer)
verificación               →  tests + checklist en dispositivo   (agente: qa-tester)
diseño                     →  identidad Cotopaxi                 (agente: ui-designer)
```

Reglas del flujo:
1. Si la HU y la spec se contradicen, gana la HU; actualiza la spec y explica el conflicto.
2. Marca en `tasks.md` cada tarea completada (`- [x]`).
3. Toda regla de negocio nueva debe tener un test en `src/domain/__tests__/`.
4. Las decisiones técnicas importantes se registran en `docs/decisiones-tecnicas.md`.

Agentes: `.github/agents/`. Skills: `.github/skills/`. Constitución (principios no negociables): `docs/constitution.md`.

## Stack

- Expo SDK 58 · React Native 0.88 · TypeScript estricto · Expo Router (rutas en `src/app/`).
- `expo-notifications` (alarma local), `@react-native-async-storage/async-storage` (persistencia), `react-native-svg` (anillo del temporizador).
- Jest con `jest-expo` para pruebas del dominio.
- Sin backend, sin cuentas, sin analítica, sin SDK de anuncios.

### Expo cambia en cada SDK — no confíes en tu memoria

Antes de tocar una API de Expo, EAS o React Native:
1. Revisa la versión de `expo` en `package.json`.
2. Consulta la documentación de esa versión: `https://docs.expo.dev/versions/v58.0.0/` (o las definiciones `.d.ts` en `node_modules`).
3. Índice para LLMs: https://docs.expo.dev/llms.txt

## Arquitectura (respeta la existente, no crees otra paralela)

```text
src/
├── app/                 Solo pantallas y rutas (Expo Router). Sin reglas de negocio.
│   ├── _layout.tsx      Stack, configuración de avisos y listener de la notificación
│   ├── index.tsx        Temporizador (HU-001/002/003/004/006)
│   └── settings.tsx     Ajustes (HU-005)
├── components/          Componentes reutilizables de la app
│   └── ui/              Piezas visuales genéricas (Button, Card)
├── constants/           theme.ts (tokens Cotopaxi) y pomodoro.ts (valores por defecto y rangos)
├── domain/              Lógica pura: models/, rules/, validators/ y __tests__/
├── hooks/               usePomodoro, useNotificationPermission, useSettingsForm
├── services/            notificationService.ts (único lugar que usa expo-notifications)
└── storage/             settingsStorage.ts, sessionStorage.ts (único lugar que usa AsyncStorage)
```

Dirección de dependencias: `app → hooks → (domain, services, storage)`; `components → (constants, domain)`. El dominio no importa nada de React ni de Expo.

Antes de crear un archivo pregúntate: *¿esta responsabilidad ya existe en otro lugar?* Si existe, reutiliza o modifica ese archivo.

## Reglas clave del dominio (no romper)

- El tiempo **se calcula, no se cuenta**: se guarda `endsAt` y el restante es `endsAt - Date.now()`. El `setInterval` solo repinta.
- La alarma se **agenda en el sistema al iniciar** y se **cancela al pausar o reiniciar**.
- Al terminar una fase, la siguiente queda **lista (idle)**, no arranca sola.
- Los cambios de ajustes no alteran una fase corriendo o pausada.
- Detalle completo: `.github/skills/pomodoro-rules/SKILL.md` y `.github/skills/android-alarm-notifications/SKILL.md`.

## Comandos

```bash
npx expo install <paquete>   # SIEMPRE en lugar de npm install: resuelve versiones compatibles con el SDK
npm test                     # pruebas del dominio
npm run typecheck            # tsc --noEmit
npx expo start               # servidor de desarrollo (requiere development build, ver README)
npm run android              # compila e instala en un Android conectado (necesita Android Studio)
npm run build:apk            # APK en la nube con EAS (perfil preview)
```

Ejecuta `npm run typecheck` y `npm test` antes de dar una tarea por terminada.

## Reglas de trabajo para la IA

1. Antes de escribir código: revisa la estructura, este archivo, las skills relacionadas, la HU y su spec, y el código existente.
2. Indica qué archivos vas a crear y cuáles vas a modificar, y por qué.
3. No modifiques archivos no relacionados ni elimines código funcional sin justificarlo.
4. Nada de lógica de negocio dentro de JSX. Nada de AsyncStorage ni expo-notifications fuera de `storage/` y `services/`.
5. Colores, espacios y tipografías solo desde `src/constants/theme.ts`.
6. No agregues dependencias si el problema se resuelve con lo existente.
7. No edites `android/` ni `ios/` a mano (se generan con prebuild); la configuración nativa va en `app.json`.
8. No sobreingenierices: es una app académica; debe ser profesional pero proporcional.
