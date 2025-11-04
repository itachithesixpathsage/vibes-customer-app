import React from 'react';
import { View, StyleSheet } from 'react-native';
import { theme } from '@theme/index';

const OrderHistoryScreen: React.FC = () => {
  const { colors } = theme;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Order history screen content */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default OrderHistoryScreen;