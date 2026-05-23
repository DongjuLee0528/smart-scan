import apiClient from './client';
import { formatAxiosError } from '../utils/errorHandler';

export interface DeviceResponse {
  id: number;
  device_id: string;
  user_id: number;
  serial_number: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface MyDeviceResponse {
  device?: DeviceResponse;
  created_at: string;
}

export interface RegisterDeviceRequest {
  serial: string;
}

export const getMyDevice = async (): Promise<MyDeviceResponse | null> => {
  try {
    const response = await apiClient.get('/api/devices/me');
    if (!response.data) {
      throw new Error('Invalid response format');
    }
    return response.data.data;
  } catch (error) {
    throw formatAxiosError(error);
  }
};

export const registerDevice = async (serial: string): Promise<DeviceResponse> => {
  try {
    const response = await apiClient.post('/api/devices/register', { serial });
    if (!response.data || !response.data.data) {
      throw new Error('Invalid response format');
    }
    return response.data.data;
  } catch (error) {
    throw formatAxiosError(error);
  }
};

export const unlinkDevice = async (): Promise<boolean> => {
  try {
    const response = await apiClient.delete('/api/devices/unlink');
    if (!response.data) {
      throw new Error('Invalid response format');
    }
    return true;
  } catch (error) {
    throw formatAxiosError(error);
  }
};