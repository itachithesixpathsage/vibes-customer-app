import React from 'react';
import { View, StyleSheet } from 'react-native';

import { theme } from '@theme/index';

const OnboardingScreen: React.FC = () => {
  const { colors } = theme;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Onboarding content will be implemented in next phase */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default OnboardingScreen;