/**
 * @fileoverview Items API module for managing trackable items in the smart scan system.
 * Provides CRUD operations for items that can be associated with NFC tags for tracking.
 * Handles item creation, updating, deletion, and listing with optional label categorization
 * for organized item management within families.
 */

import apiClient from './client';
import { formatAxiosError } from '../utils/errorHandler';

/**
 * Item information response from the server.
 * Represents a physical item that can be tracked using NFC tags.
 */
export interface ItemResponse {
  /** Unique identifier for the item */
  id: number;
  /** Human-readable name of the item */
  name: string;
  /** Optional category label ID for item organization */
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
 * Response structure for item list requests.
 * Contains paginated item data with total count for UI pagination.
 */
export interface ItemListResponse {
  /** Array of item objects */
  items: ItemResponse[];
  /** Total number of items available */
  total_count: number;
}

/**
 * Request structure for creating a new item.
 * Contains the minimum required information to create a trackable item.
 */
export interface ItemAddRequest {
  /** Name of the item to create */
  name: string;
  /** Optional label category ID for item classification */
  label_id?: number;
}

/**
 * Request structure for updating an existing item.
 * All fields are optional, allowing partial updates of item information.
 */
export interface ItemUpdateRequest {
  /** New name for the item */
  name?: string;
  /** New label category ID for the item */
  label_id?: number;
}

/**
 * Fetches all items available to the authenticated user.
 * Retrieves items that belong to the user's family and can be associated with NFC tags
 * for tracking purposes. Items are returned with their current status and metadata.
 *
 * @returns Promise resolving to list of items with their details and total count
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
 * Creates a new trackable item in the smart scan system.
 * Adds an item that can be associated with NFC tags for tracking within the family.
 * The item will be available for tag association and monitoring.
 *
 * @param name - Human-readable name for the item
 * @param labelId - Optional category label ID for item organization
 * @returns Promise resolving to the created item with its assigned ID and metadata
 * @throws Formatted error if creation fails, name is invalid, or user lacks permission
 */
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

/**
 * Updates an existing item's information.
 * Allows partial updates of item details including name and label category.
 * Only provided fields will be updated, leaving others unchanged.
 *
 * @param itemId - Unique identifier of the item to update
 * @param name - New name for the item (optional)
 * @param labelId - New label category ID for the item (optional)
 * @returns Promise resolving to the updated item information
 * @throws Formatted error if update fails, item not found, or user lacks permission
 */
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

/**
 * Deletes an item from the smart scan system.
 * Removes the item and all its associations with NFC tags. This action cannot be undone.
 * Items with active tags may need to have their tags unlinked first before deletion.
 *
 * @param itemId - Unique identifier of the item to delete
 * @returns Promise resolving to true if the item was successfully deleted
 * @throws Formatted error if deletion fails, item not found, item has active tags, or user lacks permission
 */
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