import React, { useEffect } from 'react';
import { StatusBar, LogBox } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider } from 'react-redux';

// Import Redux store and navigation
import { store } from './src/store';
import ReduxNavigator from './src/navigation/ReduxNavigator';

const App: React.FC = () => {
  useEffect(() => {
    // Log initialization errors in development
    if (__DEV__) {
      LogBox.ignoreAllLogs(['VirtualizedLists should not be mounted inside the ScrollView']);
      LogBox.ignoreAllLogs(['Warning: Each child in a list should have a unique "key" prop']);
    }
  }, []);

  return (
    <Provider store={store}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor="#1A0A1A"
          translucent={false}
          hidden={false}
          networkActivityIndicatorVisible={true}
        />
        <ReduxNavigator />
      </GestureHandlerRootView>
    </Provider>
  );
};

export default App;