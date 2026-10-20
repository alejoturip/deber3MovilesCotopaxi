import { useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';

import { DEFAULT_SETTINGS, TICK_INTERVAL_MS } from '@/constants/pomodoro';
import type { PomodoroSession, PomodoroSettings } from '@/domain/models/pomodoro';
import { buildPhaseEndMessage } from '@/domain/rules/phaseMessages';
import {
  applySettingsToSession,
  createInitialSession,
  dismissFinishedNotice,
  getProgress,
  getRemainingMs,
  pauseTimer,
  reconcileSession,
  resetTimer,
  startTimer,
} from '@/domain/rules/pomodoroRules';
import {
  cancelPhaseEndAlarm,
  schedulePhaseEndAlarm,
  stopAlarm,
} from '@/services/notificationService';
import { loadSession, saveSession } from '@/storage/sessionStorage';
import { loadSettings } from '@/storage/settingsStorage';

/**
 * Conecta las reglas del dominio con React, el almacenamiento y los avisos.
 * La pantalla solo consume este hook; no conoce AsyncStorage ni expo-notifications.
 */
export function usePomodoro() {
  const [session, setSession] = useState<PomodoroSession | null>(null);
  const [settings, setSettings] = useState<PomodoroSettings>(DEFAULT_SETTINGS);
  const [now, setNow] = useState(() => Date.now());

  // Refs para leer el estado más reciente dentro de listeners e intervalos.
  const sessionRef = useRef<PomodoroSession | null>(null);
  const settingsRef = useRef<PomodoroSettings>(DEFAULT_SETTINGS);

  /** Único punto donde cambia la sesión: actualiza la UI y la persiste. */
  const commit = useCallback((next: PomodoroSession) => {
    sessionRef.current = next;
    setSession(next);
    void saveSession(next);
  }, []);

  /** HU-003: recalcula el estado con la hora real (al volver de bloqueo o al reabrir). */
  const sync = useCallback(() => {
    const current = sessionRef.current;
    const timestamp = Date.now();
    setNow(timestamp);
    if (!current) return;
    const next = reconcileSession(current, settingsRef.current, timestamp);
    if (next !== current) commit(next);
  }, [commit]);

  // Carga inicial: recupera ajustes y la sesión guardada.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [storedSettings, storedSession] = await Promise.all([loadSettings(), loadSession()]);
      if (cancelled) return;
      settingsRef.current = storedSettings;
      setSettings(storedSettings);
      const base = storedSession ?? createInitialSession(storedSettings);
      const timestamp = Date.now();
      setNow(timestamp);
      commit(reconcileSession(applySettingsToSession(base, storedSettings), storedSettings, timestamp));
    })();
    return () => {
      cancelled = true;
    };
  }, [commit]);

  // Refresca la pantalla mientras corre. El intervalo NO cuenta el tiempo, solo repinta.
  const isRunning = session?.status === 'running';
  useEffect(() => {
    if (!isRunning) return;
    const id = setInterval(sync, TICK_INTERVAL_MS);
    return () => clearInterval(id);
  }, [isRunning, sync]);

  // Al desbloquear el celular o volver a la app.
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') sync();
    });
    return () => subscription.remove();
  }, [sync]);

  // Al volver de la pantalla de ajustes: aplica los nuevos tiempos (HU-005).
  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      loadSettings().then((storedSettings) => {
        if (cancelled) return;
        settingsRef.current = storedSettings;
        setSettings(storedSettings);
        const current = sessionRef.current;
        if (!current) return;
        const next = applySettingsToSession(current, storedSettings);
        if (next !== current) commit(next);
      });
      return () => {
        cancelled = true;
      };
    }, [commit]),
  );

  const start = useCallback(async () => {
    const current = sessionRef.current;
    if (!current || current.status === 'running') return;
    // Primero el estado (el temporizador nunca depende de los avisos), luego la alarma.
    const next = startTimer(current, Date.now());
    commit(next);
    await stopAlarm();
    if (next.endsAt !== null) {
      await schedulePhaseEndAlarm({
        endsAt: next.endsAt,
        ...buildPhaseEndMessage(next, settingsRef.current),
      });
    }
  }, [commit]);

  const pause = useCallback(async () => {
    const current = sessionRef.current;
    if (!current) return;
    commit(pauseTimer(current, Date.now()));
    await cancelPhaseEndAlarm();
  }, [commit]);

  const reset = useCallback(async () => {
    const current = sessionRef.current;
    if (!current) return;
    commit(resetTimer(current));
    await cancelPhaseEndAlarm();
  }, [commit]);

  /** HU-004: detener la alarma desde la app y ocultar el aviso de fase terminada. */
  const dismissFinished = useCallback(async () => {
    const current = sessionRef.current;
    if (current) commit(dismissFinishedNotice(current));
    await stopAlarm();
  }, [commit]);

  return {
    isLoading: session === null,
    session,
    settings,
    remainingMs: session ? getRemainingMs(session, now) : 0,
    progress: session ? getProgress(session, now) : 0,
    start,
    pause,
    reset,
    dismissFinished,
  };
}
