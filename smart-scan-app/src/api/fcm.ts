import apiClient from './client';
import { formatAxiosError } from '../utils/errorHandler';

export interface FcmTokenRequest {
  fcm_token: string;
  device_type: 'ios' | 'android';
  app_version?: string;
}

export interface FcmTokenResponse {
  id: number;
  user_id: number;
  fcm_token: string;
  device_type: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const registerFcmToken = async (token: string, deviceType: 'ios' | 'android' = 'android'): Promise<FcmTokenResponse> => {
  try {
    const requestData: FcmTokenRequest = {
      fcm_token: token,
      device_type: deviceType,
    };

    const response = await apiClient.post('/api/notifications/fcm-token', requestData);
    if (!response.data || !response.data.success || !response.data.data) {
      throw new Error('Invalid response format');
    }
    return response.data.data;
  } catch (error) {
    throw formatAxiosError(error);
  }
};

export const updateFcmToken = async (token: string, deviceType: 'ios' | 'android' = 'android'): Promise<FcmTokenResponse> => {
  try {
    const requestData: FcmTokenRequest = {
      fcm_token: token,
      device_type: deviceType,
    };

    const response = await apiClient.put('/api/notifications/fcm-token', requestData);
    if (!response.data || !response.data.success || !response.data.data) {
      throw new Error('Invalid response format');
    }
    return response.data.data;
  } catch (error) {
    throw formatAxiosError(error);
  }
};

export const deleteFcmToken = async (): Promise<boolean> => {
  try {
    const response = await apiClient.delete('/api/notifications/fcm-token');
    if (!response.data || !response.data.success) {
      throw new Error('Invalid response format');
    }
    return true;
  } catch (error) {
    throw formatAxiosError(error);
  }
};