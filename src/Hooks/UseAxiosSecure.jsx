import axios from "axios";

/**
 * Creates an axios instance configured for Firebase Realtime Database
 *
 * This is a simplified version that doesn't require authentication tokens
 * since Firebase RTDB uses a different authentication mechanism.
 */

// Create a single instance of axios to be reused
const axiosSecure = axios.create({
  baseURL: 'https://emp-mgt-system-default-rtdb.firebaseio.com'
});

// Add .json suffix to all requests for Firebase RTDB
axiosSecure.interceptors.request.use(
  (config) => {
    // Add .json suffix to URL if it doesn't already have it
    if (!config.url.endsWith('.json')) {
      config.url = `${config.url}.json`;
    }

    console.log(`Firebase RTDB request: ${config.method.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Log responses for debugging
axiosSecure.interceptors.response.use(
  (response) => {
    console.log(`Firebase RTDB response: ${response.status} ${response.statusText}`);
    return response;
  },
  (error) => {
    console.error("Firebase RTDB error:", error.message);
    return Promise.reject(error);
  }
);

/**
 * Hook that returns the configured axios instance for Firebase RTDB
 */
const UseAxiosSecure = () => {
  return axiosSecure;
};

export default UseAxiosSecure;