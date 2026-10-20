const MS_PER_SECOND = 1000;
const MS_PER_MINUTE = 60 * MS_PER_SECOND;

export function minutesToMs(minutes: number): number {
  return minutes * MS_PER_MINUTE;
}

/**
 * Formatea milisegundos como "mm:ss".
 * Redondea hacia arriba para que "00:00" aparezca solo cuando el tiempo realmente terminó.
 */
export function formatRemaining(ms: number): string {
  const totalSeconds = Math.max(0, Math.ceil(ms / MS_PER_SECOND));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}
