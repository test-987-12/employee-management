

import { useContext } from "react";
import { AuthContext } from "../Providers/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import { getDataByEmail } from "../firebase/firebaseDB";

const useUserData = () => {
  const { user } = useContext(AuthContext);

  const {
    data: userData = {},
    isLoading,
    refetch,
    isError,
    error,
  } = useQuery({
    queryKey: ["userData", user?.email],
    queryFn: async () => {
      if (user?.email) {
        try {
          const userData = await getDataByEmail('users', user.email);
          return userData || {}; // Return empty object if no user data found
        } catch (error) {
          console.error("Error in useUserData:", error);
          // Return a default user object with the email to prevent further errors
          return {
            email: user.email,
            name: user.displayName || 'User',
            role: 'employee' // Default role
          };
        }
      }
      return {};
    },
    enabled: !!user?.email,
    onError: (err) => {
      console.log("Error fetching user data:", err);
    },
    retry: 1, // Only retry once to avoid excessive retries on permanent errors
  });

  return { userData, isLoading, refetch, isError, error };
};

export default useUserData;