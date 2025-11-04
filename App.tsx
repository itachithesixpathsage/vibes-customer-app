import React, { useEffect } from 'react';
import { StatusBar, LogBox } from 'react-native';
import { Provider } from 'react-redux';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { store } from './src/store/index';
import { theme } from '@theme/index';
import AppNavigator from './src/navigation/AppNavigator';

const App: React.FC = () => {
  useEffect(() => {
    // Log initialization errors in development
    if (__DEV__) {
      LogBox.ignoreAllLogs(['VirtualizedLists should not be mounted inside the ScrollView']);
      LogBox.ignoreAllLogs(['Warning: Each child in a list should have a unique "key" prop']);
    }
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <StatusBar
          barStyle={theme.statusBarStyle}
          backgroundColor={theme.colors.background}
          translucent={false}
          hidden={false}
          networkActivityIndicatorVisible={true}
        />
        <AppNavigator />
      </Provider>
    </GestureHandlerRootView>
  );
};

export default App;