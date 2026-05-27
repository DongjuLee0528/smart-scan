/**
 * @fileoverview Dashboard API module for monitoring family member activities and tag status.
 * Provides comprehensive dashboard data including family member summaries, tag status tracking,
 * and overview statistics. Supports both monitoring dashboard for family administrators
 * and personal tag status views for individual family members.
 */

import apiClient from './client';
import { formatAxiosError } from '../utils/errorHandler';

/**
 * Enumeration of possible tag status values in the smart scan system.
 * Tracks the lifecycle state of NFC tags attached to items.
 */
export enum TagStatus {
  /** Tag is newly registered but not yet scanned */
  REGISTERED = 'REGISTERED',
  /** Tag has been detected and is present */
  FOUND = 'FOUND',
  /** Tag is missing or hasn't been detected recently */
  LOST = 'LOST',
}

/**
 * Detailed tag status information including ownership and scanning history.
 * Contains comprehensive data about a tag's current state and associated item.
 */
export interface TagStatusResponse {
  /** Unique identifier for the tag */
  tag_id: number;
  /** NFC tag unique identifier string */
  tag_uid: string;
  /** Human-readable name for the tag */
  name: string;
  /** User ID of the tag owner */
  owner_user_id: number;
  /** Family member ID of the tag owner */
  owner_member_id?: number;
  /** Display name of the tag owner */
  owner_name?: string;
  /** Current status of the tag (REGISTERED/FOUND/LOST) */
  status: TagStatus;
  /** Whether the tag is currently active in the system */
  is_active: boolean;
  /** ID of the item this tag is attached to */
  item_id?: number;
  /** Name of the item this tag is attached to */
  item_name?: string;
  /** ID of the device that last detected this tag */
  device_id?: number;
  /** ISO timestamp when the tag was last seen by any device */
  last_seen_at?: string;
  /** ISO timestamp when the tag was last scanned */
  last_scanned_at?: string;
  /** ISO timestamp when the tag was created */
  created_at: string;
  /** ISO timestamp when the tag was last updated */
  updated_at: string;
}

/**
 * Summary information for a family member including their tag statistics.
 * Used in dashboard views to show member activity and tag ownership overview.
 */
export interface MemberSummaryResponse {
  /** Unique family member identifier */
  member_id: number;
  /** Associated user account ID */
  user_id: number;
  /** Member's display name */
  name?: string;
  /** Member's email address */
  email?: string;
  /** Member's role in the family (admin, member, etc.) */
  role: string;
  /** Total number of tags owned by this member */
  tag_count: number;
  /** Number of tags currently in FOUND status */
  found_count: number;
  /** Number of tags currently in LOST status */
  lost_count: number;
  /** Number of tags currently in REGISTERED status */
  registered_count: number;
}

/**
 * Overall dashboard summary statistics for the entire family.
 * Provides high-level metrics for family monitoring and overview.
 */
export interface DashboardSummaryResponse {
  /** Total number of family members */
  total_members: number;
  /** Total number of tags in the family */
  total_tags: number;
  /** Total number of tags currently found */
  found_count: number;
  /** Total number of tags currently lost */
  lost_count: number;
  /** Total number of tags currently registered */
  registered_count: number;
}

/**
 * Complete monitoring dashboard response containing family overview and member details.
 * Provides comprehensive view for family administrators to monitor all members and their items.
 */
export interface MonitoringDashboardResponse {
  /** Unique identifier for the family */
  family_id: number;
  /** Human-readable family name */
  family_name: string;
  /** Member ID of the user requesting the dashboard data */
  requester_member_id: number;
  /** Role of the requesting user in the family */
  requester_role: string;
  /** Summary statistics for the entire family */
  summary: DashboardSummaryResponse;
  /** Detailed information for each family member */
  members: MemberSummaryResponse[];
}

/**
 * Personal tag status list for an individual family member.
 * Contains all tags owned by the requesting user with their current status.
 */
export interface MyTagStatusListResponse {
  /** ID of the family this member belongs to */
  family_id: number;
  /** Name of the family */
  family_name: string;
  /** ID of the member viewing their tags */
  member_id: number;
  /** Array of all tags owned by this member */
  tags: TagStatusResponse[];
  /** Total number of tags owned by this member */
  total_count: number;
}

/**
 * Item information used in dashboard contexts.
 * Represents physical items that can have tags attached to them.
 */
export interface ItemResponse {
  /** Unique identifier for the item */
  id: number;
  /** Human-readable item name */
  name: string;
  /** Optional label category ID for item classification */
  label_id?: number;
  /** ISO timestamp when the item was created */
  created_at: string;
  /** ISO timestamp when the item was last updated */
  updated_at: string;
  /** Whether the item is currently active in the system */
  is_active: boolean;
  /** Whether the item is pending approval or setup */
  is_pending: boolean;
}

/**
 * Response structure for item list requests in dashboard contexts.
 * Contains paginated item data with total count information.
 */
export interface ItemListResponse {
  /** Array of item objects */
  items: ItemResponse[];
  /** Total number of items available */
  total_count: number;
}

/**
 * Family member information used in dashboard member lists.
 * Contains personal details and family membership information.
 */
export interface FamilyMemberResponse {
  /** Unique family member identifier */
  id: number;
  /** ID of the family this member belongs to */
  family_id: number;
  /** Associated user account ID */
  user_id: number;
  /** Member's role in the family */
  role: string;
  /** Member's display name */
  name?: string;
  /** Member's email address */
  email?: string;
  /** Member's phone number */
  phone_number?: string;
  /** Member's age (optional) */
  age?: number;
  /** ISO timestamp when the member was added to the family */
  created_at: string;
}

/**
 * Response structure for family member list requests from dashboard.
 * Contains all family members with their details and metadata.
 */
export interface FamilyMemberListResponse {
  /** ID of the family */
  family_id: number;
  /** Name of the family */
  family_name: string;
  /** Array of family member objects */
  members: FamilyMemberResponse[];
  /** Total number of family members */
  total_count: number;
}

/**
 * Fetches the complete monitoring dashboard data for family administrators.
 * Provides comprehensive overview of all family members and their tag statistics.
 * Used by family admins to monitor overall family activity and tag status.
 *
 * @returns Promise resolving to complete dashboard data including family summary and member details
 * @throws Formatted error if the API request fails or user lacks permission
 */
export const getDashboard = async (): Promise<MonitoringDashboardResponse> => {
  try {
    const response = await apiClient.get('/api/monitoring/dashboard');
    if (!response.data || !response.data.success || !response.data.data) {
      throw new Error('Invalid response format');
    }
    return response.data.data;
  } catch (error) {
    throw formatAxiosError(error);
  }
};

/**
 * Fetches all tags owned by the authenticated user with their current status.
 * Provides personal view of tag ownership and status for individual family members.
 * Used in personal dashboard and tag management screens.
 *
 * @returns Promise resolving to user's personal tag list with status information
 * @throws Formatted error if the API request fails or user is not authenticated
 */
export const getMyTags = async (): Promise<MyTagStatusListResponse> => {
  try {
    const response = await apiClient.get('/api/monitoring/my-tags');
    if (!response.data || !response.data.success || !response.data.data) {
      throw new Error('Invalid response format');
    }
    return response.data.data;
  } catch (error) {
    throw formatAxiosError(error);
  }
};

/**
 * Fetches all items available to the authenticated user.
 * Retrieves items that can be associated with tags for tracking purposes.
 * Used in dashboard contexts for item-tag association and overview.
 *
 * @returns Promise resolving to list of items with their current status
 * @throws Formatted error if the API request fails or user lacks permission
 */
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

/**
 * Fetches all family members for the authenticated user's family.
 * Retrieves member information for dashboard display and family management.
 * Used to show family member lists and their basic information.
 *
 * @returns Promise resolving to list of family members with their details
 * @throws Formatted error if the API request fails or user is not part of a family
 */
export const getFamilyMembers = async (): Promise<FamilyMemberListResponse> => {
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