/**
 * Tokens visuales de la Academia Cotopaxi (ver .github/skills/cotopaxi-school/SKILL.md).
 * Azul y dorado medidos directamente sobre el logotipo original (assets/images/logo-cotopaxi.png).
 */
export const colors = {
  navy: '#16145F', // azul institucional (texto "COTOPAXI" y montaña)
  navySoft: '#292879', // azul complementario
  navyMuted: '#8A89AF', // azul atenuado del logo, para pistas y bordes
  gold: '#D1A417', // dorado de los rayos del sol
  goldLight: '#F5D76E',
  goldSoft: '#FBF3D6', // fondo suave para avisos dorados
  white: '#FFFFFF',
  background: '#F5F6FA',
  border: '#E3E4EE',
  text: '#16145F',
  textSecondary: '#606575',
  danger: '#B3261E',
  dangerSoft: '#FCE8E6',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const radius = {
  sm: 8,
  md: 14,
  lg: 20,
  pill: 999,
} as const;

export const typography = {
  timer: 64,
  title: 22,
  subtitle: 17,
  body: 15,
  caption: 13,
  weightRegular: '400',
  weightSemibold: '600',
  weightBold: '700',
} as const;

/** Altura mínima táctil recomendada para botones (accesibilidad). */
export const MIN_TOUCH_SIZE = 48;
