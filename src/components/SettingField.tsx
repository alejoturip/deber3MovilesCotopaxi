import { StyleSheet, Text, TextInput, View } from 'react-native';

import { colors, MIN_TOUCH_SIZE, radius, spacing, typography } from '@/constants/theme';

interface SettingFieldProps {
  label: string;
  hint: string;
  value: string;
  error?: string;
  onChangeText: (value: string) => void;
}

/** Campo numérico con etiqueta, rango permitido y mensaje de error (HU-005). */
export function SettingField({ label, hint, value, error, onChangeText }: SettingFieldProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        keyboardType="number-pad"
        maxLength={3}
        accessibilityLabel={label}
        accessibilityHint={hint}
        style={[styles.input, error ? styles.inputError : null]}
        placeholderTextColor={colors.navyMuted}
      />
      <Text style={[styles.helper, error ? styles.errorText : null]}>{error ?? hint}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: spacing.xs },
  label: { fontSize: typography.body, fontWeight: typography.weightSemibold, color: colors.navy },
  input: {
    minHeight: MIN_TOUCH_SIZE,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    fontSize: typography.subtitle,
    color: colors.navy,
    backgroundColor: colors.white,
  },
  inputError: { borderColor: colors.danger, backgroundColor: colors.dangerSoft },
  helper: { fontSize: typography.caption, color: colors.textSecondary },
  errorText: { color: colors.danger },
});
