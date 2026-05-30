/**
 * @fileoverview Input validation utilities for user forms
 *
 * This file provides validation functions for common form inputs in the Smart Scan app,
 * including email, password, and phone number validation. Functions ensure data integrity
 * and provide user-friendly error messages.
 */

/**
 * Validates email address format using regex pattern
 *
 * Checks if the provided email follows standard email format requirements:
 * local-part@domain.tld
 *
 * @param {string} email - The email address to validate
 * @returns {boolean} True if email format is valid, false otherwise
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates password strength and returns detailed feedback
 *
 * Checks password against multiple security requirements:
 * - Minimum 8 characters
 * - At least one letter (a-z, A-Z)
 * - At least one digit (0-9)
 * - At least one special character
 *
 * @param {string} password - The password to validate
 * @returns {Object} Validation result with isValid boolean and error array
 * @returns {boolean} returns.isValid - Whether password meets all requirements
 * @returns {string[]} returns.errors - Array of validation error messages
 */
export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // Check minimum length requirement
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }

  // Check for at least one letter
  if (!/[a-zA-Z]/.test(password)) {
    errors.push('Password must include at least one letter');
  }

  // Check for at least one digit
  if (!/[0-9]/.test(password)) {
    errors.push('Password must include at least one number');
  }

  // Check for at least one special character
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must include at least one special character (!@#$%^&* etc.)');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validates Korean mobile phone number format
 *
 * Checks if phone number follows Korean mobile format: 01X-XXXX-XXXX
 * Accepts phone numbers with or without hyphens.
 *
 * @param {string} phone - The phone number to validate
 * @returns {boolean} True if phone number format is valid, false otherwise
 */
export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^01[0-9][0-9]{8}$/;
  // Remove hyphens before validation
  return phoneRegex.test(phone.replace(/-/g, ''));
};

/**
 * Formats phone number with hyphens for display
 *
 * Takes a raw phone number string and formats it with hyphens
 * in the Korean mobile format: XXX-XXXX-XXXX
 *
 * @param {string} phone - Raw phone number (digits only or with formatting)
 * @returns {string} Formatted phone number with hyphens
 *
 * @example
 * formatPhoneNumber('01012345678') // returns '010-1234-5678'
 * formatPhoneNumber('010123') // returns '010-123'
 */
export const formatPhoneNumber = (phone: string): string => {
  // Extract only digits from input
  const numbers = phone.replace(/[^\d]/g, '');

  // Progressive formatting based on length
  if (numbers.length <= 3) {
    return numbers;
  } else if (numbers.length <= 7) {
    return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
  } else {
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
  }
};