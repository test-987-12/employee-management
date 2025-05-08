
import SectionTitle from "../components/SectionTitle2";
import useRequestedAssets from "../Hooks/useRequestedAssets";
import useUserData from "../Hooks/useUserData";
import LoadingSpinner from "./LoadingSpinner";
import Card from "../components/ui/Card";
import { FiAlertCircle, FiTrendingUp } from "react-icons/fi";

/**
 * Displays the top most requested assets in the dashboard
 */
const TopRequestedItems = () => {
  const { userData } = useUserData();
  const { requestedAssets, isLoading } = useRequestedAssets();

  // Filter assets for the user's company
  const filteredRequestedAssets = requestedAssets.filter(
    (asset) => asset.requester_company === userData?.company_name
  );

  // Count occurrences of each asset
  const assetCounts = filteredRequestedAssets.reduce((counts, asset) => {
    counts[asset.asset_name] = (counts[asset.asset_name] || 0) + 1;
    return counts;
  }, {});

  // Sort by count and take top 5
  const sortedAssetCounts = Object.entries(assetCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // Calculate total requests for percentage calculation
  const totalRequests = sortedAssetCounts.reduce((sum, [_, count]) => sum + count, 0);

  if (isLoading) {
    return (
      <Card className="flex items-center justify-center min-h-[200px]">
        <LoadingSpinner size="lg" />
      </Card>
    );
  }

  return (
    <Card>
      <SectionTitle
        title="Top Requested Items"
        subtitle="Most frequently requested assets"
        align="left"
        accentColor="secondary"
      />

      {sortedAssetCounts.length < 1 ? (
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 text-blue-700 flex items-start rounded">
          <FiAlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium">No requested items</p>
            <p className="text-sm mt-1">There are no asset requests to analyze.</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedAssetCounts.map(([assetName, count], index) => {
            // Calculate percentage of total requests
            const percentage = totalRequests ? Math.round((count / totalRequests) * 100) : 0;

            // Determine color based on ranking
            const colors = [
              "bg-primary-500",
              "bg-secondary-500",
              "bg-purple-500",
              "bg-indigo-500",
              "bg-blue-500"
            ];

            return (
              <div key={index} className="relative">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-700">{index + 1}.</span>
                    <span className="ml-2 text-sm font-medium text-gray-900">{assetName}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-900">{count}</span>
                    <span className="ml-1 text-xs text-gray-500">requests</span>
                    <span className="ml-2 flex items-center text-xs font-medium text-primary-600">
                      <FiTrendingUp className="mr-1 h-3 w-3" />
                      {percentage}%
                    </span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className={`${colors[index % colors.length]} h-2.5 rounded-full`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
};

export default TopRequestedItems;