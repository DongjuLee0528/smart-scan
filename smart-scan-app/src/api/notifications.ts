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