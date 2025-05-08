import { useQuery } from "@tanstack/react-query";
import { getDataByField } from "../firebase/firebaseDB";
import useUserData from "./useUserData";
import { sortByLatestTimestamp } from "../utils/dateUtils";

/**
 * Hook to fetch assets assigned to the current user
 */
function useUserAssets() {
  const { userData, isLoading: isUserDataLoading } = useUserData();

  const {
    data: userAssets = [],
    isLoading,
    refetch,
    isError,
    error,
  } = useQuery({
    queryKey: ["userAssets", userData?.email],
    queryFn: async () => {
      if (!userData?.email) return [];

      // Get assets assigned to this user by email
      const assets = await getDataByField('user_assets', 'user_id', userData.email);

      // Sort by latest timestamp (assigned_date)
      const sortedAssets = sortByLatestTimestamp(
        assets || [],
        ['assigned_date']
      );

      return sortedAssets;
    },
    enabled: !!userData?.email,
  });

  return {
    userAssets,
    isLoading: isLoading || isUserDataLoading,
    refetch,
    isError,
    error,
  };
}

export default useUserAssets;
