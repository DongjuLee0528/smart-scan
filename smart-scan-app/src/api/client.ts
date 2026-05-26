/**
 * @fileoverview Axios HTTP client configuration with authentication interceptors
 *
 * This file configures the main HTTP client for the Smart Scan API, including
 * automatic token attachment, token refresh logic, and error handling.
 * Provides seamless authentication management for all API requests.
 */

import axios, { AxiosInstance, AxiosResponse, AxiosError, AxiosRequestConfig } from 'axios';
import { getAccessToken, getRefreshToken, saveTokens, clearTokens } from '../storage/tokenStorage';

/**
 * Extended Axios request configuration with retry tracking
 *
 * Adds a _retry flag to prevent infinite refresh token loops
 * when authentication fails multiple times.
 */
interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  /** Flag to track if request has been retried after token refresh */
  _retry?: boolean;
}

/** API base URL from environment variables with fallback */
const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'https://smart-scan-tp9k.onrender.com';

/**
 * Dedicated client for token refresh requests
 *
 * Separate client prevents circular dependencies when the main client
 * attempts to refresh tokens during request interceptor processing.
 */
const refreshClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Main API client with authentication and retry logic
 *
 * Configured with request/response interceptors for automatic
 * token management, authentication header injection, and
 * transparent token refresh on 401 errors.
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request interceptor for automatic authentication header injection
 *
 * Automatically adds Bearer tokens to all requests except auth endpoints.
 * Ensures all authenticated API calls include proper authorization headers.
 */
apiClient.interceptors.request.use(async (config) => {
  // Define endpoints that don't require authentication
  const authEndpoints = ['/api/auth/login', '/api/auth/register'];
  const isAuthEndpoint = authEndpoints.some(endpoint => config.url === endpoint);

  // Add authorization header for all non-auth requests
  if (!isAuthEndpoint) {
    const accessToken = await getAccessToken();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
  }
  return config;
});

/**
 * Response interceptor for automatic token refresh on 401 errors
 *
 * Handles authentication failures by attempting to refresh tokens
 * and retry the original request. Provides seamless user experience
 * when access tokens expire during app usage.
 */
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;

    // Handle 401 unauthorized errors with token refresh
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true; // Prevent infinite retry loops

      try {
        const refreshToken = await getRefreshToken();
        if (refreshToken) {
          // Attempt to refresh access token
          const response = await refreshClient.post('/api/auth/refresh', {
            refresh_token: refreshToken,
          });

          const { access_token, refresh_token: newRefreshToken } = response.data;
          await saveTokens(access_token, newRefreshToken);

          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // If refresh fails, clear all tokens and force re-authentication
        try {
          await clearTokens();
        } catch (clearError) {
          console.error('Failed to clear tokens:', clearError);
        }
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;