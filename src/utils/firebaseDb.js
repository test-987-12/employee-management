import { getDatabase, ref, set, get, push, update, remove, query, orderByChild, equalTo } from "firebase/database";
import { app } from "../firebase/firebase.config";

// Initialize the Firebase Realtime Database
const db = getDatabase(app);

/**
 * Firebase Realtime Database utility functions
 */
const firebaseDb = {
  /**
   * Create a new record in the specified path
   * @param {string} path - Database path (e.g., 'users')
   * @param {object} data - Data to save
   * @returns {Promise<string>} - ID of the created record
   */
  create: async (path, data) => {
    try {
      // Generate a new unique key
      const newRef = push(ref(db, path));
      // Save data with the generated key
      await set(newRef, data);
      console.log(`Created new record at ${path}/${newRef.key}`);
      return newRef.key;
    } catch (error) {
      console.error(`Error creating record at ${path}:`, error);
      throw error;
    }
  },

  /**
   * Create a record with a specific ID
   * @param {string} path - Database path (e.g., 'users/userId')
   * @param {object} data - Data to save
   * @returns {Promise<void>}
   */
  set: async (path, data) => {
    try {
      await set(ref(db, path), data);
      console.log(`Set record at ${path}`);
    } catch (error) {
      console.error(`Error setting record at ${path}:`, error);
      throw error;
    }
  },

  /**
   * Get a record or collection from the specified path
   * @param {string} path - Database path (e.g., 'users' or 'users/userId')
   * @returns {Promise<object|null>} - The data at the specified path
   */
  get: async (path) => {
    try {
      const snapshot = await get(ref(db, path));
      if (snapshot.exists()) {
        console.log(`Retrieved data from ${path}`);
        return snapshot.val();
      } else {
        console.log(`No data found at ${path}`);
        return null;
      }
    } catch (error) {
      console.error(`Error getting data from ${path}:`, error);
      throw error;
    }
  },

  /**
   * Update a record at the specified path
   * @param {string} path - Database path (e.g., 'users/userId')
   * @param {object} data - Data to update (partial update)
   * @returns {Promise<void>}
   */
  update: async (path, data) => {
    try {
      await update(ref(db, path), data);
      console.log(`Updated record at ${path}`);
    } catch (error) {
      console.error(`Error updating record at ${path}:`, error);
      throw error;
    }
  },

  /**
   * Delete a record at the specified path
   * @param {string} path - Database path (e.g., 'users/userId')
   * @returns {Promise<void>}
   */
  delete: async (path) => {
    try {
      await remove(ref(db, path));
      console.log(`Deleted record at ${path}`);
    } catch (error) {
      console.error(`Error deleting record at ${path}:`, error);
      throw error;
    }
  },

  /**
   * Query records by a specific field value
   * @param {string} path - Database path (e.g., 'users')
   * @param {string} field - Field to query by (e.g., 'email')
   * @param {any} value - Value to match
   * @returns {Promise<object|null>} - Matching records
   */
  queryByField: async (path, field, value) => {
    try {
      const dbQuery = query(ref(db, path), orderByChild(field), equalTo(value));
      const snapshot = await get(dbQuery);
      
      if (snapshot.exists()) {
        console.log(`Query found results at ${path} where ${field} = ${value}`);
        return snapshot.val();
      } else {
        console.log(`No results found at ${path} where ${field} = ${value}`);
        return null;
      }
    } catch (error) {
      console.error(`Error querying ${path} where ${field} = ${value}:`, error);
      throw error;
    }
  }
};

export default firebaseDb;
