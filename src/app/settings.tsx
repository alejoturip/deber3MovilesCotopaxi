import { router } from 'expo-router';
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';

import { SettingField } from '@/components/SettingField';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { DEFAULT_SETTINGS, SETTING_LABELS } from '@/constants/pomodoro';
import { colors, spacing, typography } from '@/constants/theme';
import type { SettingKey } from '@/domain/models/pomodoro';
import { describeAllowedRange } from '@/domain/validators/settingsValidator';
import { useSettingsForm } from '@/hooks/useSettingsForm';

const FIELDS: SettingKey[] = ['studyMinutes', 'shortBreakMinutes', 'longBreakMinutes', 'pomodorosPerCycle'];

/** Pantalla de ajustes (HU-005). */
export default function SettingsScreen() {
  const form = useSettingsForm();

  if (form.isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={colors.navy} size="large" />
      </View>
    );
  }

  const handleSave = async () => {
    const saved = await form.save();
    if (saved) router.back();
  };

  const handleRestore = () =>
    Alert.alert(
      '¿Restablecer valores por defecto?',
      `Estudio ${DEFAULT_SETTINGS.studyMinutes} min, descanso corto ${DEFAULT_SETTINGS.shortBreakMinutes} min, ` +
        `descanso largo ${DEFAULT_SETTINGS.longBreakMinutes} min y ${DEFAULT_SETTINGS.pomodorosPerCycle} pomodoros por ciclo.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Restablecer', onPress: () => void form.restoreDefaults() },
      ],
    );

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Card style={styles.card}>
          {FIELDS.map((key) => (
            <SettingField
              key={key}
              label={SETTING_LABELS[key]}
              hint={describeAllowedRange(key)}
              value={form.values[key]}
              error={form.errors[key]}
              onChangeText={(value) => form.changeValue(key, value)}
            />
          ))}
        </Card>

        <Text style={styles.note}>
          Los cambios se aplican desde la próxima fase. Si tienes una fase en curso, terminará con el tiempo con
          el que empezó.
        </Text>

        <Button label="Guardar cambios" onPress={handleSave} />
        <Button label="Restablecer valores por defecto" variant="secondary" onPress={handleRestore} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background },
  content: { padding: spacing.lg, gap: spacing.md, width: '100%', maxWidth: 520, alignSelf: 'center' },
  card: { gap: spacing.lg },
  note: { fontSize: typography.caption, color: colors.textSecondary, textAlign: 'center' },
});
