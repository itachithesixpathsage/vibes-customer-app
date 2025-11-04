import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';

// Import screens
import SplashScreen from '@screens/SplashScreen';
import HomeScreen from '@screens/HomeScreen';
import SearchScreen from '@screens/SearchScreen';
import RestaurantScreen from '@screens/RestaurantScreen';
import MealDetailScreen from '@screens/MealDetailScreen';
import CartScreen from '@screens/CartScreen';
import CheckoutScreen from '@screens/CheckoutScreen';
import OrderTrackingScreen from '@screens/OrderTrackingScreen';
import ProfileScreen from '@screens/ProfileScreen';
import LoginScreen from '@screens/auth/LoginScreen';
import RegisterScreen from '@screens/auth/RegisterScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const MainTabs = () => {
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
        name="Profile"
        component={ProfileScreen}
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  );
};

const SimpleNavigator: React.FC = () => {
  // Mock authentication state - set to false to see login flow
  const isAuthenticated = true;

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          gestureEnabled: true,
        }}
      >
        {isAuthenticated ? (
          <>
            <Stack.Screen name="Main" component={MainTabs} />
            <Stack.Screen
              name="Restaurant"
              component={RestaurantScreen}
              options={{
                headerShown: true,
                title: 'Restaurant',
                headerStyle: {
                  backgroundColor: '#2D1A3A',
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
                  backgroundColor: '#2D1A3A',
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
              name="Checkout"
              component={CheckoutScreen}
              options={{
                headerShown: true,
                title: 'Checkout',
                headerStyle: {
                  backgroundColor: '#2D1A3A',
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
                  backgroundColor: '#2D1A3A',
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
          </>
        ) : (
          <>
            <Stack.Screen name="Splash" component={SplashScreen} />
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
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default SimpleNavigator;