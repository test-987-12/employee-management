
import DataTable from "react-data-table-component";
import SectionTitle from "../components/SectionTitle2";
import useFilteredRequestedAssets from "../Hooks/useFilteredRequestedAssets";


function PendingRequests() {
    const { requestedAssets, isLoading } = useFilteredRequestedAssets();
    const myPendingRequestedAssets = requestedAssets.filter(
      (asset) => asset.status === "Pending"
    );

    const columns = [
      {
        name: "#",
        cell: (row, index) => <div>{index + 1}</div>,
        width: "60px",
      },
      {
        name: "Asset Name",
        selector: (row) => row.asset_name,
        sortable: true,
      },
      {
        name: "Asset Type",
        selector: (row) => row.asset_type,
        sortable: true,
      },
      {
        name: "Request Date",
        selector: (row) => new Date(row.request_date).toLocaleDateString(),
        sortable: true,
      },
      {
        name: "Note",
        selector: (row) => row.note,
        cell: (row) => (
          <div className="truncate max-w-[200px]" title={row.note}>
            {row.note || "No note provided"}
          </div>
        ),
      },
    ];

    // Custom styles for the table
    const customStyles = {
      cells: {
        style: {
          fontSize: "16px", // Increase the font size for table cells
        },
      },
    };

    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-[60vh]">

        </div>
      );
    }

    return (
      <div>
        {myPendingRequestedAssets?.length < 1 ? (
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 text-blue-700 flex items-start rounded">
            <div>
              <p className="font-medium">No pending requests</p>
              <p className="text-sm mt-1">You don't have any pending asset requests at the moment.</p>
            </div>
          </div>
        ) : (
          <div>
            <DataTable
              columns={columns}
              data={myPendingRequestedAssets}
              pagination
              highlightOnHover
              customStyles={customStyles}
              defaultSortFieldId={null}
              defaultSortAsc={false}
              noHeader={true}
              paginationPerPage={5}
              paginationRowsPerPageOptions={[5, 10, 15]}
            />
            <div className="mt-4 text-sm text-gray-500">
              <p>These requests are waiting for approval from HR. You'll be notified when their status changes.</p>
            </div>
          </div>
        )}
      </div>
    );
  }

  export default PendingRequests;