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

export enum TagStatus {
  REGISTERED = 'REGISTERED',
  FOUND = 'FOUND',
  LOST = 'LOST',
}

export interface TagStatusResponse {
  tag_id: number;
  tag_uid: string;
  name: string;
  owner_user_id: number;
  owner_member_id?: number;
  owner_name?: string;
  status: TagStatus;
  is_active: boolean;
  item_id?: number;
  item_name?: string;
  device_id?: number;
  last_seen_at?: string;
  last_scanned_at?: string;
  created_at: string;
  updated_at: string;
}

export interface MemberSummaryResponse {
  member_id: number;
  user_id: number;
  name?: string;
  email?: string;
  role: string;
  tag_count: number;
  found_count: number;
  lost_count: number;
  registered_count: number;
}

export interface DashboardSummaryResponse {
  total_members: number;
  total_tags: number;
  found_count: number;
  lost_count: number;
  registered_count: number;
}

export interface MonitoringDashboardResponse {
  family_id: number;
  family_name: string;
  requester_member_id: number;
  requester_role: string;
  summary: DashboardSummaryResponse;
  members: MemberSummaryResponse[];
}

export interface MyTagStatusListResponse {
  family_id: number;
  family_name: string;
  member_id: number;
  tags: TagStatusResponse[];
  total_count: number;
}

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

export interface FamilyMemberResponse {
  id: number;
  family_id: number;
  user_id: number;
  role: string;
  name?: string;
  email?: string;
  phone_number?: string;
  age?: number;
  created_at: string;
}

export interface FamilyMemberListResponse {
  family_id: number;
  family_name: string;
  members: FamilyMemberResponse[];
  total_count: number;
}

export const getDashboard = async (): Promise<MonitoringDashboardResponse> => {
  console.log('DEBUG: getDashboard 호출 시작 - URL: /api/monitoring/dashboard');
  try {
    const response = await api.get('/api/monitoring/dashboard');
    console.log('DEBUG: getDashboard 성공 응답:', response);
    if (!response.data || !response.data.data) {
      throw new Error('Invalid response format');
    }
    return response.data.data;
  } catch (error) {
    console.log('DEBUG: getDashboard 에러:', error);
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

export const getMyTags = async (): Promise<MyTagStatusListResponse> => {
  console.log('DEBUG: getMyTags 호출 시작 - URL: /api/monitoring/my-tags');
  try {
    const response = await api.get('/api/monitoring/my-tags');
    console.log('DEBUG: getMyTags 성공 응답:', response);
    if (!response.data || !response.data.data) {
      throw new Error('Invalid response format');
    }
    return response.data.data;
  } catch (error) {
    console.log('DEBUG: getMyTags 에러:', error);
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

export const getFamilyMembers = async (): Promise<FamilyMemberListResponse> => {
  console.log('DEBUG: getFamilyMembers 호출 시작 - URL: /api/families/members');
  try {
    const response = await api.get('/api/families/members');
    console.log('DEBUG: getFamilyMembers 성공 응답:', response);
    if (!response.data || !response.data.data) {
      throw new Error('Invalid response format');
    }
    return response.data.data;
  } catch (error) {
    console.log('DEBUG: getFamilyMembers 에러:', error);
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