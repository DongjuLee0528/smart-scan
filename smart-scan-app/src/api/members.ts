import apiClient from './client';
import { formatAxiosError } from '../utils/errorHandler';

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

export const getMembers = async (): Promise<FamilyMemberListResponse> => {
  try {
    const response = await apiClient.get('/api/families/members');
    if (!response.data || !response.data.success || !response.data.data) {
      throw new Error('Invalid response format');
    }
    return response.data.data;
  } catch (error) {
    throw formatAxiosError(error);
  }
};

export const deleteMember = async (memberId: number): Promise<boolean> => {
  try {
    const response = await apiClient.delete(`/api/families/members/${memberId}`);
    if (!response.data || !response.data.success) {
      throw new Error('Invalid response format');
    }
    return true;
  } catch (error) {
    throw formatAxiosError(error);
  }
};

export interface InviteMemberRequest {
  name: string;
  email: string;
  phone_number: string;
  age?: number;
}

export interface InviteMemberResponse {
  id: number;
  family_id: number;
  email: string;
  name: string;
  phone_number: string;
  age?: number;
  token: string;
  status: string;
  expires_at: string;
  created_at: string;
}

export const inviteMember = async (invitation: InviteMemberRequest): Promise<InviteMemberResponse> => {
  try {
    const response = await apiClient.post('/api/family-invitations', invitation);
    if (!response.data || !response.data.success || !response.data.data) {
      throw new Error('Invalid response format');
    }
    return response.data.data;
  } catch (error) {
    throw formatAxiosError(error);
  }
};