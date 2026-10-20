import type { Phase, PomodoroSettings, SettingKey } from '@/domain/models/pomodoro';

/** Valores por defecto de la técnica Pomodoro (HU-005, escenario "Volver a los valores por defecto"). */
export const DEFAULT_SETTINGS: PomodoroSettings = {
  studyMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 15,
  pomodorosPerCycle: 4,
};

/**
 * Rangos permitidos para cada ajuste (HU-005, escenario "Ingresar un valor no válido").
 * El mínimo de 1 minuto permite demostrar el ciclo completo en el video sin esperar 25 minutos.
 */
export const SETTINGS_LIMITS: Record<SettingKey, { min: number; max: number; unit: string }> = {
  studyMinutes: { min: 1, max: 90, unit: 'min' },
  shortBreakMinutes: { min: 1, max: 30, unit: 'min' },
  longBreakMinutes: { min: 1, max: 60, unit: 'min' },
  pomodorosPerCycle: { min: 2, max: 8, unit: 'pomodoros' },
};

export const SETTING_LABELS: Record<SettingKey, string> = {
  studyMinutes: 'Tiempo de estudio',
  shortBreakMinutes: 'Descanso corto',
  longBreakMinutes: 'Descanso largo',
  pomodorosPerCycle: 'Pomodoros antes del descanso largo',
};

export const PHASE_LABELS: Record<Phase, string> = {
  study: 'Estudio',
  shortBreak: 'Descanso corto',
  longBreak: 'Descanso largo',
};

/** Frecuencia de refresco de la pantalla. No se usa para contar el tiempo. */
export const TICK_INTERVAL_MS = 250;
