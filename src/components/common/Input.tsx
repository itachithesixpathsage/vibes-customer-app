import React, { useState, useRef } from 'react';
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TextInputProps,
  TouchableOpacity,
  GestureResponderEvent,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import { theme } from '@theme/index';
import { spacingUtils } from '@theme/spacing';

export interface InputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: string;
  rightIcon?: string;
  onRightIconPress?: (event: GestureResponderEvent) => void;
  variant?: 'outlined' | 'filled' | 'standard';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: true;
  style?: ViewStyle;
  inputStyle?: TextStyle;
  labelStyle?: TextStyle;
  errorStyle?: TextStyle;
  helperTextStyle?: TextStyle;
  testID?: string;
  secureTextEntry?: boolean;
  showPasswordToggle?: boolean;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  onRightIconPress,
  variant = 'outlined',
  size = 'medium',
  fullWidth = true,
  style,
  inputStyle,
  labelStyle,
  errorStyle,
  helperTextStyle,
  testID,
  secureTextEntry = false,
  showPasswordToggle = false,
  value,
  onChangeText,
  onFocus,
  onBlur,
  ...textInputProps
}) => {
  const { colors, typography, spacing, borderRadius } = theme;
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const inputRef = useRef<TextInput>(null);

  const handleFocus = (e: any) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const getInputContainerStyles = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: borderRadius.md,
      borderWidth: 1,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.md,
      backgroundColor: colors.background,
    };

    const sizeStyles = {
      small: {
        height: 36,
        paddingHorizontal: spacing.sm,
      },
      medium: {
        height: 44,
        paddingHorizontal: spacing.md,
      },
      large: {
        height: 52,
        paddingHorizontal: spacing.lg,
      },
    };

    const variantStyles = {
      outlined: {
        backgroundColor: colors.background,
        borderColor: error ? colors.error : isFocused ? colors.septenary : colors.surfaceDark,
        borderWidth: error ? 2 : 1,
      },
      filled: {
        backgroundColor: colors.surface,
        borderColor: error ? colors.error : isFocused ? colors.septenary : 'transparent',
        borderWidth: error ? 2 : 1,
      },
      standard: {
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        borderBottomWidth: error ? 2 : 1,
        borderBottomColor: error ? colors.error : isFocused ? colors.septenary : colors.surfaceDark,
        borderRadius: 0,
        paddingHorizontal: 0,
      },
    };

    return {
      ...baseStyle,
      ...sizeStyles[size],
      ...variantStyles[variant],
      width: fullWidth ? '100%' : undefined,
    };
  };

  const getInputStyles = (): TextStyle => {
    const baseStyle: TextStyle = {
      flex: 1,
      fontFamily: typography.fontFamily.regular,
      color: colors.text,
      fontSize: 16,
      paddingVertical: 0,
      marginVertical: 0,
    };

    const sizeStyles = {
      small: {
        fontSize: 14,
      },
      medium: {
        fontSize: 16,
      },
      large: {
        fontSize: 18,
      },
    };

    return {
      ...baseStyle,
      ...sizeStyles[size],
      ...inputStyle,
    };
  };

  const getLabelStyles = (): TextStyle => {
    return {
      ...typography.label,
      color: error ? colors.error : colors.textSecondary,
      marginBottom: spacing.xs,
      ...labelStyle,
    };
  };

  const getErrorStyles = (): TextStyle => {
    return {
      ...typography.body3,
      color: colors.error,
      marginTop: spacing.xs,
      ...errorStyle,
    };
  };

  const getHelperTextStyles = (): TextStyle => {
    return {
      ...typography.body3,
      color: colors.textTertiary,
      marginTop: spacing.xs,
      ...helperTextStyle,
    };
  };

  const getIconColor = (): string => {
    if (error) return colors.error;
    if (isFocused) return colors.septenary;
    return colors.textTertiary;
  };

  const getIconSize = (): number => {
    const iconSizes = {
      small: 16,
      medium: 20,
      large: 24,
    };
    return iconSizes[size];
  };

  const renderRightIcon = () => {
    if (secureTextEntry && showPasswordToggle) {
      return (
        <TouchableOpacity
          onPress={togglePasswordVisibility}
          style={spacingUtils.marginLeft(spacing.sm)}
          testID={`${testID}-password-toggle`}
        >
          <Icon
            name={showPassword ? 'eye-off' : 'eye'}
            size={getIconSize()}
            color={getIconColor()}
          />
        </TouchableOpacity>
      );
    }

    if (rightIcon) {
      const IconComponent = onRightIconPress ? TouchableOpacity : View;
      return (
        <IconComponent
          onPress={onRightIconPress}
          disabled={!onRightIconPress}
          style={spacingUtils.marginLeft(spacing.sm)}
          testID={`${testID}-right-icon`}
        >
          <Icon
            name={rightIcon}
            size={getIconSize()}
            color={getIconColor()}
          />
        </IconComponent>
      );
    }

    return null;
  };

  const renderLeftIcon = () => {
    if (leftIcon) {
      return (
        <Icon
          name={leftIcon}
          size={getIconSize()}
          color={getIconColor()}
          style={spacingUtils.marginRight(spacing.sm)}
        />
      );
    }
    return null;
  };

  return (
    <View style={style}>
      {label && (
        <Text style={getLabelStyles()} testID={`${testID}-label`}>
          {label}
        </Text>
      )}
      <View style={getInputContainerStyles()} testID={testID}>
        {renderLeftIcon()}
        <TextInput
          ref={inputRef}
          style={getInputStyles()}
          value={value}
          onChangeText={onChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          secureTextEntry={secureTextEntry && !showPassword}
          placeholderTextColor={colors.textTertiary}
          selectionColor={colors.septenary}
          underlineColorAndroid="transparent"
          {...textInputProps}
        />
        {renderRightIcon()}
      </View>
      {error && (
        <Text style={getErrorStyles()} testID={`${testID}-error`}>
          {error}
        </Text>
      )}
      {helperText && !error && (
        <Text style={getHelperTextStyles()} testID={`${testID}-helper`}>
          {helperText}
        </Text>
      )}
    </View>
  );
};

export default Input;