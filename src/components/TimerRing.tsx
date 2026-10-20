import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

import { colors, typography } from '@/constants/theme';
import type { Phase } from '@/domain/models/pomodoro';
import { formatRemaining } from '@/domain/rules/time';

interface TimerRingProps {
  remainingMs: number;
  progress: number;
  phase: Phase;
  size?: number;
}

const STROKE = 14;

/**
 * HU-001: muestra minutos y segundos restantes.
 * El anillo se llena como el sol naciente del logotipo: azul en estudio, dorado en descanso.
 */
export function TimerRing({ remainingMs, progress, phase, size = 280 }: TimerRingProps) {
  const r = (size - STROKE) / 2;
  const circumference = 2 * Math.PI * r;
  const ringColor = phase === 'study' ? colors.navy : colors.gold;
  const time = formatRemaining(remainingMs);

  return (
    <View
      style={{ width: size, height: size }}
      accessible
      accessibilityRole="timer"
      accessibilityLabel={`Tiempo restante ${time}`}
    >
      <Svg width={size} height={size}>
        <Circle cx={size / 2} cy={size / 2} r={r} stroke={colors.border} strokeWidth={STROKE} fill={colors.white} />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={ringColor}
          strokeWidth={STROKE}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={circumference * (1 - progress)}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <View style={styles.center} pointerEvents="none">
        <Text style={styles.time}>{time}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  time: {
    fontSize: typography.timer,
    fontWeight: typography.weightBold,
    color: colors.navy,
    fontVariant: ['tabular-nums'],
  },
});
