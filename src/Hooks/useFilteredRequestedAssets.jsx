import { useQuery } from "@tanstack/react-query";
import useUserData from "./useUserData";
import { getAllData } from "../firebase/firebaseDB";
import { sortByLatestTimestamp } from "../utils/dateUtils";

function useFilteredRequestedAssets() {
    const { userData, isLoading: isUserDataLoading } = useUserData();

    const {
      data: requestedAssets = [],
      isLoading,
      refetch,
      isError,
      error,
    } = useQuery({
      queryKey: ["userRequestedAssets", userData?.email],
      queryFn: async () => {
        if (!userData?.email) return [];

        const allRequests = await getAllData('requests');
        // Filter requests by the user's email
        const filteredRequests = allRequests.filter(request =>
          request.requester_email === userData.email
        );

        // Sort by latest timestamp
        return sortByLatestTimestamp(
          filteredRequests,
          ['approval_date', 'request_date']
        );
      },
      enabled: !!userData?.email,
    });

    return {
      requestedAssets,
      isLoading,
      refetch,
      isError,
      error,
      isUserDataLoading,
    };
  }

  export default useFilteredRequestedAssets;