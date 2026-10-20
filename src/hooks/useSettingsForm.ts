import { useCallback, useEffect, useState } from 'react';

import { DEFAULT_SETTINGS } from '@/constants/pomodoro';
import type { SettingKey } from '@/domain/models/pomodoro';
import {
  settingsToFormValues,
  validateSettings,
  validateSettingValue,
  type SettingsErrors,
  type SettingsFormValues,
} from '@/domain/validators/settingsValidator';
import { loadSettings, resetSettings, saveSettings } from '@/storage/settingsStorage';

/** HU-005: estado del formulario de ajustes. */
export function useSettingsForm() {
  const [values, setValues] = useState<SettingsFormValues>(settingsToFormValues(DEFAULT_SETTINGS));
  const [errors, setErrors] = useState<SettingsErrors>({});
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings().then((stored) => {
      setValues(settingsToFormValues(stored));
      setLoading(false);
    });
  }, []);

  const changeValue = useCallback((key: SettingKey, value: string) => {
    setValues((previous) => ({ ...previous, [key]: value }));
    // Si el campo tenía error, se revalida mientras escribe para dar retroalimentación inmediata.
    setErrors((previous) => {
      if (!previous[key]) return previous;
      const error = validateSettingValue(key, value);
      return { ...previous, [key]: error ?? undefined };
    });
  }, []);

  /** Devuelve true si se guardó. Si hay errores no guarda nada. */
  const save = useCallback(async (): Promise<boolean> => {
    const result = validateSettings(values);
    if (!result.valid) {
      setErrors(result.errors);
      return false;
    }
    await saveSettings(result.settings);
    setErrors({});
    return true;
  }, [values]);

  const restoreDefaults = useCallback(async () => {
    const defaults = await resetSettings();
    setValues(settingsToFormValues(defaults));
    setErrors({});
  }, []);

  return { values, errors, isLoading, changeValue, save, restoreDefaults };
}
