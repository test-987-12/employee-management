// Firebase Realtime Database utility functions
import { ref, set, push, get, update, remove, query, orderByChild, equalTo } from "firebase/database";
import { database } from "./firebase.config";

/**
 * Create a new record with auto-generated ID
 * @param {string} path - Database path
 * @param {object} data - Data to save
 * @returns {Promise<{id: string}>} - Object with the generated ID
 */
export const createData = async (path, data) => {
  try {
    const newRef = push(ref(database, path));
    await set(newRef, data);
    return { id: newRef.key, ...data };
  } catch (error) {
    console.error(`Error creating data at ${path}:`, error);
    throw error;
  }
};

/**
 * Create or update a record with a specific ID
 * @param {string} path - Database path
 * @param {string} id - Record ID
 * @param {object} data - Data to save
 * @returns {Promise<{id: string}>} - Object with the ID
 */
export const setData = async (path, id, data) => {
  try {
    await set(ref(database, `${path}/${id}`), data);
    return { id, ...data };
  } catch (error) {
    console.error(`Error setting data at ${path}/${id}:`, error);
    throw error;
  }
};

/**
 * Get all records from a path
 * @param {string} path - Database path
 * @returns {Promise<Array>} - Array of records with IDs
 */
export const getAllData = async (path) => {
  try {
    const snapshot = await get(ref(database, path));
    if (snapshot.exists()) {
      const data = snapshot.val();
      return Object.keys(data).map(key => ({
        id: key,
        ...data[key]
      }));
    }
    return [];
  } catch (error) {
    console.error(`Error getting data from ${path}:`, error);
    throw error;
  }
};

/**
 * Get a single record by ID
 * @param {string} path - Database path
 * @param {string} id - Record ID
 * @returns {Promise<object|null>} - Record with ID or null
 */
export const getDataById = async (path, id) => {
  try {
    const snapshot = await get(ref(database, `${path}/${id}`));
    if (snapshot.exists()) {
      return {
        id,
        ...snapshot.val()
      };
    }
    return null;
  } catch (error) {
    console.error(`Error getting data by ID from ${path}/${id}:`, error);
    throw error;
  }
};

/**
 * Get records by a field value
 * @param {string} path - Database path
 * @param {string} field - Field to query
 * @param {any} value - Value to match
 * @returns {Promise<Array>} - Array of matching records
 */
export const getDataByField = async (path, field, value) => {
  try {
    // Instead of using orderByChild and equalTo which require indexes,
    // we'll get all data and filter it in memory
    const snapshot = await get(ref(database, path));

    if (snapshot.exists()) {
      const data = snapshot.val();
      const result = [];

      // Manually filter the data
      for (const key in data) {
        if (data[key][field] === value) {
          result.push({
            id: key,
            ...data[key]
          });
        }
      }

      return result;
    }
    return [];
  } catch (error) {
    console.error(`Error getting data by field from ${path}:`, error);
    throw error;
  }
};

/**
 * Update specific fields of a record
 * @param {string} path - Database path
 * @param {string} id - Record ID
 * @param {object} data - Fields to update
 * @returns {Promise<{success: boolean}>} - Success status
 */
export const updateData = async (path, id, data) => {
  try {
    await update(ref(database, `${path}/${id}`), data);
    return { success: true };
  } catch (error) {
    console.error(`Error updating data at ${path}/${id}:`, error);
    throw error;
  }
};

/**
 * Delete a record
 * @param {string} path - Database path
 * @param {string} id - Record ID
 * @returns {Promise<{success: boolean}>} - Success status
 */
export const deleteData = async (path, id) => {
  try {
    await remove(ref(database, `${path}/${id}`));
    return { success: true };
  } catch (error) {
    console.error(`Error deleting data at ${path}/${id}:`, error);
    throw error;
  }
};

/**
 * Get data by email (common use case)
 * @param {string} path - Database path
 * @param {string} email - Email to search for
 * @returns {Promise<object|null>} - First matching record or null
 */
export const getDataByEmail = async (path, email) => {
  try {
    // Get all data and filter by email
    const snapshot = await get(ref(database, path));

    if (snapshot.exists()) {
      const data = snapshot.val();

      // Find the first record with matching email
      for (const key in data) {
        if (data[key].email === email) {
          return {
            id: key,
            ...data[key]
          };
        }
      }
    }
    return null;
  } catch (error) {
    console.error(`Error getting data by email from ${path}:`, error);
    throw error;
  }
};

/**
 * Get data filtered by company name
 * @param {string} path - Database path
 * @param {string} companyName - Company name to filter by
 * @returns {Promise<Array>} - Array of matching records
 */
export const getDataByCompany = async (path, companyName) => {
  try {
    // Get all data and filter by company_name
    const snapshot = await get(ref(database, path));

    if (snapshot.exists()) {
      const data = snapshot.val();
      const result = [];

      // Find all records with matching company_name
      for (const key in data) {
        if (data[key].company_name === companyName) {
          result.push({
            id: key,
            ...data[key]
          });
        }
      }

      return result;
    }
    return [];
  } catch (error) {
    console.error(`Error getting data by company from ${path}:`, error);
    throw error;
  }
};
