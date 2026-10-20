import { StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { colors, radius, spacing, typography } from '@/constants/theme';
import type { Phase } from '@/domain/models/pomodoro';
import { describeFinishedPhase } from '@/domain/rules/phaseMessages';

interface PhaseFinishedBannerProps {
  finishedPhase: Phase;
  nextPhase: Phase;
  onDismiss: () => void;
}

/** HU-003/HU-004: al volver a la app, la fase aparece como terminada y se puede detener la alarma. */
export function PhaseFinishedBanner({ finishedPhase, nextPhase, onDismiss }: PhaseFinishedBannerProps) {
  return (
    <View style={styles.container} accessibilityRole="alert">
      <Text style={styles.text}>{describeFinishedPhase(finishedPhase, nextPhase)}</Text>
      <Button label="Detener alarma" variant="accent" onPress={onDismiss} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: colors.goldSoft,
    borderColor: colors.gold,
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.md,
    gap: spacing.sm,
  },
  text: {
    color: colors.navy,
    fontSize: typography.body,
    fontWeight: typography.weightSemibold,
    textAlign: 'center',
  },
});
