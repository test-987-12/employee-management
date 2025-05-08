
import SectionTitle from "../components/SectionTitle2";
import useRequestedAssets from './../Hooks/useRequestedAssets';
import useUserData from "../Hooks/useUserData";
import LoadingSpinner from "./LoadingSpinner";
import Card from "../components/ui/Card";
import Table from "../components/ui/Table";
import Badge from "../components/ui/Badge";
import { FiAlertCircle } from "react-icons/fi";

/**
 * Displays pending asset requests in the dashboard home
 */
const PendingRequestsInHome = () => {
  const { userData } = useUserData();
  const { requestedAssets, isLoading } = useRequestedAssets();

  // Filter for pending requests from the user's company
  const filteredRequestedAssets = requestedAssets.filter(
    (asset) =>
      asset.requester_company === userData?.company_name &&
      asset.status === "Pending"
  );

  // Table columns configuration
  const columns = [
    {
      key: "index",
      header: "#",
      render: (_, index) => <div className="font-medium">{index + 1}</div>,
    },
    {
      key: "asset_name",
      header: "Asset Name",
      sortable: true,
      render: (row) => (
        <div className="font-medium text-gray-900">{row.asset_name}</div>
      ),
    },
    {
      key: "request_date",
      header: "Request Date",
      sortable: true,
      render: (row) => (
        <div>{new Date(row.request_date).toLocaleDateString()}</div>
      ),
    },
    {
      key: "requester_name",
      header: "Requester",
      sortable: true,
      render: (row) => <div>{row.requester_name}</div>,
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      render: (row) => (
        <Badge variant="warning" size="md">
          {row.status}
        </Badge>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <Card className="mb-8">
      <SectionTitle
        title="Pending Requests"
        subtitle="Asset requests awaiting approval"
        align="left"
        accentColor="primary"
      />

      {filteredRequestedAssets?.length < 1 ? (
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 text-blue-700 flex items-start rounded">
          <FiAlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium">No pending requests</p>
            <p className="text-sm mt-1">There are currently no pending asset requests to review.</p>
          </div>
        </div>
      ) : (
        <Table
          columns={columns}
          data={filteredRequestedAssets}
          pagination={true}
          pageSize={5}
          search={true}
          searchPlaceholder="Search requests..."
          searchKeys={["asset_name", "requester_name", "requester_email"]}
          emptyMessage="No pending requests found"
          hoverable={true}
          striped={true}
        />
      )}
    </Card>
  );
};

export default PendingRequestsInHome;