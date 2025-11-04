import React from 'react';
import { View, StyleSheet } from 'react-native';
import { theme } from '@theme/index';

const RestaurantScreen: React.FC = () => {
  const { colors } = theme;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Restaurant screen content */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default RestaurantScreen;