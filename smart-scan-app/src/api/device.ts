import axios from 'axios';
import { getAccessToken } from '../storage/tokenStorage';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  async (config) => {
    const token = await getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

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
  console.log('DEBUG: getMyDevice 호출 시작 - URL: /api/devices/me');
  try {
    const response = await api.get('/api/devices/me');
    console.log('DEBUG: getMyDevice 성공 응답:', response);
    if (!response.data) {
      throw new Error('Invalid response format');
    }
    return response.data.data;
  } catch (error) {
    console.log('DEBUG: getMyDevice 에러:', error);
    if (axios.isAxiosError(error)) {
      throw {
        code: error.code === 'ECONNABORTED' ? 'NETWORK_ERROR' : error.code,
        response: error.response,
        message: error.message,
      };
    }
    throw error;
  }
};

export const registerDevice = async (serial: string): Promise<DeviceResponse> => {
  console.log('DEBUG: registerDevice 호출 시작 - URL: /api/devices/register, serial:', serial);
  try {
    const response = await api.post('/api/devices/register', { serial });
    console.log('DEBUG: registerDevice 성공 응답:', response);
    if (!response.data || !response.data.data) {
      throw new Error('Invalid response format');
    }
    return response.data.data;
  } catch (error) {
    console.log('DEBUG: registerDevice 에러:', error);
    if (axios.isAxiosError(error)) {
      throw {
        code: error.code === 'ECONNABORTED' ? 'NETWORK_ERROR' : error.code,
        response: error.response,
        message: error.message,
      };
    }
    throw error;
  }
};

export const unlinkDevice = async (): Promise<boolean> => {
  console.log('DEBUG: unlinkDevice 호출 시작 - URL: /api/devices/unlink');
  try {
    const response = await api.delete('/api/devices/unlink');
    console.log('DEBUG: unlinkDevice 성공 응답:', response);
    if (!response.data) {
      throw new Error('Invalid response format');
    }
    return true;
  } catch (error) {
    console.log('DEBUG: unlinkDevice 에러:', error);
    if (axios.isAxiosError(error)) {
      throw {
        code: error.code === 'ECONNABORTED' ? 'NETWORK_ERROR' : error.code,
        response: error.response,
        message: error.message,
      };
    }
    throw error;
  }
};