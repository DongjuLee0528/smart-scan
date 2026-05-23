import apiClient from './client';
import { formatAxiosError } from '../utils/errorHandler';

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
  try {
    const response = await apiClient.get('/api/monitoring/dashboard');
    if (!response.data || !response.data.data) {
      throw new Error('Invalid response format');
    }
    return response.data.data;
  } catch (error) {
    throw formatAxiosError(error);
  }
};

export const getMyTags = async (): Promise<MyTagStatusListResponse> => {
  try {
    const response = await apiClient.get('/api/monitoring/my-tags');
    if (!response.data || !response.data.data) {
      throw new Error('Invalid response format');
    }
    return response.data.data;
  } catch (error) {
    throw formatAxiosError(error);
  }
};

export const getItems = async (): Promise<ItemListResponse> => {
  try {
    const response = await apiClient.get('/api/items');
    if (!response.data || !response.data.data) {
      throw new Error('Invalid response format');
    }
    return response.data.data;
  } catch (error) {
    throw formatAxiosError(error);
  }
};

export const getFamilyMembers = async (): Promise<FamilyMemberListResponse> => {
  try {
    const response = await apiClient.get('/api/families/members');
    if (!response.data || !response.data.data) {
      throw new Error('Invalid response format');
    }
    return response.data.data;
  } catch (error) {
    throw formatAxiosError(error);
  }
};