export * from './colors';
export * from './typography';
export * from './spacing';

import React from 'react';
import { ViewStyle, TextStyle } from 'react-native';
import { colors, shadows, commonStyles } from './colors';
import { typography, textVariants } from './typography';
import { spacing } from './spacing';

// Main theme object
export const theme = {
  colors,
  typography,
  spacing,
  shadows,
  textVariants,
  commonStyles,
};

// Theme context type
export interface ThemeContextType {
  theme: typeof theme;
  isDark: boolean;
  toggleTheme: () => void;
}

// Theme provider
export const ThemeContext = React.createContext<ThemeContextType | undefined>(undefined);

// Theme hook
export const useTheme = (): ThemeContextType => {
  const context = React.useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Theme provider component
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDark, setIsDark] = React.useState(true); // Always dark for this premium app

  const toggleTheme = React.useCallback(() => {
    setIsDark(!isDark);
  }, [isDark]);

  const value = React.useMemo(() => ({
    theme,
    isDark,
    toggleTheme,
  }), [theme, isDark, toggleTheme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// Utility function to create styles with theme
export const createThemedStyle = <T extends Record<string, ViewStyle | TextStyle>>(
  styleFn: (theme: typeof theme) => T
) => styleFn(theme);

// Default theme export
export default theme;