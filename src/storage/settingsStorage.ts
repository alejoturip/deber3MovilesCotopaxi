import AsyncStorage from '@react-native-async-storage/async-storage';

import { DEFAULT_SETTINGS } from '@/constants/pomodoro';
import type { PomodoroSettings } from '@/domain/models/pomodoro';
import { isValidSettings } from '@/domain/validators/settingsValidator';

const SETTINGS_KEY = '@cotopaxi-focus/settings/v1';

/** HU-005 / HU-006: los ajustes viven solo en el celular, sin cuenta ni internet. */
export async function loadSettings(): Promise<PomodoroSettings> {
  try {
    const raw = await AsyncStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed: unknown = JSON.parse(raw);
    return isValidSettings(parsed) ? parsed : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export async function saveSettings(settings: PomodoroSettings): Promise<void> {
  await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export async function resetSettings(): Promise<PomodoroSettings> {
  await AsyncStorage.removeItem(SETTINGS_KEY);
  return DEFAULT_SETTINGS;
}
