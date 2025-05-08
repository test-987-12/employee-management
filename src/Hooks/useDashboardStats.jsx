import { useQuery } from "@tanstack/react-query";
import useUserData from "./useUserData";
import { getAllData } from "../firebase/firebaseDB";
import { sortByLatestTimestamp } from "../utils/dateUtils";

/**
 * Hook to fetch dashboard statistics for HR users
 */
function useDashboardStats() {
  const { userData } = useUserData();
  const companyName = userData?.company_name;

  const {
    data: stats = {},
    isLoading,
    refetch,
    isError,
    error,
  } = useQuery({
    queryKey: ["dashboardStats", companyName],
    queryFn: async () => {
      if (!companyName) return {};

      // Get all users, assets, and requests
      const [users, assets, requests] = await Promise.all([
        getAllData('users'),
        getAllData('assets'),
        getAllData('requests')
      ]);

      // Filter by company name
      const companyUsers = users.filter(user => user.company_name === companyName);
      const companyAssets = assets.filter(asset => asset.company_name === companyName);
      const companyRequests = requests.filter(req => req.requester_company === companyName);

      // Calculate total employees
      const totalEmployees = companyUsers.length;

      // Calculate total assets
      const totalAssets = companyAssets.length;

      // Calculate pending requests
      const pendingRequests = companyRequests.filter(req => 
        req.status === "Pending" || req.status === "pending"
      ).length;

      // Calculate approved requests this month
      const now = new Date();
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      
      const approvedThisMonth = companyRequests.filter(req => {
        // Check if request is approved
        if (req.status !== "Approved" && req.status !== "approved") return false;
        
        // Check if approval date is within this month
        const approvalDate = req.approval_date ? new Date(req.approval_date) : null;
        return approvalDate && approvalDate >= firstDayOfMonth;
      }).length;

      // Calculate month-over-month changes (placeholder for now)
      // In a real app, you would compare with last month's data
      const employeeChange = "+2.5%";
      const assetChange = "+3.2%";
      const pendingChange = "-5.1%";
      const approvedChange = "+12.3%";

      return {
        totalEmployees,
        totalAssets,
        pendingRequests,
        approvedThisMonth,
        employeeChange,
        assetChange,
        pendingChange,
        approvedChange
      };
    },
    enabled: !!companyName,
  });

  return { stats, isLoading, refetch, isError, error };
}

export default useDashboardStats;
