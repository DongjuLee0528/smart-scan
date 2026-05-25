import apiClient from './client';
import { saveTokens, saveUserInfo, clearTokens } from '../storage/tokenStorage';
import { formatAxiosError } from '../utils/errorHandler';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
  phone: string;
  age: number;
}

export interface AuthApiResponse {
  success: boolean;
  message: string;
  data: {
    access_token: string;
    refresh_token: string;
    name: string;
    email: string;
    user_id: number;
  };
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  name: string;
  email: string;
  user_id: number;
}

export const login = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    const response = await apiClient.post<AuthApiResponse>('/api/auth/login', {
      email,
      password,
    });

    if (!response.data || !response.data.success || !response.data.data) {
      throw new Error('Invalid response format');
    }

    const { access_token, refresh_token, user_id, name, email: userEmail } = response.data.data;
    await saveTokens(access_token, refresh_token);
    await saveUserInfo(user_id, userEmail, name);

    return response.data.data;
  } catch (error) {
    throw formatAxiosError(error);
  }
};

export const signup = async (
  name: string,
  email: string,
  password: string,
  phone: string,
  age: number
): Promise<void> => {
  try {
    const response = await apiClient.post('/api/auth/register', {
      name,
      email,
      password,
      phone,
      age,
    });

    if (!response.data || !response.data.success) {
      throw new Error('Invalid response format');
    }
  } catch (error) {
    throw formatAxiosError(error);
  }
};

export const refreshToken = async (refreshToken: string): Promise<AuthResponse> => {
  try {
    const response = await apiClient.post<AuthApiResponse>('/api/auth/refresh', {
      refresh_token: refreshToken,
    });

    if (!response.data || !response.data.success || !response.data.data) {
      throw new Error('Invalid response format');
    }

    const { access_token, refresh_token: newRefreshToken, user_id, name, email: userEmail } = response.data.data;
    await saveTokens(access_token, newRefreshToken);
    await saveUserInfo(user_id, userEmail, name);

    return response.data.data;
  } catch (error) {
    throw formatAxiosError(error);
  }
};

export const logout = async (): Promise<void> => {
  try {
    await apiClient.post('/api/auth/logout');
  } catch (error) {
    console.error('Failed to logout from server');
    throw formatAxiosError(error);
  } finally {
    try {
      await clearTokens();
    } catch (clearError) {
      console.error('Failed to clear tokens during logout');
    }
  }
};