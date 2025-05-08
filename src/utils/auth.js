/**
 * Utility functions for authentication
 */

/**
 * Check if the user is authenticated by looking for a token in localStorage
 * @returns {boolean} True if the user is authenticated
 */
export const isAuthenticated = () => {
  const token = localStorage.getItem('access-token');
  return !!token;
};

/**
 * Set the authentication token in localStorage
 * @param {string} token - The authentication token
 */
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('access-token', token);
    console.log('Token set in localStorage');
  } else {
    console.warn('Attempted to set null or undefined token');
  }
};

/**
 * Get the authentication token from localStorage
 * @returns {string|null} The authentication token or null if not found
 */
export const getAuthToken = () => {
  return localStorage.getItem('access-token');
};

/**
 * Remove the authentication token from localStorage
 */
export const removeAuthToken = () => {
  localStorage.removeItem('access-token');
  console.log('Token removed from localStorage');
};
