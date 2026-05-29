/**
 * @fileoverview Family members API module for managing family membership and invitations.
 * Provides functionality for viewing family members, removing members from families,
 * and sending invitations to new family members. Handles family relationship management
 * and member role administration within the smart scan family system.
 */

import apiClient from './client';
import { formatAxiosError } from '../utils/errorHandler';

/**
 * Family member information response from the server.
 * Contains personal details and family membership information for a family member.
 */
export interface FamilyMemberResponse {
  /** Unique family member identifier */
  id: number;
  /** ID of the family this member belongs to */
  family_id: number;
  /** Associated user account ID */
  user_id: number;
  /** Member's role in the family (admin, member, child, etc.) */
  role: string;
  /** Member's display name */
  name?: string;
  /** Member's email address */
  email?: string;
  /** Member's phone number */
  phone_number?: string;
  /** Member's age (optional, useful for child members) */
  age?: number;
  /** ISO timestamp when the member joined the family */
  created_at: string;
}

/**
 * Response structure for family member list requests.
 * Contains all family members with family context and metadata.
 */
export interface FamilyMemberListResponse {
  /** ID of the family */
  family_id: number;
  /** Name of the family */
  family_name: string;
  /** Array of all family member objects */
  members: FamilyMemberResponse[];
  /** Total number of family members */
  total_count: number;
}

/**
 * Fetches all family members for the authenticated user's family.
 * Retrieves comprehensive information about all members in the user's family,
 * including their roles, contact information, and membership details.
 *
 * @returns Promise resolving to list of family members with their details
 * @throws Formatted error if the API request fails or user is not part of a family
 */
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

/**
 * Removes a family member from the authenticated user's family.
 * Only family administrators can remove other members. Members cannot be removed
 * if they own active tags or have pending operations. The member's account remains
 * active but they lose access to the family's smart scan features.
 *
 * @param memberId - Unique identifier of the family member to remove
 * @returns Promise resolving to true if the member was successfully removed
 * @throws Formatted error if removal fails, member not found, or insufficient permissions
 */
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

/**
 * Request structure for inviting a new member to join the family.
 * Contains the personal information needed to send a family invitation.
 */
export interface InviteMemberRequest {
  /** Name of the person being invited */
  name: string;
  /** Email address where the invitation will be sent */
  email: string;
  /** Phone number of the person being invited */
  phone_number: string;
  /** Optional age of the person being invited */
  age?: number;
}

/**
 * Response structure for family member invitation creation.
 * Contains invitation details and token for the invited person to join the family.
 */
export interface InviteMemberResponse {
  /** Unique invitation identifier */
  id: number;
  /** ID of the family the person is invited to join */
  family_id: number;
  /** Email address of the invited person */
  email: string;
  /** Name of the invited person */
  name: string;
  /** Phone number of the invited person */
  phone_number: string;
  /** Age of the invited person (optional) */
  age?: number;
  /** Unique token for accepting the invitation */
  token: string;
  /** Current status of the invitation (pending, accepted, expired, etc.) */
  status: string;
  /** ISO timestamp when the invitation expires */
  expires_at: string;
  /** ISO timestamp when the invitation was created */
  created_at: string;
}

/**
 * Sends an invitation for a new member to join the authenticated user's family.
 * Creates a family invitation with a unique token that can be used to accept
 * membership. The invitation is sent via email and has an expiration time.
 * Only family administrators can invite new members.
 *
 * @param invitation - Details of the person to invite including name, email, and phone
 * @returns Promise resolving to invitation details including token and expiration
 * @throws Formatted error if invitation fails, email is invalid, or insufficient permissions
 */
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