import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, MIN_TOUCH_SIZE, radius, spacing, typography } from '@/constants/theme';

const logo = require('../../assets/images/logo-cotopaxi.png');

interface AppHeaderProps {
  onOpenSettings: () => void;
}

/** Encabezado con el logotipo original (sin deformar) y acceso a ajustes. */
export function AppHeader({ onOpenSettings }: AppHeaderProps) {
  return (
    <View style={styles.container}>
      <Image
        source={logo}
        style={styles.logo}
        resizeMode="contain"
        accessibilityRole="image"
        accessibilityLabel="Logotipo de Academia Cotopaxi American International School"
      />
      <View style={styles.titles}>
        <Text style={styles.title} numberOfLines={1} adjustsFontSizeToFit>
          Cotopaxi Focus
        </Text>
        <Text style={styles.subtitle}>Bienestar Estudiantil</Text>
      </View>
      <Pressable
        onPress={onOpenSettings}
        accessibilityRole="button"
        accessibilityLabel="Abrir ajustes"
        style={({ pressed }) => [styles.settingsButton, pressed && styles.pressed]}
      >
        <Text style={styles.settingsLabel}>Ajustes</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  logo: { width: 56, height: 56 },
  titles: { flex: 1 },
  title: {
    fontSize: typography.title,
    fontWeight: typography.weightBold,
    color: colors.navy,
  },
  subtitle: {
    fontSize: typography.caption,
    color: colors.textSecondary,
    letterSpacing: 0.5,
  },
  settingsButton: {
    minHeight: MIN_TOUCH_SIZE,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    borderColor: colors.navy,
    justifyContent: 'center',
  },
  settingsLabel: {
    color: colors.navy,
    fontWeight: typography.weightSemibold,
    fontSize: typography.body,
  },
  pressed: { opacity: 0.7 },
});
