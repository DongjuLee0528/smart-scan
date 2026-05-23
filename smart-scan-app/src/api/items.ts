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

export interface ItemResponse {
  id: number;
  name: string;
  label_id?: number;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  is_pending: boolean;
}

export interface ItemListResponse {
  items: ItemResponse[];
  total_count: number;
}

export interface ItemAddRequest {
  name: string;
  label_id?: number;
}

export interface ItemUpdateRequest {
  name?: string;
  label_id?: number;
}

export const getItems = async (): Promise<ItemListResponse> => {
  console.log('DEBUG: getItems 호출 시작 - URL: /api/items');
  try {
    const response = await api.get('/api/items');
    console.log('DEBUG: getItems 성공 응답:', response);
    if (!response.data || !response.data.data) {
      throw new Error('Invalid response format');
    }
    return response.data.data;
  } catch (error) {
    console.log('DEBUG: getItems 에러:', error);
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

export const createItem = async (name: string, labelId?: number): Promise<ItemResponse> => {
  console.log('DEBUG: createItem 호출 시작 - URL: /api/items, name:', name, 'labelId:', labelId);
  try {
    const requestData: ItemAddRequest = { name };
    if (labelId !== undefined) {
      requestData.label_id = labelId;
    }

    const response = await api.post('/api/items', requestData);
    console.log('DEBUG: createItem 성공 응답:', response);
    if (!response.data || !response.data.data) {
      throw new Error('Invalid response format');
    }
    return response.data.data;
  } catch (error) {
    console.log('DEBUG: createItem 에러:', error);
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

export const updateItem = async (itemId: number, name?: string, labelId?: number): Promise<ItemResponse> => {
  console.log('DEBUG: updateItem 호출 시작 - URL: /api/items/' + itemId, 'name:', name, 'labelId:', labelId);
  try {
    const updateData: ItemUpdateRequest = {};
    if (name !== undefined) updateData.name = name;
    if (labelId !== undefined) updateData.label_id = labelId;

    const response = await api.patch(`/api/items/${itemId}`, updateData);
    console.log('DEBUG: updateItem 성공 응답:', response);
    if (!response.data || !response.data.data) {
      throw new Error('Invalid response format');
    }
    return response.data.data;
  } catch (error) {
    console.log('DEBUG: updateItem 에러:', error);
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

export const deleteItem = async (itemId: number): Promise<boolean> => {
  console.log('DEBUG: deleteItem 호출 시작 - URL: /api/items/' + itemId);
  try {
    const response = await api.delete(`/api/items/${itemId}`);
    console.log('DEBUG: deleteItem 성공 응답:', response);
    if (!response.data) {
      throw new Error('Invalid response format');
    }
    return true;
  } catch (error) {
    console.log('DEBUG: deleteItem 에러:', error);
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