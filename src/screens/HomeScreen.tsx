import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

import { theme } from '@theme/index';

const HomeScreen: React.FC = () => {
  const { colors } = theme;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>
        Project Perseus
      </Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        Premium Food Delivery
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
  },
});

export default HomeScreen;