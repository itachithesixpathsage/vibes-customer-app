import React from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { theme } from '@theme/index';
import { spacingUtils } from '@theme/spacing';

interface LoadingStateProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  text?: string;
  fullScreen?: boolean;
  testID?: string;
}

export const LoadingSpinner: React.FC<LoadingStateProps> = ({
  size = 'medium',
  color,
  text,
  fullScreen = false,
  testID,
}) => {
  const { colors, spacing } = theme;

  const getSize = () => {
    const sizes = {
      small: 'small',
      medium: 'large',
      large: 60,
    };
    return sizes[size];
  };

  const getSpinnerColor = () => {
    return color || colors.septenary;
  };

  const containerStyle = fullScreen
    ? {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
      }
    : {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing.md,
      };

  return (
    <View style={[containerStyle]} testID={testID}>
      <ActivityIndicator
        size={getSize()}
        color={getSpinnerColor()}
        testID={`${testID}-spinner`}
      />
      {text && (
        <Text
          style={[
            theme.typography.body2,
            { color: colors.textSecondary, marginLeft: spacing.sm },
          ]}
          testID={`${testID}-text`}
        >
          {text}
        </Text>
      )}
    </View>
  );
};

interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: any;
  testID?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = 20,
  borderRadius = 4,
  style,
  testID,
}) => {
  const opacity = useSharedValue(0.3);

  React.useEffect(() => {
    opacity.value = withRepeat(
      withTiming(1, { duration: 1000 }),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor: theme.colors.surface,
        },
        animatedStyle,
        style,
      ]}
      testID={testID}
    />
  );
};

interface SkeletonCardProps {
  height?: number;
  testID?: string;
}

export const SkeletonCard: React.FC<SkeletonCardProps> = ({
  height = 120,
  testID,
}) => {
  const { colors, spacing, borderRadius } = theme;

  return (
    <View
      style={{
        backgroundColor: colors.surface,
        borderRadius: borderRadius.md,
        padding: spacing.md,
        margin: spacing.sm,
        height,
      }}
      testID={testID}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Skeleton width={60} height={60} borderRadius={30} />
        <View style={{ flex: 1, marginLeft: spacing.md }}>
          <Skeleton width="80%" height={16} style={{ marginBottom: spacing.xs }} />
          <Skeleton width="60%" height={12} />
        </View>
      </View>
    </View>
  );
};

interface SkeletonListProps {
  count?: number;
  itemHeight?: number;
  testID?: string;
}

export const SkeletonList: React.FC<SkeletonListProps> = ({
  count = 5,
  itemHeight = 80,
  testID,
}) => {
  return (
    <View testID={testID}>
      {Array.from({ length: count }, (_, index) => (
        <SkeletonCard key={index} testID={`${testID}-${index}`} />
      ))}
    </View>
  );
};

interface LoadingOverlayProps {
  visible: boolean;
  text?: string;
  transparent?: boolean;
  testID?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  visible,
  text = 'Loading...',
  transparent = false,
  testID,
}) => {
  const { colors } = theme;

  if (!visible) return null;

  return (
    <View
      style={[
        StyleSheet.absoluteFillObject,
        {
          backgroundColor: transparent
            ? 'rgba(26, 10, 26, 0.8)'
            : colors.background,
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
        },
      ]}
      testID={testID}
    >
      <LoadingSpinner size="large" text={text} testID={`${testID}-spinner`} />
    </View>
  );
};

interface PullToRefreshLoaderProps {
  refreshing: boolean;
  testID?: string;
}

export const PullToRefreshLoader: React.FC<PullToRefreshLoaderProps> = ({
  refreshing,
  testID,
}) => {
  const { colors, spacing } = theme;

  if (!refreshing) return null;

  return (
    <View
      style={{
        paddingVertical: spacing.lg,
        alignItems: 'center',
      }}
      testID={testID}
    >
      <ActivityIndicator
        size="small"
        color={colors.septenary}
        testID={`${testID}-activity`}
      />
    </View>
  );
};

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: string;
  action?: {
    label: string;
    onPress: () => void;
  };
  testID?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  action,
  testID,
}) => {
  const { colors, spacing } = theme;

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.xl,
      }}
      testID={testID}
    >
      {icon && (
        <Text
          style={{
            fontSize: 64,
            color: colors.textTertiary,
            marginBottom: spacing.lg,
          }}
        >
          {icon}
        </Text>
      )}
      <Text
        style={[
          theme.typography.h3,
          { color: colors.text, textAlign: 'center', marginBottom: spacing.sm },
        ]}
      >
        {title}
      </Text>
      {description && (
        <Text
          style={[
            theme.typography.body2,
            { color: colors.textSecondary, textAlign: 'center', marginBottom: spacing.lg },
          ]}
        >
          {description}
        </Text>
      )}
      {action && (
        <Button
          title={action.label}
          onPress={action.onPress}
          variant="primary"
          testID={`${testID}-action`}
        />
      )}
    </View>
  );
};

// Import Button for EmptyState
import Button from './Button';

export default {
  LoadingSpinner,
  Skeleton,
  SkeletonCard,
  SkeletonList,
  LoadingOverlay,
  PullToRefreshLoader,
  EmptyState,
};