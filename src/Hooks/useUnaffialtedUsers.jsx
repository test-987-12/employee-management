import { useQuery } from "@tanstack/react-query";
import { getAllData } from "../firebase/firebaseDB";

function useUnaffiliatedUsers() {
    const {
      data: unaffiliatedUsers = [],
      isLoading,
      refetch,
      isError,
      error,
    } = useQuery({
      queryKey: ["unaffiliatedUsers"],
      queryFn: async () => {
        const allUsers = await getAllData('users');
        // Filter users where company_name is not present
        return allUsers.filter(user => !user.company_name);
      },
    });

    return { unaffiliatedUsers, isLoading, refetch, isError, error };
  }

export default useUnaffiliatedUsers;