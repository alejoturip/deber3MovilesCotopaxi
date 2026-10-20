import { Pressable, StyleSheet, Text, type PressableProps, type ViewStyle } from 'react-native';

import { colors, MIN_TOUCH_SIZE, radius, spacing, typography } from '@/constants/theme';

type ButtonVariant = 'primary' | 'secondary' | 'accent' | 'ghost';

interface ButtonProps extends Omit<PressableProps, 'style' | 'children'> {
  label: string;
  variant?: ButtonVariant;
  style?: ViewStyle;
}

/** Botón institucional: primario azul, secundario con borde azul, acento dorado. */
export function Button({ label, variant = 'primary', style, disabled, ...rest }: ButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        variantStyles[variant].container,
        pressed && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
      {...rest}
    >
      <Text style={[styles.label, variantStyles[variant].label]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: MIN_TOUCH_SIZE,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
  },
  label: {
    fontSize: typography.subtitle,
    fontWeight: typography.weightSemibold,
  },
  pressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },
  disabled: { opacity: 0.45 },
});

const variantStyles = {
  primary: StyleSheet.create({
    container: { backgroundColor: colors.navy, borderColor: colors.navy },
    label: { color: colors.white },
  }),
  secondary: StyleSheet.create({
    container: { backgroundColor: colors.white, borderColor: colors.navy },
    label: { color: colors.navy },
  }),
  // Dorado con texto azul para mantener contraste.
  accent: StyleSheet.create({
    container: { backgroundColor: colors.gold, borderColor: colors.gold },
    label: { color: colors.navy },
  }),
  ghost: StyleSheet.create({
    container: { backgroundColor: 'transparent', borderColor: 'transparent' },
    label: { color: colors.navySoft },
  }),
} satisfies Record<ButtonVariant, { container: object; label: object }>;
