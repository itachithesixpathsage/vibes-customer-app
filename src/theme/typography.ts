import { TextStyle } from 'react-native';
import { colors } from './colors';

export const typography = {
  // Font families
  fontFamily: {
    bold: 'SFProDisplay-Bold',
    semiBold: 'SFProDisplay-Semibold',
    medium: 'SFProDisplay-Medium',
    regular: 'SFProDisplay-Regular',
    light: 'SFProDisplay-Light',
  },

  // Font sizes and weights
  h1: {
    fontSize: 32,
    fontWeight: '700' as const,
    fontFamily: 'SFProDisplay-Bold',
    lineHeight: 40,
    color: colors.text,
  } as TextStyle,

  h2: {
    fontSize: 24,
    fontWeight: '600' as const,
    fontFamily: 'SFProDisplay-Semibold',
    lineHeight: 32,
    color: colors.text,
  } as TextStyle,

  h3: {
    fontSize: 20,
    fontWeight: '600' as const,
    fontFamily: 'SFProDisplay-Semibold',
    lineHeight: 28,
    color: colors.text,
  } as TextStyle,

  h4: {
    fontSize: 18,
    fontWeight: '600' as const,
    fontFamily: 'SFProDisplay-Semibold',
    lineHeight: 24,
    color: colors.text,
  } as TextStyle,

  body1: {
    fontSize: 16,
    fontWeight: '400' as const,
    fontFamily: 'SFProDisplay-Regular',
    lineHeight: 24,
    color: colors.text,
  } as TextStyle,

  body2: {
    fontSize: 14,
    fontWeight: '400' as const,
    fontFamily: 'SFProDisplay-Regular',
    lineHeight: 20,
    color: colors.text,
  } as TextStyle,

  body3: {
    fontSize: 12,
    fontWeight: '400' as const,
    fontFamily: 'SFProDisplay-Regular',
    lineHeight: 16,
    color: colors.text,
  } as TextStyle,

  caption: {
    fontSize: 12,
    fontWeight: '400' as const,
    fontFamily: 'SFProDisplay-Regular',
    lineHeight: 16,
    color: colors.textSecondary,
  } as TextStyle,

  small: {
    fontSize: 10,
    fontWeight: '400' as const,
    fontFamily: 'SFProDisplay-Regular',
    lineHeight: 14,
    color: colors.textTertiary,
  } as TextStyle,

  button: {
    fontSize: 16,
    fontWeight: '600' as const,
    fontFamily: 'SFProDisplay-Semibold',
    lineHeight: 20,
    color: colors.text,
  } as TextStyle,

  label: {
    fontSize: 14,
    fontWeight: '500' as const,
    fontFamily: 'SFProDisplay-Medium',
    lineHeight: 18,
    color: colors.textSecondary,
  } as TextStyle,
};

// Text style variants
export const textVariants = {
  // Primary text styles
  heading: typography.h1,
  subheading: typography.h2,
  title: typography.h3,
  subtitle: typography.h4,
  body: typography.body1,
  bodySmall: typography.body2,
  caption: typography.caption,

  // Colored variants
  headingSecondary: {
    ...typography.h1,
    color: colors.textSecondary,
  },

  bodySecondary: {
    ...typography.body1,
    color: colors.textSecondary,
  },

  bodyTertiary: {
    ...typography.body2,
    color: colors.textTertiary,
  },

  // Status text styles
  errorText: {
    ...typography.body3,
    color: colors.error,
  },

  successText: {
    ...typography.body3,
    color: colors.success,
  },

  warningText: {
    ...typography.body3,
    color: colors.warning,
  },

  infoText: {
    ...typography.body3,
    color: colors.info,
  },

  // Interactive text styles
  link: {
    ...typography.body2,
    color: colors.septenary,
    textDecorationLine: 'underline',
  },

  buttonText: {
    ...typography.button,
    color: colors.text,
  },

  buttonTextSecondary: {
    ...typography.button,
    color: colors.textSecondary,
  },
};

// Font weight utilities
export const fontWeights = {
  thin: '100' as const,
  light: '300' as const,
  normal: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  extrabold: '800' as const,
  black: '900' as const,
};

// Letter spacing values
export const letterSpacing = {
  tight: -0.5,
  normal: 0,
  wide: 0.5,
  wider: 1,
  widest: 2,
};

export type TypographyKeys = keyof typeof typography;
export type TextVariantKeys = keyof typeof textVariants;