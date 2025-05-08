import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { AuthContext } from "../Providers/AuthProvider";
import { getDataByEmail } from "../firebase/firebaseDB";

const useEmployee = () => {
    const { user, loading } = useContext(AuthContext);

    const {
        data: userDataEmployee = {},
        isLoading,
        refetch: refetchEmployee
    } = useQuery({
        queryKey: ["userDataEmployee", user?.email],
        enabled: !loading && !!user?.email,
        queryFn: async () => {
            try {
                const userData = await getDataByEmail('users', user.email);
                return userData || {}; // Return empty object if no user data found
            } catch (error) {
                console.error("Error in useEmployee:", error);
                // Return a default user object with the email to prevent further errors
                return {
                    email: user.email,
                    name: user.displayName || 'User',
                    role: 'employee' // Default role
                };
            }
        },
        retry: 1, // Only retry once to avoid excessive retries on permanent errors
    });

    return { userDataEmployee, isLoading, refetchEmployee }
};

export default useEmployee