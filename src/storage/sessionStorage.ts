import AsyncStorage from '@react-native-async-storage/async-storage';

import type { PomodoroSession } from '@/domain/models/pomodoro';

const SESSION_KEY = '@cotopaxi-focus/session/v1';

const PHASES = ['study', 'shortBreak', 'longBreak'];
const STATUSES = ['idle', 'running', 'paused'];

function isValidSession(candidate: unknown): candidate is PomodoroSession {
  if (typeof candidate !== 'object' || candidate === null) return false;
  const s = candidate as Record<string, unknown>;
  return (
    PHASES.includes(s.phase as string) &&
    STATUSES.includes(s.status as string) &&
    typeof s.phaseDurationMs === 'number' &&
    typeof s.remainingMs === 'number' &&
    (s.endsAt === null || typeof s.endsAt === 'number') &&
    typeof s.completedPomodoros === 'number' &&
    (s.lastFinishedPhase === null || PHASES.includes(s.lastFinishedPhase as string))
  );
}

/** HU-003: recupera la sesión aunque la app haya sido cerrada desde recientes. */
export async function loadSession(): Promise<PomodoroSession | null> {
  try {
    const raw = await AsyncStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    return isValidSession(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export async function saveSession(session: PomodoroSession): Promise<void> {
  await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(session));
}
