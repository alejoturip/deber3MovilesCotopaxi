import { DEFAULT_SETTINGS } from '@/constants/pomodoro';
import type { PomodoroSettings } from '@/domain/models/pomodoro';
import {
  applySettingsToSession,
  completePhase,
  createInitialSession,
  getRemainingMs,
  pauseTimer,
  reconcileSession,
  resetTimer,
  startTimer,
} from '@/domain/rules/pomodoroRules';
import { formatRemaining, minutesToMs } from '@/domain/rules/time';

const settings: PomodoroSettings = DEFAULT_SETTINGS;
const T0 = 1_000_000;

describe('HU-001: iniciar y controlar una sesión', () => {
  it('inicia la cuenta con el tiempo de estudio configurado', () => {
    const running = startTimer(createInitialSession(settings), T0);
    expect(running.status).toBe('running');
    expect(getRemainingMs(running, T0)).toBe(minutesToMs(25));
    expect(formatRemaining(getRemainingMs(running, T0 + 1000))).toBe('24:59');
  });

  it('al pausar y reanudar continúa desde donde se pausó', () => {
    const running = startTimer(createInitialSession(settings), T0);
    const paused = pauseTimer(running, T0 + minutesToMs(10));
    expect(paused.remainingMs).toBe(minutesToMs(15));
    // Pasan 5 minutos en pausa: no deben descontarse.
    const resumed = startTimer(paused, T0 + minutesToMs(15));
    expect(getRemainingMs(resumed, T0 + minutesToMs(15))).toBe(minutesToMs(15));
  });

  it('reiniciar vuelve al tiempo inicial de la fase actual', () => {
    const running = startTimer(createInitialSession(settings), T0);
    const reset = resetTimer(pauseTimer(running, T0 + minutesToMs(7)));
    expect(reset.status).toBe('idle');
    expect(reset.phase).toBe('study');
    expect(reset.remainingMs).toBe(minutesToMs(25));
  });
});

describe('HU-002: alternar entre estudio y descanso', () => {
  it('tras un pomodoro deja listo un descanso corto (sin iniciarlo)', () => {
    const next = completePhase(createInitialSession(settings), settings);
    expect(next.phase).toBe('shortBreak');
    expect(next.status).toBe('idle');
    expect(next.completedPomodoros).toBe(1);
    expect(next.lastFinishedPhase).toBe('study');
  });

  it('al completar el ciclo deja listo el descanso largo y el contador vuelve a cero', () => {
    const session = { ...createInitialSession(settings), completedPomodoros: 3 };
    const next = completePhase(session, settings);
    expect(next.phase).toBe('longBreak');
    expect(next.completedPomodoros).toBe(0);
  });

  it('tras un descanso deja listo el siguiente estudio', () => {
    const shortBreak = completePhase(createInitialSession(settings), settings);
    const next = completePhase(shortBreak, settings);
    expect(next.phase).toBe('study');
    expect(next.completedPomodoros).toBe(1);
  });
});

describe('HU-003: conteo con el celular bloqueado o la app cerrada', () => {
  it('descuenta el tiempo que pasó con el celular bloqueado', () => {
    const running = startTimer(createInitialSession(settings), T0);
    expect(getRemainingMs(running, T0 + minutesToMs(4))).toBe(minutesToMs(21));
  });

  it('si el tiempo se cumplió con la app cerrada, la fase aparece como terminada', () => {
    const running = startTimer(createInitialSession(settings), T0);
    const reopened = reconcileSession(running, settings, T0 + minutesToMs(30));
    expect(reopened.lastFinishedPhase).toBe('study');
    expect(reopened.phase).toBe('shortBreak');
    expect(reopened.status).toBe('idle');
  });

  it('una sesión pausada se recupera pausada con el mismo tiempo', () => {
    const paused = pauseTimer(startTimer(createInitialSession(settings), T0), T0 + 60_000);
    const reopened = reconcileSession(paused, settings, T0 + minutesToMs(120));
    expect(reopened).toEqual(paused);
  });
});

describe('HU-005: ajustar tiempos', () => {
  const custom: PomodoroSettings = { ...settings, studyMinutes: 50, shortBreakMinutes: 10 };

  it('una fase en curso termina con el tiempo con el que empezó', () => {
    const running = startTimer(createInitialSession(settings), T0);
    expect(applySettingsToSession(running, custom)).toBe(running);
  });

  it('el cambio se aplica a la siguiente fase', () => {
    const next = completePhase(createInitialSession(settings), custom);
    expect(next.phaseDurationMs).toBe(minutesToMs(10));
  });

  it('una fase que aún no empieza toma el nuevo valor', () => {
    const updated = applySettingsToSession(createInitialSession(settings), custom);
    expect(updated.remainingMs).toBe(minutesToMs(50));
  });
});
