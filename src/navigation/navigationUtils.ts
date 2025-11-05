import { NavigationProp } from '@react-navigation/native';
import { RootStackParamList, MainTabParamList } from '@types/navigation';

// Navigation utility functions
export const navigationUtils = {
  // Check if user can navigate to a specific screen
  canNavigateTo: (
    navigation: NavigationProp<RootStackParamList>,
    screenName: keyof RootStackParamList,
    params?: any
  ): boolean => {
    try {
      // Check if the screen exists in the navigator
      const state = navigation.getState();
      const screenExists = state.routes.some(route => route.name === screenName);

      return screenExists;
    } catch (error) {
      console.warn('Navigation check failed:', error);
      return false;
    }
  },

  // Safe navigation with error handling
  safeNavigate: (
    navigation: NavigationProp<RootStackParamList>,
    screenName: keyof RootStackParamList,
    params?: any
  ): void => {
    try {
      if (navigationUtils.canNavigateTo(navigation, screenName, params)) {
        navigation.navigate(screenName, params);
      } else {
        console.warn(`Cannot navigate to screen: ${screenName}`);
      }
    } catch (error) {
      console.error('Navigation error:', error);
    }
  },

  // Go back with safe handling
  safeGoBack: (navigation: NavigationProp<RootStackParamList>): void => {
    try {
      if (navigation.canGoBack()) {
        navigation.goBack();
      }
    } catch (error) {
      console.error('Go back error:', error);
    }
  },

  // Reset navigation stack to specific screen
  resetToScreen: (
    navigation: NavigationProp<RootStackParamList>,
    screenName: keyof RootStackParamList,
    params?: any
  ): void => {
    try {
      navigation.reset({
        index: 0,
        routes: [{ name: screenName, params }],
      });
    } catch (error) {
      console.error('Reset navigation error:', error);
    }
  },

  // Replace current screen
  replaceScreen: (
    navigation: NavigationProp<RootStackParamList>,
    screenName: keyof RootStackParamList,
    params?: any
  ): void => {
    try {
      navigation.replace(screenName, params);
    } catch (error) {
      console.error('Replace screen error:', error);
    }
  },

  // Push screen onto stack
  pushScreen: (
    navigation: NavigationProp<RootStackParamList>,
    screenName: keyof RootStackParamList,
    params?: any
  ): void => {
    try {
      if ('push' in navigation) {
        navigation.push(screenName, params);
      } else {
        navigationUtils.safeNavigate(navigation, screenName, params);
      }
    } catch (error) {
      console.error('Push screen error:', error);
    }
  },

  // Get current route name
  getCurrentRouteName: (navigation: NavigationProp<RootStackParamList>): string | null => {
    try {
      const state = navigation.getState();
      const currentRoute = state.routes[state.index];
      return currentRoute.name || null;
    } catch (error) {
      console.error('Get current route error:', error);
      return null;
    }
  },

  // Check if we're at the root of the navigation stack
  isAtRoot: (navigation: NavigationProp<RootStackParamList>): boolean => {
    try {
      const state = navigation.getState();
      return state.routes.length === 1;
    } catch (error) {
      console.error('Check if at root error:', error);
      return false;
    }
  },

  // Deep linking helpers
  createDeepLink: (screenName: keyof RootStackParamList, params?: any): string => {
    try {
      const baseUrl = 'perseus://';
      let path = screenName.toString();

      if (params) {
        const queryString = Object.entries(params)
          .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
          .join('&');
        path += `?${queryString}`;
      }

      return `${baseUrl}${path}`;
    } catch (error) {
      console.error('Create deep link error:', error);
      return '';
    }
  },

  parseDeepLink: (url: string): { screen: keyof RootStackParamList; params?: any } | null => {
    try {
      const baseUrl = 'perseus://';
      if (!url.startsWith(baseUrl)) {
        return null;
      }

      const pathWithQuery = url.substring(baseUrl.length);
      const [path, queryString] = pathWithQuery.split('?');

      const screen = path as keyof RootStackParamList;

      let params;
      if (queryString) {
        params = {};
        const pairs = queryString.split('&');
        pairs.forEach(pair => {
          const [key, value] = pair.split('=');
          params[decodeURIComponent(key)] = decodeURIComponent(value || '');
        });
      }

      return { screen, params };
    } catch (error) {
      console.error('Parse deep link error:', error);
      return null;
    }
  },

  // Tab navigation utils
  switchToTab: (
    navigation: NavigationProp<MainTabParamList>,
    tabName: keyof MainTabParamList
  ): void => {
    try {
      navigation.navigate(tabName);
    } catch (error) {
      console.error('Switch tab error:', error);
    }
  },

  // Modal navigation
  showModal: (
    navigation: NavigationProp<RootStackParamList>,
    screenName: keyof RootStackParamList,
    params?: any
  ): void => {
    try {
      navigation.navigate(screenName, {
        ...params,
        isModal: true,
      });
    } catch (error) {
      console.error('Show modal error:', error);
    }
  },

  // Dismiss modal
  dismissModal: (navigation: NavigationProp<RootStackParamList>): void => {
    try {
      navigationUtils.safeGoBack(navigation);
    } catch (error) {
      console.error('Dismiss modal error:', error);
    }
  },
};

// Navigation guards
export const navigationGuards = {
  // Auth guard - requires authentication
  requireAuth: (isAuthenticated: boolean): boolean => {
    return isAuthenticated;
  },

  // Guest guard - requires no authentication
  requireGuest: (isAuthenticated: boolean): boolean => {
    return !isAuthenticated;
  },

  // Permission guard - check specific permissions
  requirePermission: (userPermissions: string[], requiredPermissions: string[]): boolean => {
    return requiredPermissions.every(permission => userPermissions.includes(permission));
  },

  // Role guard - check user role
  requireRole: (userRole: string, requiredRoles: string[]): boolean => {
    return requiredRoles.includes(userRole);
  },
};

// Navigation metrics
export const navigationMetrics = {
  // Track screen view
  trackScreenView: (screenName: string, params?: any): void => {
    // Integrate with analytics service
    console.log('Screen view:', screenName, params);
  },

  // Track user flow
  trackUserFlow: (fromScreen: string, toScreen: string): void => {
    // Integrate with analytics service
    console.log('User flow:', `${fromScreen} -> ${toScreen}`);
  },

  // Track navigation performance
  trackNavigationPerformance: (screenName: string, loadTime: number): void => {
    // Integrate with performance monitoring
    console.log('Navigation performance:', screenName, loadTime);
  },
};

export default navigationUtils;