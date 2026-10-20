import { useCallback, useEffect, useRef, useState } from 'react';
import { Linking } from 'react-native';

import {
  getNotificationPermission,
  requestNotificationPermission,
} from '@/services/notificationService';

type PendingAction = () => void | Promise<void>;

/**
 * HU-004, escenario "Permiso de notificaciones":
 * antes del diálogo del sistema se explica para qué se necesita el permiso.
 * El temporizador funciona igual si el estudiante no lo concede.
 */
export function useNotificationPermission() {
  const [isExplainerVisible, setExplainerVisible] = useState(false);
  const [isDenied, setDenied] = useState(false);
  const pendingAction = useRef<PendingAction | null>(null);

  useEffect(() => {
    getNotificationPermission().then((permission) => setDenied(permission === 'denied'));
  }, []);

  const runPending = useCallback(async () => {
    const action = pendingAction.current;
    pendingAction.current = null;
    await action?.();
  }, []);

  /** Ejecuta la acción; si falta el permiso, primero muestra la explicación. */
  const runWithPermission = useCallback(async (action: PendingAction) => {
    const permission = await getNotificationPermission();
    if (permission === 'undetermined') {
      pendingAction.current = action;
      setExplainerVisible(true);
      return;
    }
    setDenied(permission === 'denied');
    await action();
  }, []);

  const acceptExplainer = useCallback(async () => {
    setExplainerVisible(false);
    const granted = await requestNotificationPermission();
    setDenied(!granted);
    await runPending();
  }, [runPending]);

  const declineExplainer = useCallback(async () => {
    setExplainerVisible(false);
    await runPending();
  }, [runPending]);

  const openSystemSettings = useCallback(() => {
    void Linking.openSettings();
  }, []);

  return {
    isExplainerVisible,
    isDenied,
    runWithPermission,
    acceptExplainer,
    declineExplainer,
    openSystemSettings,
  };
}
