
import SectionTitle from "../components/SectionTitle2";
import useLimitedStock from './../Hooks/useLimitedStock';
import LoadingSpinner from "./LoadingSpinner";
import Card from "../components/ui/Card";
import Table from "../components/ui/Table";
import Badge from "../components/ui/Badge";
import { FiAlertCircle, FiPackage } from "react-icons/fi";

/**
 * Displays assets with limited stock in the dashboard
 */
const LimitedStock = () => {
  const { assets, isLoading } = useLimitedStock();

  // Table columns configuration
  const columns = [
    {
      key: "index",
      header: "#",
      render: (_, index) => <div className="font-medium">{index + 1}</div>,
    },
    {
      key: "product_name",
      header: "Asset Name",
      sortable: true,
      render: (row) => (
        <div className="flex items-center">
          <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center mr-3">
            <FiPackage className="h-4 w-4 text-gray-500" />
          </div>
          <div className="font-medium text-gray-900">{row.product_name}</div>
        </div>
      ),
    },
    {
      key: "product_quantity",
      header: "Quantity",
      sortable: true,
      render: (row) => {
        // Determine badge color based on quantity
        let badgeVariant = "success";
        if (row.product_quantity <= 5) {
          badgeVariant = "error";
        } else if (row.product_quantity <= 10) {
          badgeVariant = "warning";
        }

        return (
          <Badge variant={badgeVariant} size="md">
            {row.product_quantity}
          </Badge>
        );
      },
    },
  ];

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
        title="Limited Stock Items"
        subtitle="Assets that need to be replenished soon"
        align="left"
        accentColor="warning"
      />

      {assets?.length < 1 ? (
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 text-blue-700 flex items-start rounded">
          <FiAlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium">No limited stock items</p>
            <p className="text-sm mt-1">All assets have sufficient quantity in stock.</p>
          </div>
        </div>
      ) : (
        <Table
          columns={columns}
          data={assets}
          pagination={true}
          pageSize={5}
          search={true}
          searchPlaceholder="Search assets..."
          searchKeys={["product_name"]}
          emptyMessage="No limited stock items found"
          hoverable={true}
          striped={true}
        />
      )}
    </Card>
  );
};

export default LimitedStock;