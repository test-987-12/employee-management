
import { useQuery } from "@tanstack/react-query";
import { getAllData } from "../firebase/firebaseDB";
import { sortByLatestTimestamp } from "../utils/dateUtils";

function useRequestedAssets() {
    const {
      data: requestedAssets = [],
      isLoading,
      refetch,
      isError,
      error,
    } = useQuery({
      queryKey: ["requestedAssets"],
      queryFn: async () => {
        const requestsData = await getAllData('requests');
        // Sort requests by latest timestamp (approval_date, request_date)
        const sortedData = sortByLatestTimestamp(
          requestsData || [],
          ['approval_date', 'request_date']
        );
        return sortedData;
      },
    });

    return { requestedAssets, isLoading, refetch, isError, error };
  }

  export default useRequestedAssets;