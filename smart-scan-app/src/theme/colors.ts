/**
 * @fileoverview Theme color definitions and type declarations
 *
 * This file defines the complete color system for the Smart Scan app,
 * including light and dark theme variations. Provides consistent colors
 * across all UI components and ensures proper theme switching functionality.
 */

/**
 * Complete color palette for the Smart Scan application
 *
 * Defines brand colors and theme-specific color schemes for light and dark modes.
 * Each theme includes colors for backgrounds, cards, text, and borders to ensure
 * consistent visual hierarchy and accessibility across different viewing modes.
 *
 * @constant {Object} colors
 */
export const colors = {
  /** Primary brand color - Smart Scan blue */
  brand: '#034EA2',

  /** Light theme color scheme */
  light: {
    /** Primary background color - very light gray */
    background: '#F9FAFB',
    /** Card and surface background - pure white */
    card: '#FFFFFF',
    /** Primary text color - dark gray */
    text: '#111827',
    /** Secondary text color - medium gray */
    subtext: '#6B7280',
    /** Border color - light gray */
    border: '#D1D5DB',
  },

  /** Dark theme color scheme */
  dark: {
    /** Primary background color - dark gray */
    background: '#111827',
    /** Card and surface background - medium dark gray */
    card: '#1F2937',
    /** Primary text color - white */
    text: '#FFFFFF',
    /** Secondary text color - light gray */
    subtext: '#9CA3AF',
    /** Border color - medium gray */
    border: '#374151',
  },
};

/**
 * Type definition for color scheme options
 *
 * Restricts theme selection to supported color schemes
 */
export type ColorScheme = 'light' | 'dark';

/**
 * Type definition for theme color structure
 *
 * Ensures consistency between light and dark theme color objects
 */
export type ThemeColors = typeof colors.light;