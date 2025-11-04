import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';

import { initializeAuth } from '@store/slices/authSlice';
import { theme } from '@theme/index';

const SplashScreen: React.FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Initialize auth state
    dispatch(initializeAuth());
  }, [dispatch]);

  const { colors, spacing } = theme;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Splash screen content will be implemented in next phase */}
      <View style={styles.placeholder} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholder: {
    width: 100,
    height: 100,
    backgroundColor: '#666',
    borderRadius: 20,
  },
});

export default SplashScreen;