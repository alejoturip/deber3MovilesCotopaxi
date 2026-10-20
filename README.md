# Cotopaxi Focus

App Pomodoro para el Departamento de Bienestar Estudiantil de la **Academia Cotopaxi**.
Sin publicidad, sin registro y con un temporizador que **no se detiene** al bloquear el celular o cerrar la app.

> Deber N°3 — Desarrollo App Móviles · ESFOT‑EPN · Ing. Juan Carlos González MSc. · 2026‑A
> Desarrollado con **Spec‑Driven Development (SDD)** asistido por agentes y skills de IA.

## Funcionalidades (línea base)

| HU | Funcionalidad | Riesgo |
|---|---|---|
| [HU-001](docs/historias/HU-001.md) | Iniciar, pausar, reanudar y reiniciar (con confirmación) | Bajo |
| [HU-002](docs/historias/HU-002.md) | Alternancia estudio → descanso corto/largo y avance del ciclo | Bajo |
| [HU-003](docs/historias/HU-003.md) | El conteo sigue con el celular bloqueado o la app cerrada | **Alto** |
| [HU-004](docs/historias/HU-004.md) | Alarma al terminar, incluso en silencio y en pantalla de bloqueo | **Alto** |
| [HU-005](docs/historias/HU-005.md) | Ajustes de tiempos con validación y restablecer | Bajo |
| [HU-006](docs/historias/HU-006.md) | Sin registro, sin internet, sin anuncios | Bajo |

## Cómo funciona por dentro (lo importante)

- **El tiempo se calcula, no se cuenta.** Al iniciar se guarda la hora de fin (`endsAt`); el restante es `endsAt − ahora`. Por eso no se pierde nada al bloquear o cerrar la app → [`pomodoroRules.ts`](src/domain/rules/pomodoroRules.ts).
- **La alarma se agenda en Android al iniciar** con `AlarmManager.setAlarmClock()` (vía `expo-notifications`, `delivery: 'alarmClock'`), en un canal con audio de tipo **ALARMA** que suena aunque el celular esté en silencio → [`notificationService.ts`](src/services/notificationService.ts).
- **Pausar o reiniciar cancela la alarma**, así no llega ningún aviso falso.

## Estructura

```text
.github/
├── agents/          spec-writer · mobile-implementer · qa-tester · ui-designer
├── skills/          cotopaxi-school · pomodoro-rules · android-alarm-notifications · rn-conventions
└── copilot-instructions.md
assets/              logo original, íconos, sonido de alarma
docs/
├── constitution.md  principios no negociables
├── decisiones-tecnicas.md
└── historias/       HU-001 … HU-006
scripts/             sync-claude.mjs (copia agentes/skills a .claude/)
specs/               HU-XXX/spec.md · plan.md · tasks.md
src/
├── app/             pantallas (Expo Router): _layout, index (temporizador), settings
├── components/      TimerRing, PhaseBadge, CycleProgress, TimerControls, … y ui/
├── constants/       theme.ts (colores Cotopaxi), pomodoro.ts (valores y rangos)
├── domain/          models · rules · validators · __tests__
├── hooks/           usePomodoro · useNotificationPermission · useSettingsForm
├── services/        notificationService.ts
└── storage/         sessionStorage.ts · settingsStorage.ts
AGENTS.md            instrucciones para cualquier agente de IA
CLAUDE.md            puente para Claude Code (importa AGENTS.md)
```

## Requisitos

- Node.js 20+ (probado con 22)
- Un celular Android físico (las alarmas no se prueban bien en emulador)
- Cuenta gratuita de Expo (para generar el APK con EAS)

## Ejecutar

```bash
npm install
npm test            # pruebas del dominio
npm run typecheck   # verificación de tipos
```

### Opción A — APK con EAS (recomendada para la demo)
```bash
npx eas-cli@latest login
npm run build:apk          # perfil "preview" → genera un .apk descargable
```
Instala el APK en el celular desde el enlace que entrega EAS.

### Opción B — Compilar en tu PC (requiere Android Studio y el celular con depuración USB)
```bash
npm run android            # expo run:android
```

### Desarrollo rápido de UI
`npx expo start` y abre con Expo Go. Ahí puedes probar el temporizador y el diseño, pero **la alarma personalizada (sonido, canal de alarma, modo silencio) solo funciona en el APK o en un development build**.

## Mostrar el celular en la PC (para el video)
```bash
scrcpy
```

## Trabajar con IA en este proyecto

1. Lee [`AGENTS.md`](AGENTS.md) y [`docs/constitution.md`](docs/constitution.md).
2. Flujo SDD: HU → `spec-writer` (spec + plan) → `mobile-implementer` (tasks + código + tests) → `qa-tester` (verificación) → `ui-designer` (identidad visual).
3. Con Claude Code: `npm run sync:claude` para que detecte agentes y skills de `.github/`.

## Tecnologías y por qué
Ver [`docs/decisiones-tecnicas.md`](docs/decisiones-tecnicas.md).
