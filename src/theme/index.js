import React, { createContext, useContext, useState, useEffect } from 'react';
import { Appearance } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightTheme, darkTheme } from './tokens';

// Create theme context
const ThemeContext = createContext();

// Theme storage key
const THEME_STORAGE_KEY = '@trakfit_theme';

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false);
  const [isSystemTheme, setIsSystemTheme] = useState(true);

  // Initialize theme from storage or system preference
  useEffect(() => {
    const initTheme = async () => {
      try {
        const storedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        
        if (storedTheme) {
          const themeData = JSON.parse(storedTheme);
          setIsDark(themeData.isDark);
          setIsSystemTheme(themeData.isSystemTheme);
        } else {
          // Use system preference by default
          const systemColorScheme = Appearance.getColorScheme();
          setIsDark(systemColorScheme === 'dark');
        }
      } catch (error) {
        console.warn('Failed to load theme from storage:', error);
        // Fallback to system theme
        const systemColorScheme = Appearance.getColorScheme();
        setIsDark(systemColorScheme === 'dark');
      }
    };

    initTheme();
  }, []);

  // Listen to system theme changes when using system theme
  useEffect(() => {
    if (!isSystemTheme) return;

    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setIsDark(colorScheme === 'dark');
    });

    return () => subscription?.remove();
  }, [isSystemTheme]);

  // Save theme preference to storage
  const saveThemePreference = async (isDarkMode, useSystemTheme) => {
    try {
      await AsyncStorage.setItem(
        THEME_STORAGE_KEY,
        JSON.stringify({
          isDark: isDarkMode,
          isSystemTheme: useSystemTheme
        })
      );
    } catch (error) {
      console.warn('Failed to save theme preference:', error);
    }
  };

  // Toggle between light and dark theme
  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    setIsSystemTheme(false);
    saveThemePreference(newIsDark, false);
  };

  // Set theme manually (light/dark)
  const setTheme = (themeName) => {
    const newIsDark = themeName === 'dark';
    setIsDark(newIsDark);
    setIsSystemTheme(false);
    saveThemePreference(newIsDark, false);
  };

  // Use system theme
  const useSystemTheme = () => {
    const systemColorScheme = Appearance.getColorScheme();
    const newIsDark = systemColorScheme === 'dark';
    setIsDark(newIsDark);
    setIsSystemTheme(true);
    saveThemePreference(newIsDark, true);
  };

  // Get current theme object
  const theme = isDark ? darkTheme : lightTheme;

  const value = {
    theme,
    isDark,
    isSystemTheme,
    toggleTheme,
    setTheme,
    useSystemTheme,
    
    // Helper functions
    colors: theme.colors,
    spacing: theme.spacing,
    radii: theme.radii,
    fontSizes: theme.fontSizes,
    fontWeights: theme.fontWeights,
    lineHeights: theme.lineHeights,
    shadows: theme.shadows
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook to use theme in components
export const useTheme = () => {
  const context = useContext(ThemeContext);
  
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
};

// Helper hook for styled components
export const useThemedStyles = (stylesFn) => {
  const theme = useTheme();
  return stylesFn(theme);
};
