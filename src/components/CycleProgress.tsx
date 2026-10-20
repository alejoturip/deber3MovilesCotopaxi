import { StyleSheet, Text, View } from 'react-native';

import { colors, spacing, typography } from '@/constants/theme';

interface CycleProgressProps {
  completed: number;
  total: number;
}

/** HU-002: cuántos pomodoros lleva en el ciclo actual. Texto + puntos (no depende solo del color). */
export function CycleProgress({ completed, total }: CycleProgressProps) {
  return (
    <View style={styles.container} accessible accessibilityLabel={`${completed} de ${total} pomodoros en este ciclo`}>
      <View style={styles.dots}>
        {Array.from({ length: total }, (_, index) => (
          <View key={index} style={[styles.dot, index < completed ? styles.dotDone : styles.dotPending]} />
        ))}
      </View>
      <Text style={styles.label}>
        {completed} de {total} pomodoros · descanso largo al completar el ciclo
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', gap: spacing.sm },
  dots: { flexDirection: 'row', gap: spacing.sm },
  dot: { width: 14, height: 14, borderRadius: 7, borderWidth: 2 },
  dotDone: { backgroundColor: colors.gold, borderColor: colors.gold },
  dotPending: { backgroundColor: colors.white, borderColor: colors.navyMuted },
  label: { fontSize: typography.caption, color: colors.textSecondary, textAlign: 'center' },
});
