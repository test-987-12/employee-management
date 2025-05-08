import axios from "axios";

/**
 * Creates an axios instance configured for Firebase Realtime Database
 * for public (unauthenticated) requests
 */
const axiosPublic = axios.create({
  baseURL: 'https://emp-mgt-system-default-rtdb.firebaseio.com'
});

// Add .json suffix to all requests for Firebase RTDB
axiosPublic.interceptors.request.use(
  (config) => {
    // Add .json suffix to URL if it doesn't already have it
    if (!config.url.endsWith('.json')) {
      config.url = `${config.url}.json`;
    }

    console.log(`Firebase RTDB public request: ${config.method.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Log responses and transform Firebase RTDB responses
axiosPublic.interceptors.response.use(
  (response) => {
    console.log(`Firebase RTDB public response: ${response.status} ${response.statusText}`);

    // For POST requests to Firebase RTDB, the response contains a "name" property
    // which is the auto-generated ID. Transform this to match expected format.
    if (response.config.method === 'post' && response.data && response.data.name) {
      console.log(`Firebase RTDB created record with ID: ${response.data.name}`);
      // Transform to a format similar to MongoDB's insertedId
      response.data = {
        ...response.data,
        insertedId: response.data.name
      };
    }

    return response;
  },
  (error) => {
    console.error("Firebase RTDB public error:", error.message);
    return Promise.reject(error);
  }
);

/**
 * Hook that returns the configured axios instance for Firebase RTDB public requests
 */
const useAxiosPublic = () => {
  return axiosPublic;
};

export default useAxiosPublic;