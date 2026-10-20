import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { spacing } from '@/constants/theme';
import type { TimerStatus } from '@/domain/models/pomodoro';

interface TimerControlsProps {
  status: TimerStatus;
  canReset: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
}

/** HU-001: iniciar, pausar/reanudar y reiniciar. */
export function TimerControls({ status, canReset, onStart, onPause, onReset }: TimerControlsProps) {
  const primary =
    status === 'running'
      ? { label: 'Pausar', onPress: onPause, variant: 'secondary' as const }
      : { label: status === 'paused' ? 'Reanudar' : 'Iniciar', onPress: onStart, variant: 'primary' as const };

  return (
    <View style={styles.container}>
      <Button label={primary.label} variant={primary.variant} onPress={primary.onPress} style={styles.main} />
      <Button label="Reiniciar" variant="ghost" onPress={onReset} disabled={!canReset} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: '100%', gap: spacing.sm, alignItems: 'stretch' },
  main: { minHeight: 56 },
});
