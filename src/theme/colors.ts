import { TextStyle, ViewStyle } from 'react-native';

export const colors = {
  // Primary gradient colors
  primary: '#42033D',
  secondary: '#550944',
  tertiary: '#680E4B',
  quaternary: '#72196C',
  quinary: '#7C238C',
  senary: '#813592',
  septenary: '#854798',
  octonary: '#815D9C',
  nonary: '#7C72A0',

  // Supporting colors
  background: '#1A0A1A',
  surface: 'rgba(255,255,255,0.1)',
  surfaceLight: 'rgba(255,255,255,0.15)',
  surfaceDark: 'rgba(0,0,0,0.2)',

  // Text colors
  text: '#FFFFFF',
  textSecondary: 'rgba(255,255,255,0.7)',
  textTertiary: 'rgba(255,255,255,0.5)',
  textInverse: '#1A0A1A',

  // Status colors
  success: '#4CAF50',
  successLight: '#81C784',
  warning: '#FF9800',
  warningLight: '#FFB74D',
  error: '#F44336',
  errorLight: '#E57373',
  info: '#2196F3',
  infoLight: '#64B5F6',

  // Brand colors
  accent: '#FF6B6B',
  accentLight: '#FF8787',
  accentDark: '#FF5252',

  // Neutral colors
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',

  // Gradients
  gradients: {
    primary: ['#42033D', '#854798'],
    secondary: ['#550944', '#815D9C'],
    tertiary: ['#680E4B', '#7C72A0'],
    hero: ['#680E4B', '#7C238C', '#854798'],
    card: ['rgba(255,255,255,0.05)', 'rgba(255,255,255,0.1)'],
    button: ['#7C238C', '#813592'],
    success: ['#4CAF50', '#81C784'],
    error: ['#F44336', '#E57373'],
  }
};

// Shadow definitions
export const shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  glow: {
    shadowColor: colors.septenary,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 12,
  }
};

// Common styles
export const commonStyles = {
  container: {
    flex: 1,
    backgroundColor: colors.background,
  } as ViewStyle,

  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    ...shadows.medium,
  } as ViewStyle,

  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  } as ViewStyle,

  row: {
    flexDirection: 'row',
    alignItems: 'center',
  } as ViewStyle,

  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  } as ViewStyle,

  textCenter: {
    textAlign: 'center',
  } as TextStyle,
};

export type ColorKeys = keyof typeof colors;
export type GradientKeys = keyof typeof colors.gradients;