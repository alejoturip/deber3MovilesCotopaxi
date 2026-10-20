/**
 * Modelos del dominio Pomodoro.
 * No dependen de React, React Native ni de ningún mecanismo de almacenamiento.
 */

/** Fases posibles de la técnica Pomodoro. */
export type Phase = 'study' | 'shortBreak' | 'longBreak';

/**
 * Estado del temporizador dentro de la fase actual.
 * - idle: la fase está lista para iniciarse (tiempo completo).
 * - running: la cuenta regresiva está corriendo.
 * - paused: la cuenta está detenida conservando el tiempo restante.
 */
export type TimerStatus = 'idle' | 'running' | 'paused';

/** Ajustes configurables por el estudiante (HU-005). */
export interface PomodoroSettings {
  studyMinutes: number;
  shortBreakMinutes: number;
  longBreakMinutes: number;
  pomodorosPerCycle: number;
}

export type SettingKey = keyof PomodoroSettings;

/**
 * Sesión persistida. La clave de HU-003 es que el tiempo NO se cuenta con
 * un intervalo: se guarda la hora absoluta de fin (`endsAt`) y el tiempo
 * restante se calcula como `endsAt - ahora`.
 */
export interface PomodoroSession {
  phase: Phase;
  status: TimerStatus;
  /** Duración con la que empezó la fase actual (HU-005: no cambia a mitad de fase). */
  phaseDurationMs: number;
  /** Tiempo restante cuando el estado es idle o paused. */
  remainingMs: number;
  /** Marca de tiempo (epoch ms) en la que termina la fase. Solo cuando está corriendo. */
  endsAt: number | null;
  /** Pomodoros de estudio completados en el ciclo actual (HU-002). */
  completedPomodoros: number;
  /** Fase que acaba de terminar, para mostrar el aviso al volver a la app (HU-003/HU-004). */
  lastFinishedPhase: Phase | null;
}
