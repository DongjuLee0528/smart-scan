/**
 * @fileoverview Custom React hook for theme management
 *
 * This hook provides complete theme management functionality for the Smart Scan app,
 * including theme persistence, system theme detection, and manual theme switching.
 * Integrates with React Native's color scheme detection and AsyncStorage for persistence.
 */

import { useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, ColorScheme, ThemeColors } from '../theme/colors';

/** Storage key for persisting user theme preference */
const THEME_STORAGE_KEY = 'user_theme_preference';

/**
 * Custom hook for managing application theme state
 *
 * Provides theme switching functionality with the following features:
 * - Automatic system theme detection
 * - User preference persistence
 * - Manual theme toggling
 * - Loading state management
 * - Fallback to light theme on errors
 *
 * @returns {Object} Theme management utilities and current theme state
 * @returns {ColorScheme} returns.colorScheme - Current active color scheme
 * @returns {ThemeColors} returns.colors - Current theme colors
 * @returns {string} returns.brandColor - Brand color constant
 * @returns {Function} returns.toggleTheme - Function to toggle between light/dark
 * @returns {Function} returns.resetToSystem - Function to reset to system preference
 * @returns {boolean} returns.isLoading - Whether theme is still loading
 *
 * @example
 * const { colors, colorScheme, toggleTheme, isLoading } = useTheme();
 *
 * if (isLoading) {
 *   return <LoadingScreen />;
 * }
 *
 * return (
 *   <View style={{ backgroundColor: colors.background }}>
 *     <Button title="Toggle Theme" onPress={toggleTheme} />
 *   </View>
 * );
 */
export const useTheme = () => {
  /** Get current system color scheme preference */
  const systemColorScheme = useColorScheme();

  /** Current active color scheme state */
  const [colorScheme, setColorScheme] = useState<ColorScheme>(systemColorScheme || 'light');

  /** Loading state for initial theme setup */
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Load theme preference on component mount
   *
   * Checks for stored user preference first, then falls back to system preference.
   * Handles storage errors gracefully by defaulting to system or light theme.
   */
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const storedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (storedTheme) {
          // Use stored user preference
          setColorScheme(storedTheme as ColorScheme);
        } else {
          // Fall back to system preference
          setColorScheme(systemColorScheme || 'light');
        }
      } catch (error) {
        // On error, use system preference or light as fallback
        setColorScheme(systemColorScheme || 'light');
      } finally {
        setIsLoading(false);
      }
    };

    loadTheme();
  }, [systemColorScheme]);

  /**
   * Toggles between light and dark themes
   *
   * Switches the current theme and persists the new preference to storage.
   * Provides user feedback through console logging if storage fails.
   */
  const toggleTheme = async () => {
    const newScheme = colorScheme === 'light' ? 'dark' : 'light';
    setColorScheme(newScheme);

    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newScheme);
    } catch (error) {
      console.error('Failed to save theme preference:', error);
    }
  };

  /**
   * Resets theme to follow system preference
   *
   * Removes stored user preference and reverts to system color scheme.
   * Useful for users who want automatic theme switching based on system settings.
   */
  const resetToSystem = async () => {
    try {
      await AsyncStorage.removeItem(THEME_STORAGE_KEY);
      setColorScheme(systemColorScheme || 'light');
    } catch (error) {
      console.error('Failed to reset theme preference:', error);
    }
  };

  /** Get current theme colors based on active color scheme */
  const themeColors: ThemeColors = colors[colorScheme];

  return {
    colorScheme,
    colors: themeColors,
    brandColor: colors.brand,
    toggleTheme,
    resetToSystem,
    isLoading,
  };
};