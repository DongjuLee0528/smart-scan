/**
 * @fileoverview Status color constants for UI components
 *
 * This file defines standardized color schemes for different status states
 * used throughout the Smart Scan React Native application. These colors
 * ensure consistent visual feedback across all status-related UI elements.
 */

/**
 * Status color palette for UI feedback elements
 *
 * Provides consistent color schemes for success, neutral, and error states.
 * Each state includes both text and background colors for optimal contrast
 * and accessibility.
 *
 * @constant {Object} STATUS_COLORS
 */
export const STATUS_COLORS = {
  /** Success state colors - green theme for positive feedback */
  success: {
    /** Success text color - vibrant green */
    text: '#10B981',
    /** Success background color - light green */
    background: '#D1FAE5',
  },
  /** Neutral state colors - gray theme for informational content */
  neutral: {
    /** Neutral text color - medium gray */
    text: '#6B7280',
    /** Neutral background color - light gray */
    background: '#F3F4F6',
  },
  /** Error state colors - red theme for error feedback */
  error: {
    /** Error text color - vibrant red */
    text: '#EF4444',
    /** Error background color - light red */
    background: '#FEE2E2',
  },
};