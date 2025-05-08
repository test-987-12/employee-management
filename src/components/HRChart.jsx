
import { Cell, Legend, Pie, PieChart, Tooltip, ResponsiveContainer } from "recharts";
import SectionTitle from "../components/SectionTitle2";
import useRequestedAssets from "../Hooks/useRequestedAssets";
import useUserData from "../Hooks/useUserData";
import LoadingSpinner from "./LoadingSpinner";
import Card from "../components/ui/Card";
import { FiAlertCircle } from "react-icons/fi";

/**
 * Chart component displaying asset request types
 */
const HRChart = () => {
  const { userData } = useUserData();
  const { requestedAssets, isLoading } = useRequestedAssets();

  if (isLoading) {
    return (
      <Card className="flex items-center justify-center min-h-[300px]">
        <LoadingSpinner size="lg" />
      </Card>
    );
  }

  // Filter assets for the user's company
  const filteredRequestedAssets = requestedAssets.filter(
    (asset) => asset.requester_company === userData?.company_name
  );

  // Check if assets have the required field
  const hasAssetTypeField = filteredRequestedAssets.some(
    (asset) => "asset_type" in asset
  );

  if (!hasAssetTypeField && filteredRequestedAssets.length > 0) {
    return (
      <Card>
        <SectionTitle
          title="Asset Type Distribution"
          subtitle="Breakdown of assets by type"
          align="left"
          accentColor="primary"
        />
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 text-yellow-700 flex items-start rounded">
          <FiAlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium">Missing data</p>
            <p className="text-sm mt-1">Asset type information is not available for the requested items.</p>
          </div>
        </div>
      </Card>
    );
  }

  // Count asset types
  const assetTypeCount = filteredRequestedAssets.reduce(
    (acc, asset) => {
      const type = asset.asset_type || "Other";
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    },
    {}
  );

  // Convert to array for chart
  const assetTypes = Object.keys(assetTypeCount);
  const colors = ["#1890ff", "#2f54eb", "#13c2c2", "#52c41a", "#faad14", "#f5222d"];

  // Prepare chart data
  const data = assetTypes.map((type, index) => ({
    name: type,
    value: assetTypeCount[type],
    color: colors[index % colors.length]
  }));

  // Calculate total and percentages
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const dataWithPercentage = data.map(item => ({
    ...item,
    percentage: total ? Math.round((item.value / total) * 100) : 0
  }));

  return (
    <Card>
      <SectionTitle
        title="Asset Type Distribution"
        subtitle="Breakdown of assets by type"
        align="left"
        accentColor="primary"
      />

      {filteredRequestedAssets?.length < 1 ? (
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 text-blue-700 flex items-start rounded">
          <FiAlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium">No data available</p>
            <p className="text-sm mt-1">There are no asset requests to analyze.</p>
          </div>
        </div>
      ) : (
        <div className="mt-4">
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dataWithPercentage}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percentage }) => `${name}: ${percentage}%`}
                >
                  {dataWithPercentage.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [`${value} (${dataWithPercentage.find(item => item.name === name)?.percentage}%)`, name]}
                  contentStyle={{
                    backgroundColor: 'white',
                    borderRadius: '0.375rem',
                    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
                    border: 'none',
                    padding: '0.5rem 1rem'
                  }}
                />
                <Legend
                  layout="horizontal"
                  verticalAlign="bottom"
                  align="center"
                  formatter={(value, entry) => {
                    const item = dataWithPercentage.find(d => d.name === value);
                    return <span style={{ color: '#333', fontSize: '0.875rem' }}>
                      {value}: {item?.value} ({item?.percentage}%)
                    </span>;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Stats summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {Object.entries(assetTypeCount).slice(0, 6).map(([type, count], index) => {
              const item = dataWithPercentage.find(d => d.name === type);
              const color = colors[index % colors.length];
              return (
                <div key={type} className={`bg-gray-50 p-4 rounded-lg border-l-4`} style={{ borderColor: color }}>
                  <p className="text-sm font-medium text-gray-500">{type}</p>
                  <p className="mt-1 text-2xl font-semibold" style={{ color }}>{count}</p>
                  <p className="text-sm" style={{ color }}>
                    {item?.percentage || 0}% of total
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </Card>
  );
};

export default HRChart;