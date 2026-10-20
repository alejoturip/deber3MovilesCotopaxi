import { router } from 'expo-router';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppHeader } from '@/components/AppHeader';
import { CycleProgress } from '@/components/CycleProgress';
import { PermissionExplainer } from '@/components/PermissionExplainer';
import { PhaseBadge } from '@/components/PhaseBadge';
import { PhaseFinishedBanner } from '@/components/PhaseFinishedBanner';
import { TimerControls } from '@/components/TimerControls';
import { TimerRing } from '@/components/TimerRing';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { colors, spacing, typography } from '@/constants/theme';
import { useNotificationPermission } from '@/hooks/useNotificationPermission';
import { usePomodoro } from '@/hooks/usePomodoro';

/** Pantalla principal: temporizador (HU-001, HU-002, HU-003, HU-004, HU-006). */
export default function TimerScreen() {
  const pomodoro = usePomodoro();
  const permission = useNotificationPermission();
  const { session } = pomodoro;

  if (pomodoro.isLoading || !session) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={colors.navy} size="large" />
      </View>
    );
  }

  const handleStart = () => permission.runWithPermission(pomodoro.start);

  // HU-001: reiniciar pide confirmación; "Cancelar" conserva el tiempo.
  const handleReset = () =>
    Alert.alert('¿Reiniciar el temporizador?', 'Volverá al tiempo inicial de la fase actual.', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Reiniciar', style: 'destructive', onPress: () => void pomodoro.reset() },
    ]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <AppHeader onOpenSettings={() => router.push('/settings')} />

        <Card style={styles.timerCard}>
          <PhaseBadge phase={session.phase} status={session.status} />
          <TimerRing remainingMs={pomodoro.remainingMs} progress={pomodoro.progress} phase={session.phase} />
          <CycleProgress completed={session.completedPomodoros} total={pomodoro.settings.pomodorosPerCycle} />
        </Card>

        {session.lastFinishedPhase && (
          <PhaseFinishedBanner
            finishedPhase={session.lastFinishedPhase}
            nextPhase={session.phase}
            onDismiss={pomodoro.dismissFinished}
          />
        )}

        <TimerControls
          status={session.status}
          canReset={session.status !== 'idle'}
          onStart={handleStart}
          onPause={pomodoro.pause}
          onReset={handleReset}
        />

        {permission.isDenied && (
          <View style={styles.warning}>
            <Text style={styles.warningText}>
              Los avisos están desactivados. El temporizador funciona, pero no sonará la alarma.
            </Text>
            <Button label="Activar en ajustes del sistema" variant="secondary" onPress={permission.openSystemSettings} />
          </View>
        )}

        <Text style={styles.footer}>Sin anuncios · Sin registro · Funciona sin internet</Text>
      </ScrollView>

      <PermissionExplainer
        visible={permission.isExplainerVisible}
        onAccept={permission.acceptExplainer}
        onDecline={permission.declineExplainer}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background },
  content: {
    padding: spacing.lg,
    gap: spacing.lg,
    alignItems: 'center',
    width: '100%',
    maxWidth: 520,
    alignSelf: 'center',
  },
  timerCard: { width: '100%', alignItems: 'center', gap: spacing.lg },
  warning: {
    width: '100%',
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: 14,
    backgroundColor: colors.dangerSoft,
  },
  warningText: { color: colors.danger, fontSize: typography.caption, textAlign: 'center' },
  footer: { fontSize: typography.caption, color: colors.textSecondary, textAlign: 'center' },
});
