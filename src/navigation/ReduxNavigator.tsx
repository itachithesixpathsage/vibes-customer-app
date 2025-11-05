import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import { store, persistor } from '../store';
import { useAuth } from '../hooks/useAuth';
import { useSelector } from 'react-redux';

// Import screens
import SplashScreen from '../screens/SplashScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';
import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import RestaurantScreen from '../screens/RestaurantScreen';
import MealDetailScreen from '../screens/MealDetailScreen';
import CartScreen from '../screens/CartScreen';
import CheckoutScreen from '../screens/CheckoutScreen';
import OrderTrackingScreen from '../screens/OrderTrackingScreen';
import OrderHistoryScreen from '../screens/OrderHistoryScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const MainTabs = () => {
  const { items: cartItems } = useAuth((state: any) => state.cart);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string;

          switch (route.name) {
            case 'Home':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'Search':
              iconName = focused ? 'search' : 'search-outline';
              break;
            case 'Cart':
              iconName = focused ? 'cart' : 'cart-outline';
              break;
            case 'Orders':
              iconName = focused ? 'receipt' : 'receipt-outline';
              break;
            case 'Profile':
              iconName = focused ? 'person' : 'person-outline';
              break;
            default:
              iconName = 'help-outline';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#854798',
        tabBarInactiveTintColor: 'rgba(255,255,255,0.6)',
        tabBarStyle: {
          backgroundColor: '#2D1A3A',
          borderTopColor: 'rgba(255,255,255,0.1)',
          borderTopWidth: 1,
        },
        headerShown: false,
        tabBarBadge: route.name === 'Cart' && items.length > 0 ? `${items.reduce((sum, item) => sum + item.quantity, 0)}` : undefined,
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'Home' }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{ title: 'Search' }}
      />
      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{ title: 'Cart' }}
      />
      <Tab.Screen
        name="Orders"
        component={OrderHistoryScreen}
        options={{ title: 'Orders' }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  );
};

const ReduxNavigator: React.FC = () => {
  const { isAuthenticated, isInitialized, user } = useAuth();

  useEffect(() => {
    // Initialize user preferences if needed
    if (user && !user.preferences) {
      // Set default preferences
      store.dispatch({
        type: 'user/setPreferences',
        payload: {
          notifications: {
            push: true,
            email: false,
            sms: false,
            orderUpdates: true,
            promotions: true,
          },
          dietary: {
            vegetarian: false,
            vegan: false,
            glutenFree: false,
            halal: false,
            kosher: false,
          },
          language: 'en',
          currency: 'USD',
        },
      });
    }
  }, [user]);

  return (
    <Provider store={store}>
      <PersistGate loading={null}>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
              gestureEnabled: true,
            }}
          >
            {!isInitialized ? (
              <Stack.Screen name="Splash" component={SplashScreen} />
            ) : !isAuthenticated ? (
              <>
                <Stack.Screen name="Onboarding" component={OnboardingScreen} />
                <Stack.Screen
                  name="Login"
                  component={LoginScreen}
                  options={{ presentation: 'modal' }}
                />
                <Stack.Screen
                  name="Register"
                  component={RegisterScreen}
                  options={{ presentation: 'modal' }}
                />
                <Stack.Screen
                  name="ForgotPassword"
                  component={ForgotPasswordScreen}
                  options={{ presentation: 'modal' }}
                />
              </>
            ) : (
              <>
                <Stack.Screen name="Main" component={MainTabs} />
                <Stack.Screen
                  name="Restaurant"
                  component={RestaurantScreen}
                  options={{
                    headerShown: true,
                    title: 'Restaurant',
                    headerStyle: {
                      backgroundColor: '#1A0A1A',
                      shadowColor: 'transparent',
                      elevation: 0,
                    },
                    headerTintColor: '#FFFFFF',
                    headerTitleStyle: {
                      fontFamily: 'SFProDisplay-Semibold',
                      fontSize: 18,
                    },
                    presentation: 'modal',
                  }}
                />
                <Stack.Screen
                  name="MealDetail"
                  component={MealDetailScreen}
                  options={{
                    headerShown: true,
                    title: 'Menu Item',
                    headerStyle: {
                      backgroundColor: '#1A0A1A',
                      shadowColor: 'transparent',
                      elevation: 0,
                    },
                    headerTintColor: '#FFFFFF',
                    headerTitleStyle: {
                      fontFamily: 'SFProDisplay-Semibold',
                      fontSize: 18,
                    },
                    presentation: 'modal',
                  }}
                />
                <Stack.Screen
                  name="Cart"
                  component={CartScreen}
                  options={{
                    headerShown: true,
                    title: 'Cart',
                    headerStyle: {
                      backgroundColor: '#1A0A1A',
                      shadowColor: 'transparent',
                      elevation: 0,
                    },
                    headerTintColor: '#FFFFFF',
                    headerTitleStyle: {
                      fontFamily: 'SFProDisplay-Semibold',
                      fontSize: 18,
                    },
                  }}
                />
                <Stack.Screen
                  name="Checkout"
                  component={CheckoutScreen}
                  options={{
                    headerShown: true,
                    title: 'Checkout',
                    headerStyle: {
                      backgroundColor: '#1A0A1A',
                      shadowColor: 'transparent',
                      elevation: 0,
                    },
                    headerTintColor: '#FFFFFF',
                    headerTitleStyle: {
                      fontFamily: 'SFProDisplay-Semibold',
                      fontSize: 18,
                    },
                    presentation: 'modal',
                  }}
                />
                <Stack.Screen
                  name="OrderTracking"
                  component={OrderTrackingScreen}
                  options={{
                    headerShown: true,
                    title: 'Track Order',
                    headerStyle: {
                      backgroundColor: '#1A0A1A',
                      shadowColor: 'transparent',
                      elevation: 0,
                    },
                    headerTintColor: '#FFFFFF',
                    headerTitleStyle: {
                      fontFamily: 'SFProDisplay-Semibold',
                      fontSize: 18,
                    },
                    presentation: 'modal',
                  }}
                />
                <Stack.Screen
                  name="Profile"
                  component={ProfileScreen}
                  options={{
                    headerShown: true,
                    title: 'Profile',
                    headerStyle: {
                      backgroundColor: '#1A0A1A',
                      shadowColor: 'transparent',
                      elevation: 0,
                    },
                    headerTintColor: '#FFFFFF',
                    headerTitleStyle: {
                      fontFamily: 'SFProDisplay-Semibold',
                      fontSize: 18,
                    },
                  }}
                />
              </>
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
};

export default ReduxNavigator;