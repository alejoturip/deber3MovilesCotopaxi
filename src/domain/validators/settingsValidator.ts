import { SETTINGS_LIMITS } from '@/constants/pomodoro';
import type { PomodoroSettings, SettingKey } from '@/domain/models/pomodoro';

/** Valores tal como los escribe el estudiante en el formulario. */
export type SettingsFormValues = Record<SettingKey, string>;
export type SettingsErrors = Partial<Record<SettingKey, string>>;

export type SettingsValidationResult =
  | { valid: true; settings: PomodoroSettings }
  | { valid: false; errors: SettingsErrors };

const SETTING_KEYS = Object.keys(SETTINGS_LIMITS) as SettingKey[];

export function describeAllowedRange(key: SettingKey): string {
  const { min, max, unit } = SETTINGS_LIMITS[key];
  return `Entre ${min} y ${max} ${unit}`;
}

/** Valida un campo. Devuelve el mensaje de error o null si es válido. */
export function validateSettingValue(key: SettingKey, rawValue: string): string | null {
  const value = rawValue.trim();
  const range = describeAllowedRange(key).toLowerCase();

  if (value === '') return `Este campo es obligatorio. Usa un valor ${range}.`;
  if (!/^\d+$/.test(value)) return `Solo números enteros. Usa un valor ${range}.`;

  const { min, max } = SETTINGS_LIMITS[key];
  const numeric = Number(value);
  if (numeric < min || numeric > max) return `Valor fuera de rango. Usa un valor ${range}.`;

  return null;
}

/** HU-005: si algún campo no es válido, no se guarda nada y se indican los valores permitidos. */
export function validateSettings(values: SettingsFormValues): SettingsValidationResult {
  const errors: SettingsErrors = {};
  for (const key of SETTING_KEYS) {
    const error = validateSettingValue(key, values[key]);
    if (error) errors[key] = error;
  }
  if (Object.keys(errors).length > 0) return { valid: false, errors };

  const settings = Object.fromEntries(
    SETTING_KEYS.map((key) => [key, Number(values[key].trim())]),
  ) as unknown as PomodoroSettings;
  return { valid: true, settings };
}

/** Comprueba que unos ajustes leídos del almacenamiento sigan siendo válidos. */
export function isValidSettings(candidate: unknown): candidate is PomodoroSettings {
  if (typeof candidate !== 'object' || candidate === null) return false;
  const record = candidate as Record<string, unknown>;
  return SETTING_KEYS.every((key) => {
    const value = record[key];
    return typeof value === 'number' && validateSettingValue(key, String(value)) === null;
  });
}

export function settingsToFormValues(settings: PomodoroSettings): SettingsFormValues {
  return Object.fromEntries(
    SETTING_KEYS.map((key) => [key, String(settings[key])]),
  ) as unknown as SettingsFormValues;
}
