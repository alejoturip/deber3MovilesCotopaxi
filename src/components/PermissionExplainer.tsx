import { Modal, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { colors, radius, spacing, typography } from '@/constants/theme';

interface PermissionExplainerProps {
  visible: boolean;
  onAccept: () => void;
  onDecline: () => void;
}

/** HU-004, escenario "Permiso de notificaciones": explica para qué se pide antes de solicitarlo. */
export function PermissionExplainer({ visible, onAccept, onDecline }: PermissionExplainerProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onDecline}>
      <View style={styles.backdrop}>
        <View style={styles.sheet} accessibilityViewIsModal>
          <Text style={styles.title}>Activa los avisos</Text>
          <Text style={styles.body}>
            Necesitamos permiso de notificaciones para avisarte cuando termine tu tiempo de estudio o de
            descanso, incluso con el celular bloqueado, en silencio o con la app cerrada.
          </Text>
          <Text style={styles.note}>No enviamos publicidad ni usamos internet.</Text>
          <Button label="Permitir avisos" onPress={onAccept} />
          <Button label="Ahora no" variant="ghost" onPress={onDecline} />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(22, 20, 95, 0.45)',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  sheet: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.md,
    borderTopWidth: 4,
    borderTopColor: colors.gold,
  },
  title: { fontSize: typography.title, fontWeight: typography.weightBold, color: colors.navy },
  body: { fontSize: typography.body, color: colors.text, lineHeight: 22 },
  note: { fontSize: typography.caption, color: colors.textSecondary },
});
