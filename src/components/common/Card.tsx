import React from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
  TouchableOpacity,
  GestureResponderEvent,
  TouchableOpacityProps,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { theme } from '@theme/index';
import { spacingUtils } from '@theme/spacing';

export interface CardProps extends TouchableOpacityProps {
  children: React.ReactNode;
  variant?: 'default' | 'outlined' | 'elevated' | 'gradient';
  size?: 'small' | 'medium' | 'large';
  padding?: number;
  margin?: number;
  borderRadius?: number;
  shadow?: boolean;
  onPress?: (event: GestureResponderEvent) => void;
  disabled?: boolean;
  style?: ViewStyle;
  contentStyle?: ViewStyle;
  testID?: string;
}

const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  size = 'medium',
  padding,
  margin,
  borderRadius,
  shadow = true,
  onPress,
  disabled = false,
  style,
  contentStyle,
  testID,
  ...touchableOpacityProps
}) => {
  const { colors, spacing, shadows } = theme;

  const getCardStyles = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: borderRadius || theme.borderRadius.md,
      overflow: 'hidden',
    };

    const sizeStyles = {
      small: {
        padding: padding || spacing.sm,
      },
      medium: {
        padding: padding || spacing.md,
      },
      large: {
        padding: padding || spacing.lg,
      },
    };

    const variantStyles = {
      default: {
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.surfaceDark,
      },
      outlined: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: colors.surfaceLight,
      },
      elevated: {
        backgroundColor: colors.surface,
        ...shadows.large,
      },
      gradient: {
        backgroundColor: 'transparent',
        borderWidth: 0,
      },
    };

    return {
      ...baseStyle,
      ...sizeStyles[size],
      ...variantStyles[variant],
      margin: margin || spacing.sm,
      opacity: disabled ? 0.5 : 1,
    };
  };

  const getContentStyles = (): ViewStyle => {
    return {
      flex: 1,
      ...contentStyle,
    };
  };

  const CardComponent = variant === 'gradient' ? LinearGradient : View;

  const cardProps = variant === 'gradient'
    ? {
        colors: colors.gradients.card,
        start: { x: 0, y: 0 },
        end: { x: 1, y: 1 },
      }
    : {};

  const cardContent = (
    <CardComponent
      style={getCardStyles()}
      {...cardProps}
    >
      <View style={getContentStyles()}>
        {children}
      </View>
    </CardComponent>
  );

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled}
        activeOpacity={0.8}
        style={[style, shadow && shadows.medium]}
        testID={testID}
        {...touchableOpacityProps}
      >
        {cardContent}
      </TouchableOpacity>
    );
  }

  return (
    <View style={[style, shadow && shadows.medium]} testID={testID}>
      {cardContent}
    </View>
  );
};

// Specialized card components
export const RestaurantCard: React.FC<Omit<CardProps, 'variant'>> = (props) => {
  return (
    <Card
      {...props}
      variant="elevated"
      size="medium"
      shadow={true}
    />
  );
};

export const MenuItemCard: React.FC<Omit<CardProps, 'variant'>> = (props) => {
  return (
    <Card
      {...props}
      variant="default"
      size="small"
      shadow={true}
    />
  );
};

export const ProfileCard: React.FC<Omit<CardProps, 'variant'>> = (props) => {
  return (
    <Card
      {...props}
      variant="gradient"
      size="large"
      shadow={true}
    />
  );
};

export const InfoCard: React.FC<Omit<CardProps, 'variant'>> = (props) => {
  return (
    <Card
      {...props}
      variant="outlined"
      size="medium"
      shadow={false}
    />
  );
};

export default Card;