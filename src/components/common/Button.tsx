import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
  View,
  GestureResponderEvent,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';

import { theme } from '@theme/index';
import { spacingUtils } from '@theme/spacing';

export interface ButtonProps {
  title: string;
  onPress: (event: GestureResponderEvent) => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  icon?: string;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  testID?: string;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  style,
  textStyle,
  testID,
}) => {
  const { colors, typography, spacing, borderRadius, shadows } = theme;

  const getButtonStyles = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: borderRadius.md,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: fullWidth ? '100%' : 120,
      ...shadows.medium,
    };

    // Size styles
    const sizeStyles = {
      small: {
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        height: theme.button.height.sm,
        minHeight: theme.button.height.sm,
      },
      medium: {
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        height: theme.button.height.md,
        minHeight: theme.button.height.md,
      },
      large: {
        paddingHorizontal: spacing.xl,
        paddingVertical: spacing.lg,
        height: theme.button.height.lg,
        minHeight: theme.button.height.lg,
      },
    };

    // Variant styles
    const variantStyles = {
      primary: {
        backgroundColor: colors.septenary,
        borderWidth: 0,
      },
      secondary: {
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.septenary,
      },
      ghost: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: colors.septenary,
      },
      danger: {
        backgroundColor: colors.error,
        borderWidth: 0,
      },
      success: {
        backgroundColor: colors.success,
        borderWidth: 0,
      },
    };

    return {
      ...baseStyle,
      ...sizeStyles[size],
      ...variantStyles[variant],
      opacity: disabled ? 0.5 : 1,
    };
  };

  const getTextStyles = (): TextStyle => {
    const baseStyle: TextStyle = {
      fontFamily: typography.fontFamily.semiBold,
      textAlign: 'center',
    };

    const sizeStyles = {
      small: {
        fontSize: 14,
        lineHeight: 18,
      },
      medium: {
        fontSize: 16,
        lineHeight: 20,
      },
      large: {
        fontSize: 18,
        lineHeight: 22,
      },
    };

    const variantStyles = {
      primary: {
        color: colors.text,
      },
      secondary: {
        color: colors.septenary,
      },
      ghost: {
        color: colors.septenary,
      },
      danger: {
        color: colors.text,
      },
      success: {
        color: colors.text,
      },
    };

    return {
      ...baseStyle,
      ...sizeStyles[size],
      ...variantStyles[variant],
    };
  };

  const getIconColor = (): string => {
    const iconColors = {
      primary: colors.text,
      secondary: colors.septenary,
      ghost: colors.septenary,
      danger: colors.text,
      success: colors.text,
    };
    return iconColors[variant];
  };

  const getIconSize = (): number => {
    const iconSizes = {
      small: 16,
      medium: 20,
      large: 24,
    };
    return iconSizes[size];
  };

  const renderContent = () => {
    if (loading) {
      return (
        <ActivityIndicator
          size={size === 'small' ? 'small' : 'large'}
          color={getIconColor()}
          testID={`${testID}-loading`}
        />
      );
    }

    const iconComponent = icon ? (
      <Icon
        name={icon}
        size={getIconSize()}
        color={getIconColor()}
        style={iconPosition === 'left' ? spacingUtils.marginRight(8) : spacingUtils.marginLeft(8)}
      />
    ) : null;

    return (
      <>
        {iconPosition === 'left' && iconComponent}
        <Text
          style={[
            getButtonStyles(),
            getTextStyles(),
            icon && spacingUtils.marginHorizontal(4),
            textStyle,
          ]}
        >
          {title}
        </Text>
        {iconPosition === 'right' && iconComponent}
      </>
    );
  };

  const buttonContent = variant === 'primary' ? (
    <LinearGradient
      colors={colors.gradients.button}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={getButtonStyles()}
    >
      {renderContent()}
    </LinearGradient>
  ) : (
    <TouchableOpacity
      style={[getButtonStyles(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      testID={testID}
    >
      {renderContent()}
    </TouchableOpacity>
  );

  return buttonContent;
};

export default Button;