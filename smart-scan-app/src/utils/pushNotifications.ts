/**
 * @fileoverview Push notification utilities for Expo managed workflow
 *
 * This file provides utilities for managing push notifications in the Smart Scan app.
 * Includes functions for token registration, permission handling, and notification
 * listeners. Uses Expo's notification system for cross-platform compatibility.
 */

import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

/**
 * Configure global notification handler
 *
 * Sets default behavior for all incoming notifications:
 * - Show alerts to users
 * - Disable sound to avoid interruption
 * - Disable badge count for cleaner UI
 */
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

/**
 * Registers device for push notifications and returns token
 *
 * Handles the complete push notification setup process including:
 * - Android notification channel configuration
 * - Permission requests and validation
 * - Expo push token generation
 * - Error handling for various failure scenarios
 *
 * @returns {Promise<string | undefined>} Push token string if successful, undefined if failed
 *
 * @example
 * const token = await registerForPushNotificationsAsync();
 * if (token) {
 *   // Send token to your server for notification targeting
 * }
 */
export async function registerForPushNotificationsAsync(): Promise<string | undefined> {
  let token: string | undefined;

  // Configure Android-specific notification channel
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  // Only proceed if running on a physical device
  if (Device.isDevice) {
    // Check current notification permissions
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    // Request permissions if not already granted
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    // Exit if permissions are denied
    if (finalStatus !== 'granted') {
      console.error('Push notification permissions denied.');
      return undefined;
    }

    try {
      // Get EAS project ID from app configuration
      const projectId = Constants.expoConfig?.extra?.eas?.projectId;
      if (!projectId) {
        console.error('EAS Project ID not configured.');
        return undefined;
      }

      // Generate Expo push token using project ID
      token = (await Notifications.getExpoPushTokenAsync({
        projectId: projectId,
      })).data;

      console.log('Expo Push Token generated successfully:', token);
    } catch (error) {
      console.error('Failed to generate Expo Push Token:', error);
    }
  } else {
    console.warn('Push tokens can only be generated on physical devices.');
  }

  return token;
}

/**
 * Adds listener for incoming notifications while app is active
 *
 * Registers a callback function to handle notifications received while
 * the app is in the foreground. Useful for updating UI or showing
 * in-app notification indicators.
 *
 * @param {function} listener - Callback function to handle received notifications
 * @returns {Notifications.Subscription} Subscription object to remove listener later
 *
 * @example
 * const subscription = addNotificationReceivedListener((notification) => {
 *   console.log('Received:', notification.request.content.title);
 * });
 * // Later: subscription.remove();
 */
export function addNotificationReceivedListener(
  listener: (notification: Notifications.Notification) => void
): Notifications.Subscription {
  return Notifications.addNotificationReceivedListener(listener);
}

/**
 * Adds listener for notification user interactions
 *
 * Registers a callback for when users tap on notifications or interact
 * with notification action buttons. Essential for handling deep links
 * and navigation from notifications.
 *
 * @param {function} listener - Callback function to handle notification responses
 * @returns {Notifications.Subscription} Subscription object to remove listener later
 *
 * @example
 * const subscription = addNotificationResponseReceivedListener((response) => {
 *   // Navigate to specific screen based on notification data
 *   navigation.navigate('Details', { id: response.notification.request.content.data.itemId });
 * });
 */
export function addNotificationResponseReceivedListener(
  listener: (response: Notifications.NotificationResponse) => void
): Notifications.Subscription {
  return Notifications.addNotificationResponseReceivedListener(listener);
}