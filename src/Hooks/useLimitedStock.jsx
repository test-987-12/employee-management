
import { useQuery } from "@tanstack/react-query";
import useUserData from "./useUserData";
import { getAllData } from "../firebase/firebaseDB";
import { sortByLatestTimestamp } from "../utils/dateUtils";

function useLimitedStock() {
    const { userData } = useUserData();
    const companyName = userData?.company_name;

    const {
      data: assets = [],
      isLoading,
      refetch,
      isError,
      error,
    } = useQuery({
      queryKey: ["limited-stock", companyName],
      queryFn: async () => {
        if (!companyName) return [];

        const allAssets = await getAllData('assets');
        // Filter assets by company name and low quantity (less than 5)
        const filteredAssets = allAssets.filter(asset =>
          asset.company_name === companyName &&
          asset.product_quantity < 5
        );

        // Sort by latest timestamp
        return sortByLatestTimestamp(
          filteredAssets,
          ['updated_date', 'created_date']
        );
      },
      enabled: !!companyName,
    });

    return { assets, isLoading, refetch, isError, error };
  }

  export default useLimitedStock;