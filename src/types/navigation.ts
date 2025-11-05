export type RootStackParamList = {
  // Auth screens
  Splash: undefined;
  Onboarding: undefined;
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;

  // Main app screens
  Main: undefined;
  Home: undefined;
  Search: { query?: string; filters?: any };
  Restaurant: { restaurantId: string };
  Cart: undefined;
  Checkout: { restaurantId?: string };
  OrderTracking: { orderId: string };
  Profile: undefined;
  OrderHistory: undefined;
  Favorites: undefined;
  Settings: undefined;

  // Modals
  ItemDetails: { itemId: string; restaurantId: string };
  Customization: { itemId: string; restaurantId: string };
  AddressForm: { addressId?: string };
  PaymentMethod: { methodId?: string };
  ReviewForm: { orderId: string; itemId?: string };
  FilterScreen: { initialFilters?: any };
  Help: { topic?: string };
};

export type MainTabParamList = {
  Home: undefined;
  Search: undefined;
  Cart: undefined;
  Orders: undefined;
  Profile: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

export type NavigationProp<T extends keyof RootStackParamList> =
  import('@react-navigation/stack').StackNavigationProp<RootStackParamList, T>;

export type MainTabNavigationProp<T extends keyof MainTabParamList> =
  import('@react-navigation/bottom-tabs').BottomTabNavigationProp<MainTabParamList, T>;

export type AuthNavigationProp<T extends keyof AuthStackParamList> =
  import('@react-navigation/stack').StackNavigationProp<AuthStackParamList, T>;

export type RouteProp<T extends keyof RootStackParamList> =
  import('@react-navigation/stack').RouteProp<RootStackParamList, T>;

export type MainTabRouteProp<T extends keyof MainTabParamList> =
  import('@react-navigation/bottom-tabs').RouteProp<MainTabParamList, T>;

export type AuthRouteProp<T extends keyof AuthStackParamList> =
  import('@react-navigation/stack').RouteProp<AuthStackParamList, T>;

// Screen options
export interface ScreenOptions {
  title?: string;
  headerShown?: boolean;
  headerLeft?: React.ReactNode;
  headerRight?: React.ReactNode;
  headerStyle?: any;
  headerTitleStyle?: any;
  headerTintColor?: string;
  headerBackTitleVisible?: boolean;
  gestureEnabled?: boolean;
  animationTypeForReplace?: string;
}

export interface TabOptions {
  tabBarLabel?: string;
  tabBarIcon?: ({ focused, color, size }: any) => React.ReactNode;
  tabBarButton?: (props: any) => React.ReactNode;
  tabBarAccessibilityLabel?: string;
  tabBarTestID?: string;
}

// Navigation state
export interface NavigationState {
  currentScreen: string;
  previousScreen?: string;
  isModalOpen: boolean;
  modalScreen?: string;
  stackHistory: string[];
}

// Deep linking configuration
export interface DeepLinkingConfig {
  prefixes: string[];
  config: {
    screens: {
      [key: string]: string | {
        path: string;
        parse?: (params: any) => any;
        stringify?: (params: any) => string;
      };
    };
  };
}

// Navigation guards
export interface NavigationGuard {
  canNavigate: (from: string, to: string, params?: any) => boolean;
  onDenied?: (from: string, to: string, params?: any) => void;
}

// Route permissions
export interface RoutePermissions {
  [key: string]: {
    requiresAuth?: boolean;
    roles?: string[];
    permissions?: string[];
  };
}

export interface NavigationMetrics {
  screenViews: {
    [screenName: string]: {
      count: number;
      totalTime: number;
      averageTime: number;
      lastVisited: string;
    };
  };
  userFlow: string[];
  dropOffPoints: {
    screen: string;
    count: number;
    percentage: number;
  }[];
}