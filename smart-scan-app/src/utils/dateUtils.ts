/**
 * @fileoverview Date and time formatting utilities
 *
 * This file provides utility functions for formatting dates and times in the Smart Scan app.
 * Includes functions for standard date formatting and relative time calculations
 * for user-friendly timestamp displays.
 */

/**
 * Formats a date string into standardized display format
 *
 * Converts an ISO date string into a user-friendly format: YYYY-MM-DD HH:MM
 * Used throughout the app for consistent date and time display.
 *
 * @param {string} dateString - ISO date string to format
 * @returns {string} Formatted date string in YYYY-MM-DD HH:MM format
 *
 * @example
 * formatDateTime('2024-01-15T14:30:00Z') // returns '2024-01-15 14:30'
 */
export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}`;
};

/**
 * Calculates and formats relative time from a given date
 *
 * Converts a timestamp into human-readable relative time format
 * (e.g., "2 minutes ago", "3 hours ago"). Provides time units
 * from seconds to years for comprehensive time representation.
 *
 * @param {string} dateString - ISO date string to calculate relative time from
 * @returns {string} Formatted relative time string in English
 *
 * @example
 * getRelativeTime('2024-01-15T12:00:00Z') // returns '2 hours ago' (if current time is 14:00)
 */
export const getRelativeTime = (dateString: string): string => {
  const now = new Date();
  const date = new Date(dateString);
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  // Handle very recent timestamps
  if (diffInSeconds < 60) {
    return 'Just now';
  }

  // Handle minutes
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes === 1 ? '' : 's'} ago`;
  }

  // Handle hours
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`;
  }

  // Handle days
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`;
  }

  // Handle weeks
  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `${diffInWeeks} week${diffInWeeks === 1 ? '' : 's'} ago`;
  }

  // Handle months (approximate)
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} month${diffInMonths === 1 ? '' : 's'} ago`;
  }

  // Handle years (approximate)
  const diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears} year${diffInYears === 1 ? '' : 's'} ago`;
};