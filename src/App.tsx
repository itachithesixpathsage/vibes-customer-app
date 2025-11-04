import React, { useEffect } from 'react';
import { StatusBar, Platform, LogBox } from 'react-native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import { store, persistor } from '@store/index';
import { ThemeProvider } from '@theme/index';
import { initializeAuth } from '@store/slices/authSlice';
import AppNavigator from '@navigation/AppNavigator';

// Ignore specific warnings for now (will address in implementation)
LogBox.ignoreLogs([
  'VirtualizedLists should never be nested',
  'Each child in a list should have a unique "key" prop',
]);

const App: React.FC = () => {
  useEffect(() => {
    // Initialize auth state on app start
    store.dispatch(initializeAuth());

    // Configure status bar
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor('#1A0A1A', true);
    }
    StatusBar.setBarStyle('light-content', true);
    StatusBar.setHidden(false);
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider>
          <StatusBar
            barStyle="light-content"
            backgroundColor="#1A0A1A"
            translucent={false}
          />
          <AppNavigator />
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;