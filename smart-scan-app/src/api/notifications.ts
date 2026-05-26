import apiClient from './client';
import { formatAxiosError } from '../utils/errorHandler';

export interface NotificationResponse {
  id: number;
  family_id: number;
  sender_user_id: number;
  recipient_user_id: number;
  type: 'missing_alert' | 'manual_alert';
  channel: 'kakao' | 'sms' | 'email';
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface NotificationListResponse {
  notifications: NotificationResponse[];
  total_count: number;
}

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

export const markAllAsRead = async (): Promise<boolean> => {
  try {
    const notifications = await getNotifications();
    const unreadNotifications = notifications.notifications.filter(n => !n.is_read);

    await Promise.all(
      unreadNotifications.map(notification => markAsRead(notification.id))
    );

    return true;
  } catch (error) {
    throw formatAxiosError(error);
  }
};

export interface PushTokenRequest {
  push_token: string;
  device_type: 'ios' | 'android';
  app_version?: string;
}

export interface PushTokenResponse {
  id: number;
  user_id: number;
  push_token: string;
  device_type: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

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