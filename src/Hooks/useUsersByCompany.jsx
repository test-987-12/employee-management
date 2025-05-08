import { useQuery } from "@tanstack/react-query";
import useUserData from "./useUserData";
import { getAllData } from "../firebase/firebaseDB";

function useUsersByCompany() {
    const { userData } = useUserData();
    const companyName = userData?.company_name;

    const {
      data: usersByCompany = [],
      isLoading,
      refetch,
      isError,
      error,
    } = useQuery({
      queryKey: ["usersByCompany", companyName],
      queryFn: async () => {
        if (!companyName) return [];

        const allUsers = await getAllData('users');
        // Filter users by company name
        return allUsers.filter(user =>
          user.company_name === companyName
        );
      },
      enabled: !!companyName,
    });

    return { usersByCompany, isLoading, refetch, isError, error };
  }

  export default useUsersByCompany;