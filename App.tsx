import React, { useEffect } from 'react';
import { StatusBar, LogBox } from 'react-native';
import { Provider } from 'react-redux';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// Import our simplified navigation
import SimpleNavigator from './src/navigation/SimpleNavigator';

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
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#1A0A1A"
        translucent={false}
        hidden={false}
        networkActivityIndicatorVisible={true}
      />
      <SimpleNavigator />
    </GestureHandlerRootView>
  );
};

export default App;