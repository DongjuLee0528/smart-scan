import apiClient from './client';
import { formatAxiosError } from '../utils/errorHandler';

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
  try {
    const response = await apiClient.get('/api/items');
    if (!response.data || !response.data.success || !response.data.data) {
      throw new Error('Invalid response format');
    }
    return response.data.data;
  } catch (error) {
    throw formatAxiosError(error);
  }
};

export const createItem = async (name: string, labelId?: number): Promise<ItemResponse> => {
  try {
    const requestData: ItemAddRequest = { name };
    if (labelId !== undefined) {
      requestData.label_id = labelId;
    }

    const response = await apiClient.post('/api/items', requestData);
    if (!response.data || !response.data.success || !response.data.data) {
      throw new Error('Invalid response format');
    }
    return response.data.data;
  } catch (error) {
    throw formatAxiosError(error);
  }
};

export const updateItem = async (itemId: number, name?: string, labelId?: number): Promise<ItemResponse> => {
  try {
    const updateData: ItemUpdateRequest = {};
    if (name !== undefined) updateData.name = name;
    if (labelId !== undefined) updateData.label_id = labelId;

    const response = await apiClient.patch(`/api/items/${itemId}`, updateData);
    if (!response.data || !response.data.success || !response.data.data) {
      throw new Error('Invalid response format');
    }
    return response.data.data;
  } catch (error) {
    throw formatAxiosError(error);
  }
};

export const deleteItem = async (itemId: number): Promise<boolean> => {
  try {
    const response = await apiClient.delete(`/api/items/${itemId}`);
    if (!response.data || !response.data.success) {
      throw new Error('Invalid response format');
    }
    return true;
  } catch (error) {
    throw formatAxiosError(error);
  }
};