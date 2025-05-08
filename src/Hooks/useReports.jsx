import { useQuery } from "@tanstack/react-query";
import useUserData from "./useUserData";
import { getAllData } from "../firebase/firebaseDB";

/**
 * Hook to generate reports based on assets and requests data
 */
const useReports = (reportType = "assets") => {
  const { userData } = useUserData();
  const companyName = userData?.company_name;

  const {
    data: reportData = {},
    isLoading,
    refetch,
    isError,
    error,
  } = useQuery({
    queryKey: ["reports", companyName, reportType],
    enabled: !!companyName,
    queryFn: async () => {
      // Get all data based on report type
      if (reportType === "assets") {
        const assets = await getAllData('assets');
        const companyAssets = assets.filter(asset => asset.company_name === companyName);

        // Calculate asset statistics
        const totalAssets = companyAssets.length;
        const lowStockAssets = companyAssets.filter(asset => asset.product_quantity < 5).length;

        return {
          totalAssets,
          lowStockAssets,
          assetList: companyAssets
        };
      }
      else if (reportType === "requests") {
        const requests = await getAllData('requests');
        const companyRequests = requests.filter(req => req.requester_company === companyName);

        // Calculate request statistics
        const totalRequests = companyRequests.length;
        const pendingRequests = companyRequests.filter(req => req.status === "Pending").length;
        const approvedRequests = companyRequests.filter(req => req.status === "Approved").length;
        const rejectedRequests = companyRequests.filter(req => req.status === "Rejected").length;

        return {
          totalRequests,
          pendingRequests,
          approvedRequests,
          rejectedRequests,
          requestList: companyRequests
        };
      }

      return {};
    }
  });

  return { reportData, isLoading, refetch, isError, error };
};

export default useReports;
