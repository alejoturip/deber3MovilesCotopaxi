import { StyleSheet, Text, View } from 'react-native';

import { PHASE_LABELS } from '@/constants/pomodoro';
import { colors, radius, spacing, typography } from '@/constants/theme';
import type { Phase, TimerStatus } from '@/domain/models/pomodoro';

const STATUS_LABELS: Record<TimerStatus, string> = {
  idle: 'Listo para iniciar',
  running: 'En curso',
  paused: 'En pausa',
};

/** HU-002, escenario "Ver mi avance": indica si es estudio o descanso (con texto, no solo color). */
export function PhaseBadge({ phase, status }: { phase: Phase; status: TimerStatus }) {
  const isStudy = phase === 'study';
  return (
    <View style={styles.row} accessibilityRole="header">
      <View style={[styles.badge, isStudy ? styles.study : styles.rest]}>
        <Text style={[styles.label, isStudy ? styles.studyLabel : styles.restLabel]}>
          {PHASE_LABELS[phase]}
        </Text>
      </View>
      <Text style={styles.status}>{STATUS_LABELS[status]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { alignItems: 'center', gap: spacing.xs },
  badge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.pill,
  },
  study: { backgroundColor: colors.navy },
  rest: { backgroundColor: colors.goldSoft, borderWidth: 1, borderColor: colors.gold },
  label: { fontSize: typography.body, fontWeight: typography.weightBold, letterSpacing: 0.5 },
  studyLabel: { color: colors.white },
  restLabel: { color: colors.navy },
  status: { fontSize: typography.caption, color: colors.textSecondary },
});
