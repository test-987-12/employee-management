
import { useQuery } from "@tanstack/react-query";
import { getAllData } from "../firebase/firebaseDB";
import { sortByLatestTimestamp } from "../utils/dateUtils";

function useAssets() {
  const {
    data: assets = [],
    isLoading,
    refetch,
    isError,
    error,
  } = useQuery({
    queryKey: ["assets"],
    queryFn: async () => {
      const assetsData = await getAllData('assets');
      // Sort assets by latest timestamp (created_date or updated_date)
      const sortedData = sortByLatestTimestamp(
        assetsData || [],
        ['updated_date', 'created_date']
      );
      return sortedData;
    },
  });

  return { assets, isLoading, refetch, isError, error };
}

export default useAssets;