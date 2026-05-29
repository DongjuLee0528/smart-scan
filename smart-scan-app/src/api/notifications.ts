/**
 * @fileoverview Notification API module for managing push notifications and user notification preferences.
 * Provides functions for fetching notifications, marking them as read, and managing push token registration
 * for mobile push notification delivery. Handles both in-app notification display and Expo push notification
 * token management for real-time alerts about missing items and family member activities.
 */

import apiClient from './client';
import { formatAxiosError } from '../utils/errorHandler';

/**
 * Represents a notification response from the server.
 * Notifications are sent for various events like missing item alerts and manual alerts.
 */
export interface NotificationResponse {
  /** Unique identifier for the notification */
  id: number;
  /** ID of the family this notification belongs to */
  family_id: number;
  /** User ID of the notification sender */
  sender_user_id: number;
  /** User ID of the notification recipient */
  recipient_user_id: number;
  /** Type of notification: missing item alert or manual alert */
  type: 'missing_alert' | 'manual_alert';
  /** Communication channel used for the notification */
  channel: 'kakao' | 'sms' | 'email';
  /** Notification title displayed to the user */
  title: string;
  /** Notification message content */
  message: string;
  /** Whether the notification has been read by the recipient */
  is_read: boolean;
  /** ISO timestamp when the notification was created */
  created_at: string;
}

/**
 * Response structure for fetching multiple notifications.
 * Contains paginated notification data with total count for UI pagination.
 */
export interface NotificationListResponse {
  /** Array of notification objects */
  notifications: NotificationResponse[];
  /** Total number of notifications available */
  total_count: number;
}

/**
 * Fetches all notifications for the authenticated user.
 * Retrieves notifications from the server including both read and unread notifications.
 *
 * @returns Promise resolving to notification list with total count
 * @throws Formatted error if the API request fails or response is invalid
 */
export const getNotifications = async (): Promise<NotificationListResponse> => {
  try {
    const response = await apiClient.get('/api/notifications');
    if (!response.data || !response.data.success || !response.data.data) {
      throw new Error('Invalid response format');
    }
    return response.data.data;
  } catch (error) {
    throw formatAxiosError(error);
  }
};

/**
 * Marks a specific notification as read.
 * Updates the notification status on the server to indicate it has been viewed by the user.
 *
 * @param notificationId - Unique identifier of the notification to mark as read
 * @returns Promise resolving to the updated notification object
 * @throws Formatted error if the API request fails or notification not found
 */
export const markAsRead = async (notificationId: number): Promise<NotificationResponse> => {
  try {
    const response = await apiClient.patch(`/api/notifications/${notificationId}/read`);
    if (!response.data || !response.data.success || !response.data.data) {
      throw new Error('Invalid response format');
    }
    return response.data.data;
  } catch (error) {
    throw formatAxiosError(error);
  }
};

/**
 * Marks all unread notifications as read for the current user.
 * Fetches all notifications, filters for unread ones, and marks them as read in parallel.
 * This is useful for "Mark all as read" functionality in the notification list.
 *
 * @returns Promise resolving to true if all notifications were successfully marked as read
 * @throws Formatted error if any API request fails
 */
export const markAllAsRead = async (): Promise<boolean> => {
  try {
    // Fetch all current notifications
    const notifications = await getNotifications();
    // Filter to only unread notifications
    const unreadNotifications = notifications.notifications.filter(n => !n.is_read);

    // Mark all unread notifications as read in parallel for better performance
    await Promise.all(
      unreadNotifications.map(notification => markAsRead(notification.id))
    );

    return true;
  } catch (error) {
    throw formatAxiosError(error);
  }
};

/**
 * Request structure for registering or updating push notification tokens.
 * Used with Expo push notifications to enable real-time alerts on mobile devices.
 */
export interface PushTokenRequest {
  /** Expo push token obtained from the device */
  push_token: string;
  /** Type of mobile device platform */
  device_type: 'ios' | 'android';
  /** Optional app version for compatibility tracking */
  app_version?: string;
}

/**
 * Response structure for push token operations.
 * Contains server-stored push token information for notification delivery.
 */
export interface PushTokenResponse {
  /** Unique identifier for the push token record */
  id: number;
  /** ID of the user this token belongs to */
  user_id: number;
  /** The actual push token string */
  push_token: string;
  /** Device platform type */
  device_type: string;
  /** Whether this token is currently active for notifications */
  is_active: boolean;
  /** ISO timestamp when the token was first created */
  created_at: string;
  /** ISO timestamp when the token was last updated */
  updated_at: string;
}

/**
 * Registers a new push notification token for the authenticated user.
 * Associates the device's Expo push token with the user's account to enable notifications.
 *
 * @param token - Expo push token obtained from the mobile device
 * @param deviceType - Platform type, defaults to 'android' if not specified
 * @returns Promise resolving to the registered push token information
 * @throws Formatted error if registration fails or token is invalid
 */
export const registerPushToken = async (token: string, deviceType: 'ios' | 'android' = 'android'): Promise<PushTokenResponse> => {
  try {
    const requestData: PushTokenRequest = {
      push_token: token,
      device_type: deviceType,
    };

    const response = await apiClient.post('/api/notifications/push-token', requestData);
    if (!response.data || !response.data.success || !response.data.data) {
      throw new Error('Invalid response format');
    }
    return response.data.data;
  } catch (error) {
    throw formatAxiosError(error);
  }
};

/**
 * Updates an existing push notification token for the authenticated user.
 * Used when the device token changes or needs to be refreshed for continued notification delivery.
 *
 * @param token - New Expo push token to replace the existing one
 * @param deviceType - Platform type, defaults to 'android' if not specified
 * @returns Promise resolving to the updated push token information
 * @throws Formatted error if update fails or token is invalid
 */
export const updatePushToken = async (token: string, deviceType: 'ios' | 'android' = 'android'): Promise<PushTokenResponse> => {
  try {
    const requestData: PushTokenRequest = {
      push_token: token,
      device_type: deviceType,
    };

    const response = await apiClient.put('/api/notifications/push-token', requestData);
    if (!response.data || !response.data.success || !response.data.data) {
      throw new Error('Invalid response format');
    }
    return response.data.data;
  } catch (error) {
    throw formatAxiosError(error);
  }
};

/**
 * Deletes the push notification token for the authenticated user.
 * Disables push notifications for the user's device by removing the token from the server.
 * Typically used when a user logs out or disables notifications.
 *
 * @returns Promise resolving to true if the token was successfully deleted
 * @throws Formatted error if deletion fails or token doesn't exist
 */
export const deletePushToken = async (): Promise<boolean> => {
  try {
    const response = await apiClient.delete('/api/notifications/push-token');
    if (!response.data || !response.data.success) {
      throw new Error('Invalid response format');
    }
    return true;
  } catch (error) {
    throw formatAxiosError(error);
  }
};