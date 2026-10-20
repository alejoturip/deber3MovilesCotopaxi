# Plan HU-005

## Archivos
- `src/constants/pomodoro.ts`: `DEFAULT_SETTINGS`, `SETTINGS_LIMITS`, etiquetas.
- `src/domain/validators/settingsValidator.ts`: validación por campo y global.
- `src/domain/rules/pomodoroRules.ts`: `applySettingsToSession`.
- `src/storage/settingsStorage.ts`: cargar/guardar/restablecer (si lo guardado es inválido → valores por defecto).
- `src/hooks/useSettingsForm.ts`: estado del formulario.
- `src/components/SettingField.tsx`, `src/app/settings.tsx`.
- `usePomodoro` recarga ajustes con `useFocusEffect` al volver de la pantalla de ajustes.

## Decisión
Sin librería de formularios (react-hook-form, zod): son 4 campos numéricos; un validador puro es suficiente y testeable.
