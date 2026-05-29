/**
 * @fileoverview Navigation type definitions for React Navigation stack
 *
 * This file defines the parameter list types for the authentication stack navigator,
 * ensuring type safety when navigating between screens in the Smart Scan app.
 */

/**
 * Type definition for the authentication stack navigator parameters
 *
 * Defines the screens available in the main navigation stack and their expected parameters.
 * Each screen that doesn't require parameters is typed as 'undefined'.
 *
 * @interface AuthStackParamList
 */
export type AuthStackParamList = {
  /** Login screen - no parameters required */
  Login: undefined;
  /** User registration screen - no parameters required */
  Signup: undefined;
  /** Main dashboard screen - no parameters required */
  Dashboard: undefined;
  /** Device management screen - no parameters required */
  Device: undefined;
  /** Item management screen - no parameters required */
  Item: undefined;
  /** Family member management screen - no parameters required */
  Member: undefined;
  /** Notification history screen - no parameters required */
  Notification: undefined;
};