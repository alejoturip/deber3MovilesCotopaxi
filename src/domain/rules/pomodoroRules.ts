import type { Phase, PomodoroSession, PomodoroSettings } from '@/domain/models/pomodoro';
import { minutesToMs } from '@/domain/rules/time';

/**
 * Reglas de negocio del temporizador Pomodoro.
 * Todas son funciones puras: reciben el estado y la hora actual (`now`)
 * y devuelven un estado nuevo. Esto las hace fáciles de probar (ver __tests__).
 */

export function getPhaseDurationMs(phase: Phase, settings: PomodoroSettings): number {
  switch (phase) {
    case 'study':
      return minutesToMs(settings.studyMinutes);
    case 'shortBreak':
      return minutesToMs(settings.shortBreakMinutes);
    case 'longBreak':
      return minutesToMs(settings.longBreakMinutes);
  }
}

/** Crea una fase lista para iniciarse con el tiempo completo. */
function preparePhase(
  phase: Phase,
  settings: PomodoroSettings,
  completedPomodoros: number,
  lastFinishedPhase: Phase | null,
): PomodoroSession {
  const duration = getPhaseDurationMs(phase, settings);
  return {
    phase,
    status: 'idle',
    phaseDurationMs: duration,
    remainingMs: duration,
    endsAt: null,
    completedPomodoros,
    lastFinishedPhase,
  };
}

export function createInitialSession(settings: PomodoroSettings): PomodoroSession {
  return preparePhase('study', settings, 0, null);
}

/** HU-001: iniciar o reanudar. La cuenta continúa desde el tiempo restante guardado. */
export function startTimer(session: PomodoroSession, now: number): PomodoroSession {
  if (session.status === 'running') return session;
  return {
    ...session,
    status: 'running',
    endsAt: now + session.remainingMs,
    lastFinishedPhase: null,
  };
}

/** HU-001: pausar conservando el tiempo restante exacto. */
export function pauseTimer(session: PomodoroSession, now: number): PomodoroSession {
  if (session.status !== 'running' || session.endsAt === null) return session;
  return {
    ...session,
    status: 'paused',
    remainingMs: Math.max(0, session.endsAt - now),
    endsAt: null,
  };
}

/** HU-001: reiniciar vuelve al tiempo inicial de la fase actual (no cambia de fase). */
export function resetTimer(session: PomodoroSession): PomodoroSession {
  return {
    ...session,
    status: 'idle',
    remainingMs: session.phaseDurationMs,
    endsAt: null,
    lastFinishedPhase: null,
  };
}

/** HU-003: el tiempo restante se calcula, no se cuenta. */
export function getRemainingMs(session: PomodoroSession, now: number): number {
  if (session.status === 'running' && session.endsAt !== null) {
    return Math.max(0, session.endsAt - now);
  }
  return session.remainingMs;
}

export function getProgress(session: PomodoroSession, now: number): number {
  if (session.phaseDurationMs <= 0) return 0;
  const elapsed = session.phaseDurationMs - getRemainingMs(session, now);
  return Math.min(1, Math.max(0, elapsed / session.phaseDurationMs));
}

export function isPhaseFinished(session: PomodoroSession, now: number): boolean {
  return session.status === 'running' && session.endsAt !== null && now >= session.endsAt;
}

/**
 * HU-002: decide qué fase sigue.
 * - Tras un estudio: descanso corto, o descanso largo si se completó el ciclo.
 * - Tras cualquier descanso: estudio.
 */
export function getNextPhase(
  session: PomodoroSession,
  settings: PomodoroSettings,
): { phase: Phase; completedPomodoros: number } {
  if (session.phase !== 'study') {
    return { phase: 'study', completedPomodoros: session.completedPomodoros };
  }
  const completed = session.completedPomodoros + 1;
  if (completed >= settings.pomodorosPerCycle) {
    // Escenario "Llegar al descanso largo": el contador vuelve a cero.
    return { phase: 'longBreak', completedPomodoros: 0 };
  }
  return { phase: 'shortBreak', completedPomodoros: completed };
}

/**
 * HU-002: al terminar una fase la siguiente queda LISTA (idle), no arranca sola.
 * Se usan los ajustes vigentes, así un cambio en ajustes se aplica desde la próxima fase (HU-005).
 */
export function completePhase(session: PomodoroSession, settings: PomodoroSettings): PomodoroSession {
  const next = getNextPhase(session, settings);
  return preparePhase(next.phase, settings, next.completedPomodoros, session.phase);
}

/**
 * HU-003: al abrir la app o volver a primer plano, si el tiempo se cumplió
 * mientras estaba cerrada o bloqueada, la fase aparece como terminada.
 */
export function reconcileSession(
  session: PomodoroSession,
  settings: PomodoroSettings,
  now: number,
): PomodoroSession {
  return isPhaseFinished(session, now) ? completePhase(session, settings) : session;
}

/**
 * HU-005: los nuevos ajustes solo afectan a una fase que aún no ha empezado.
 * Una fase corriendo o pausada termina con el tiempo con el que empezó.
 */
export function applySettingsToSession(
  session: PomodoroSession,
  settings: PomodoroSettings,
): PomodoroSession {
  if (session.status !== 'idle') return session;
  const duration = getPhaseDurationMs(session.phase, settings);
  if (duration === session.phaseDurationMs) return session;
  return { ...session, phaseDurationMs: duration, remainingMs: duration };
}

/** Oculta el aviso de "fase terminada" sin modificar el temporizador. */
export function dismissFinishedNotice(session: PomodoroSession): PomodoroSession {
  return session.lastFinishedPhase === null ? session : { ...session, lastFinishedPhase: null };
}
