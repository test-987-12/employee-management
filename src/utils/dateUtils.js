/**
 * Utility functions for date and timestamp handling
 */

/**
 * Format a date string for display
 * @param {string} dateString - ISO date string
 * @returns {string} - Formatted date string (DD/MM/YYYY)
 */
export const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const options = { day: "2-digit", month: "2-digit", year: "numeric" };
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, options);
};

/**
 * Get the latest timestamp from an object with multiple timestamp fields
 * @param {Object} obj - Object with timestamp fields
 * @param {Array<string>} fields - Array of field names to check
 * @returns {Date|null} - Latest timestamp as Date object or null if no valid timestamps
 */
export const getLatestTimestamp = (obj, fields) => {
  if (!obj || !fields || !fields.length) return null;
  
  // Filter valid timestamps and convert to Date objects
  const timestamps = fields
    .filter(field => obj[field])
    .map(field => new Date(obj[field]));
  
  if (timestamps.length === 0) return null;
  
  // Return the most recent timestamp
  return new Date(Math.max(...timestamps.map(date => date.getTime())));
};

/**
 * Sort an array of objects by their latest timestamp
 * @param {Array<Object>} data - Array of objects with timestamp fields
 * @param {Array<string>} timestampFields - Array of field names to check for timestamps
 * @param {boolean} descending - Whether to sort in descending order (newest first)
 * @returns {Array<Object>} - Sorted array
 */
export const sortByLatestTimestamp = (data, timestampFields, descending = true) => {
  if (!data || !data.length) return [];
  
  return [...data].sort((a, b) => {
    const timestampA = getLatestTimestamp(a, timestampFields);
    const timestampB = getLatestTimestamp(b, timestampFields);
    
    // Handle cases where one or both items don't have valid timestamps
    if (!timestampA && !timestampB) return 0;
    if (!timestampA) return 1;
    if (!timestampB) return -1;
    
    // Sort by timestamp
    const comparison = timestampA.getTime() - timestampB.getTime();
    return descending ? -comparison : comparison;
  });
};
