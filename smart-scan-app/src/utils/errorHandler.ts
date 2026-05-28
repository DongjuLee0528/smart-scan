/**
 * @fileoverview Error handling utilities for API requests
 *
 * This file provides centralized error handling for API requests, including
 * error formatting, user-friendly message generation, and axios error processing.
 * Used throughout the app to provide consistent error handling and user feedback.
 */

import axios from 'axios';

/**
 * Standardized API error interface
 *
 * Defines the structure for API errors throughout the application,
 * providing consistent error handling and debugging information.
 *
 * @interface ApiError
 */
export interface ApiError {
  /** Error code for categorizing error types */
  code?: string;
  /** HTTP response information */
  response?: {
    /** HTTP status code */
    status: number;
    /** Response data containing error details */
    data?: {
      /** Detailed error message from server */
      detail?: string;
    };
  };
  /** Human-readable error message */
  message?: string;
}

/**
 * Converts API errors into user-friendly messages
 *
 * Takes raw API errors and returns appropriate user-facing error messages
 * based on error codes, status codes, and server responses. Provides localized
 * error messages for common scenarios.
 *
 * @param {ApiError} error - The API error to process
 * @returns {string} User-friendly error message in Korean
 */
export const handleApiError = (error: ApiError): string => {
  // Handle network connectivity issues
  if (error.code === 'NETWORK_ERROR' || !error.response) {
    return 'Please check your network connection.';
  }

  // Handle authentication errors
  if (error.response.status === 401) {
    return 'Authentication required. Please log in.';
  }

  // Handle server errors
  if (error.response.status >= 500) {
    return 'Server error occurred. Please try again later.';
  }

  // Use detailed error message from server if available
  if (error.response.data?.detail) {
    return error.response.data.detail;
  }

  // Default error message for unknown errors
  return 'An error occurred while processing your request.';
};

/**
 * Formats axios errors into standardized ApiError structure
 *
 * Transforms axios-specific error objects into our standardized ApiError
 * interface. Handles network timeouts and connection issues by mapping
 * them to appropriate error codes.
 *
 * @param {any} error - Raw error object from axios or other sources
 * @returns {ApiError} Formatted error object with consistent structure
 */
export const formatAxiosError = (error: any): ApiError => {
  // Check if error is from axios
  if (axios.isAxiosError(error)) {
    return {
      // Map connection aborted errors to network error
      code: error.code === 'ECONNABORTED' ? 'NETWORK_ERROR' : error.code,
      response: error.response,
      message: error.message,
    };
  }
  // Return error as-is if not from axios
  return error;
};