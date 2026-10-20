import { DEFAULT_SETTINGS } from '@/constants/pomodoro';
import {
  isValidSettings,
  settingsToFormValues,
  validateSettings,
  validateSettingValue,
} from '@/domain/validators/settingsValidator';

describe('HU-005: validación de ajustes', () => {
  it('acepta los valores por defecto', () => {
    const result = validateSettings(settingsToFormValues(DEFAULT_SETTINGS));
    expect(result).toEqual({ valid: true, settings: DEFAULT_SETTINGS });
  });

  it.each([
    ['', 'obligatorio'],
    ['0', 'fuera de rango'],
    ['91', 'fuera de rango'],
    ['2.5', 'enteros'],
    ['abc', 'enteros'],
  ])('rechaza "%s" e indica los valores permitidos', (value, expected) => {
    const error = validateSettingValue('studyMinutes', value);
    expect(error).toContain(expected);
    expect(error).toContain('entre 1 y 90');
  });

  it('no guarda nada si un solo campo es inválido', () => {
    const values = { ...settingsToFormValues(DEFAULT_SETTINGS), pomodorosPerCycle: '1' };
    const result = validateSettings(values);
    expect(result.valid).toBe(false);
  });

  it('descarta ajustes corruptos leídos del almacenamiento', () => {
    expect(isValidSettings({ ...DEFAULT_SETTINGS, studyMinutes: 0 })).toBe(false);
    expect(isValidSettings(null)).toBe(false);
    expect(isValidSettings(DEFAULT_SETTINGS)).toBe(true);
  });
});
