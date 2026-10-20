import { PHASE_LABELS } from '@/constants/pomodoro';
import type { Phase, PomodoroSession, PomodoroSettings } from '@/domain/models/pomodoro';
import { getNextPhase } from '@/domain/rules/pomodoroRules';

const FINISHED_TITLES: Record<Phase, string> = {
  study: '¡Terminó tu tiempo de estudio!',
  shortBreak: 'Terminó el descanso corto',
  longBreak: 'Terminó el descanso largo',
};

/** HU-004: el aviso dice qué fase terminó y qué sigue. */
export function buildPhaseEndMessage(
  session: PomodoroSession,
  settings: PomodoroSettings,
): { title: string; body: string } {
  const next = getNextPhase(session, settings);
  const body =
    next.phase === 'study'
      ? 'Tu siguiente tiempo de estudio está listo. Abre la app para iniciarlo.'
      : `Te toca un ${PHASE_LABELS[next.phase].toLowerCase()}. Abre la app para iniciarlo.`;
  return { title: FINISHED_TITLES[session.phase], body };
}

export function describeFinishedPhase(finished: Phase, nextPhase: Phase): string {
  return `${FINISHED_TITLES[finished]} Ahora: ${PHASE_LABELS[nextPhase].toLowerCase()}.`;
}
