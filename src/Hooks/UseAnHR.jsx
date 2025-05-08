// Example: useAnHR.jsx

import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { AuthContext } from "../Providers/AuthProvider";
import { getDataByEmail } from "../firebase/firebaseDB";

function useAnHR() {
    const { user } = useContext(AuthContext);

    const { data: isHR, isLoading: isHRLoading, error: isHRError } = useQuery({
        queryKey: [user?.email, "hr"],
        enabled: !!user?.email,
        queryFn: async () => {
            try {
                const userData = await getDataByEmail('users', user.email);
                // Check if the user has the HR role
                return userData?.role === 'hr';
            } catch (error) {
                console.error("Error in useAnHR:", error);
                // Default to false if there's an error
                return false;
            }
        },
        retry: 1 // Only retry once to avoid excessive retries on permanent errors
    });

    if (isHRError) {
        console.error("Error fetching HR status:", isHRError);
    }

    return { isHR, isHRLoading };
}

export default useAnHR;
