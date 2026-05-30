/**
 * @fileoverview Secure storage utilities for authentication and user data
 *
 * This file provides secure storage functions for authentication tokens and user information
 * using Expo SecureStore. All sensitive data like tokens and user details are encrypted
 * and stored securely on the device, preventing unauthorized access.
 */

import * as SecureStore from 'expo-secure-store';

/** Storage keys for secure data - using consistent naming convention */
const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_ID_KEY = 'user_id';
const USER_EMAIL_KEY = 'user_email';
const USER_NAME_KEY = 'user_name';

/**
 * Saves authentication tokens securely to device storage
 *
 * Stores both access and refresh tokens using Expo SecureStore for encrypted storage.
 * These tokens are essential for maintaining user authentication state and
 * making authenticated API requests.
 *
 * @param {string} accessToken - JWT access token for API authentication
 * @param {string} refreshToken - Refresh token for obtaining new access tokens
 * @throws {Error} When token storage fails
 *
 * @example
 * await saveTokens(loginResponse.accessToken, loginResponse.refreshToken);
 */
export const saveTokens = async (accessToken: string, refreshToken: string): Promise<void> => {
  try {
    await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, String(accessToken));
    await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, String(refreshToken));
  } catch (error) {
    console.error('Failed to save tokens');
    throw new Error('Failed to save authentication tokens.');
  }
};

/**
 * Saves user information securely to device storage
 *
 * Stores user profile data including ID, email, and name for offline access
 * and UI personalization. All data is encrypted using Expo SecureStore.
 *
 * @param {number} userId - Unique user identifier
 * @param {string} email - User's email address
 * @param {string} name - User's display name
 * @throws {Error} When user info storage fails
 *
 * @example
 * await saveUserInfo(user.id, user.email, user.name);
 */
export const saveUserInfo = async (userId: number, email: string, name: string): Promise<void> => {
  try {
    await SecureStore.setItemAsync(USER_ID_KEY, String(userId));
    await SecureStore.setItemAsync(USER_EMAIL_KEY, email);
    await SecureStore.setItemAsync(USER_NAME_KEY, name);
  } catch (error) {
    console.error('Failed to save user info');
    throw new Error('Failed to save user information.');
  }
};

/**
 * Retrieves user ID from secure storage
 *
 * Gets the stored user ID and converts it from string to number format.
 * Returns null if no user ID is found or if parsing fails.
 *
 * @returns {Promise<number | null>} User ID as number, or null if not found
 *
 * @example
 * const userId = await getUserId();
 * if (userId) {
 *   // User is logged in, proceed with user-specific operations
 * }
 */
export const getUserId = async (): Promise<number | null> => {
  try {
    const userId = await SecureStore.getItemAsync(USER_ID_KEY);
    if (!userId) return null;
    const parsed = parseInt(userId, 10);
    return isNaN(parsed) ? null : parsed;
  } catch (error) {
    console.error('Failed to get user ID');
    return null;
  }
};

/**
 * Retrieves user email from secure storage
 *
 * Gets the stored user email for display purposes and user identification.
 * Returns null if no email is stored or if retrieval fails.
 *
 * @returns {Promise<string | null>} User email or null if not found
 */
export const getUserEmail = async (): Promise<string | null> => {
  try {
    return await SecureStore.getItemAsync(USER_EMAIL_KEY);
  } catch (error) {
    console.error('Failed to get user email');
    return null;
  }
};

/**
 * Retrieves user name from secure storage
 *
 * Gets the stored user display name for UI personalization.
 * Returns null if no name is stored or if retrieval fails.
 *
 * @returns {Promise<string | null>} User name or null if not found
 */
export const getUserName = async (): Promise<string | null> => {
  try {
    return await SecureStore.getItemAsync(USER_NAME_KEY);
  } catch (error) {
    console.error('Failed to get user name');
    return null;
  }
};

/**
 * Retrieves access token from secure storage
 *
 * Gets the stored JWT access token for API authentication.
 * Returns null if no token is stored or if retrieval fails.
 *
 * @returns {Promise<string | null>} Access token or null if not found
 *
 * @example
 * const token = await getAccessToken();
 * if (token) {
 *   // Include token in API request headers
 *   headers.Authorization = `Bearer ${token}`;
 * }
 */
export const getAccessToken = async (): Promise<string | null> => {
  try {
    return await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
  } catch (error) {
    console.error('Failed to get access token');
    return null;
  }
};

/**
 * Retrieves refresh token from secure storage
 *
 * Gets the stored refresh token for obtaining new access tokens
 * when the current access token expires.
 *
 * @returns {Promise<string | null>} Refresh token or null if not found
 */
export const getRefreshToken = async (): Promise<string | null> => {
  try {
    return await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
  } catch (error) {
    console.error('Failed to get refresh token');
    return null;
  }
};

/**
 * Clears all stored authentication data
 *
 * Removes all stored tokens and user information from secure storage.
 * This is typically called during logout to ensure complete data cleanup
 * and prevent unauthorized access to user data.
 *
 * @throws {Error} When token deletion fails
 *
 * @example
 * await clearTokens(); // Called during logout process
 * navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
 */
export const clearTokens = async (): Promise<void> => {
  try {
    await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
    await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
    await SecureStore.deleteItemAsync(USER_ID_KEY);
    await SecureStore.deleteItemAsync(USER_EMAIL_KEY);
    await SecureStore.deleteItemAsync(USER_NAME_KEY);
  } catch (error) {
    console.error('Failed to clear tokens');
    throw new Error('Failed to clear authentication data.');
  }
};