/**
 * @fileoverview Device API module for managing smart scan device registration and connectivity.
 * Handles device registration, unlinking, and status management for NFC scanning devices.
 * Provides functionality to associate physical scanning devices with user accounts for
 * tag detection and monitoring capabilities within the family smart scan system.
 */

import apiClient from './client';
import { formatAxiosError } from '../utils/errorHandler';

/**
 * Device information response from the server.
 * Contains details about a registered smart scan device and its current status.
 */
export interface DeviceResponse {
  /** Unique identifier for the device record */
  id: number;
  /** Device identifier string */
  device_id: string;
  /** ID of the user this device is registered to */
  user_id: number;
  /** Physical device serial number */
  serial_number: string;
  /** Current status of the device (active, inactive, etc.) */
  status: string;
  /** ISO timestamp when the device was registered */
  created_at: string;
  /** ISO timestamp when the device was last updated */
  updated_at: string;
}

/**
 * Response structure for fetching the current user's registered device.
 * May contain device information if a device is registered, or be empty if not.
 */
export interface MyDeviceResponse {
  /** Device information if one is registered to the user */
  device?: DeviceResponse;
  /** ISO timestamp when this response was created */
  created_at: string;
}

/**
 * Request structure for registering a new device to the user's account.
 * Contains the serial number required for device identification and validation.
 */
export interface RegisterDeviceRequest {
  /** Serial number of the device to register */
  serial: string;
}

/**
 * Fetches the device currently registered to the authenticated user.
 * Returns device information if one is registered, or null if no device is associated.
 * Used to check device registration status and display current device information.
 *
 * @returns Promise resolving to device information or null if no device is registered
 * @throws Formatted error if the API request fails or user is not authenticated
 */
export const getMyDevice = async (): Promise<MyDeviceResponse | null> => {
  try {
    const response = await apiClient.get('/api/devices/me');
    if (!response.data) {
      throw new Error('Invalid response format');
    }
    return response.data.data;
  } catch (error) {
    throw formatAxiosError(error);
  }
};

/**
 * Registers a new smart scan device to the authenticated user's account.
 * Associates the device with the user for tag scanning and monitoring capabilities.
 * The device must be valid and not already registered to another user.
 *
 * @param serial - Serial number of the device to register
 * @returns Promise resolving to the registered device information
 * @throws Formatted error if registration fails, device is invalid, or already registered
 */
export const registerDevice = async (serial: string): Promise<DeviceResponse> => {
  try {
    const response = await apiClient.post('/api/devices/register', { serial });
    if (!response.data || !response.data.data) {
      throw new Error('Invalid response format');
    }
    return response.data.data;
  } catch (error) {
    throw formatAxiosError(error);
  }
};

/**
 * Unlinks the currently registered device from the authenticated user's account.
 * Removes the association between the user and their device, disabling tag scanning
 * capabilities. The device becomes available for registration by other users.
 *
 * @returns Promise resolving to true if the device was successfully unlinked
 * @throws Formatted error if unlinking fails or no device is currently registered
 */
export const unlinkDevice = async (): Promise<boolean> => {
  try {
    const response = await apiClient.delete('/api/devices/unlink');
    if (!response.data) {
      throw new Error('Invalid response format');
    }
    return true;
  } catch (error) {
    throw formatAxiosError(error);
  }
};