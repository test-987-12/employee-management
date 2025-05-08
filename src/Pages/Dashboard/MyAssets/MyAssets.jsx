import { useState } from "react";
import DataTable from "react-data-table-component";
import SectionTitle from "../../../components/SectionTitle2";
import PageTitle from "../../../components/PageTitle";
import LoadingSpinner from "../../../components/LoadingSpinner";
import useUserAssets from "../../../Hooks/useUserAssets";
import { updateData } from "../../../firebase/firebaseDB";
import Swal from "sweetalert2";
import { FiPackage, FiCalendar, FiTag, FiCheckCircle } from "react-icons/fi";
import Card from "../../../components/ui/Card";

/**
 * Displays assets assigned to the current user
 */
function MyAssets() {
  const { userAssets, isLoading, refetch } = useUserAssets();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");
  const [returningId, setReturningId] = useState(null);

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = { day: "2-digit", month: "2-digit", year: "numeric" };
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, options);
  };

  // Handle returning an asset
  const handleReturn = async (assetId) => {
    try {
      setReturningId(assetId);

      // Update the user_asset status to "Returned"
      await updateData('user_assets', assetId, {
        status: "Returned",
        return_date: new Date().toISOString()
      });

      Swal.fire({
        icon: "success",
        title: "Asset Returned",
        text: "The asset has been marked as returned.",
        showConfirmButton: false,
        timer: 1500,
      });

      refetch();
    } catch (error) {
      console.error("Error returning asset:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Failed to return the asset",
      });
    } finally {
      setReturningId(null);
    }
  };

  // Filter assets based on search term and filter type
  const filteredAssets = userAssets.filter((asset) => {
    const matchesSearch = searchTerm
      ? asset.asset_name.toLowerCase().includes(searchTerm.toLowerCase())
      : true;

    const matchesFilter = filterType
      ? asset.asset_type === filterType || asset.status === filterType
      : true;

    return matchesSearch && matchesFilter;
  });

  // Table columns
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
      name: "Assigned Date",
      selector: (row) => formatDate(row.assigned_date),
      sortable: true,
    },
    {
      name: "Status",
      cell: (row) => (
        <div className={`px-2 py-1 rounded-full text-sm font-medium ${
          row.status === "Active"
            ? "bg-green-100 text-green-800"
            : "bg-gray-100 text-gray-800"
        }`}>
          {row.status}
        </div>
      ),
      sortable: true,
    },
    {
      name: "Action",
      cell: (row) => {
        // Show return button for any active asset
        if (row.status === "Active") {
          return (
            <button
              onClick={() => handleReturn(row.id)}
              disabled={returningId === row.id}
              className={`px-3 py-1 rounded-md bg-blue-600 text-white text-sm font-medium
                ${returningId === row.id ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"}`}
            >
              {returningId === row.id ? "Returning..." : "Return Asset"}
            </button>
          );
        }
        return null;
      },
    },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center mt-5">
        <LoadingSpinner size="large" color="green" />
      </div>
    );
  }

  return (
    <section className="py-8">
      <PageTitle title="My Assets" />
      <div className="container mx-auto">
        <div className="mb-8">
          <SectionTitle sectionTitle="My Assets" />
          <div className="mt-4 max-w-3xl mx-auto text-center">
            <p className="text-gray-600">
              This page shows all assets that have been assigned to you. Assets with "Active" status are currently in your possession.
              You can return assets when you no longer need them.
            </p>
          </div>
        </div>

        {userAssets.length === 0 ? (
          <Card className="p-6 text-center">
            <div className="flex flex-col items-center justify-center py-12">
              <FiPackage className="w-16 h-16 text-gray-400 mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">No Assets Assigned</h3>
              <p className="text-gray-500 max-w-md">
                You don't have any assets assigned to you yet. Request assets from the "Request Assets" page.
              </p>
            </div>
          </Card>
        ) : (
          <>
            <div className="flex flex-wrap gap-6 items-start mb-8">
              <div className="w-full max-w-[320px]">
                <input
                  type="text"
                  placeholder="Search by asset name"
                  className="w-full p-2 rounded-md border border-green-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="w-full max-w-[320px]">
                <select
                  className="w-full p-2 rounded-md bg-gray-200 text-green-700 font-normal text-lg"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <option value="">Filter Assets</option>
                  <option value="Active">Active</option>
                  <option value="Returned">Returned</option>
                  <option value="Laptop">Laptop</option>
                  <option value="Desktop">Desktop</option>
                  <option value="Monitor">Monitor</option>
                  <option value="Keyboard">Keyboard</option>
                  <option value="Mouse">Mouse</option>
                  <option value="Headset">Headset</option>
                  <option value="Phone">Phone</option>
                  <option value="Tablet">Tablet</option>
                  <option value="Printer">Printer</option>
                  <option value="Scanner">Scanner</option>
                  <option value="Projector">Projector</option>
                  <option value="Camera">Camera</option>
                  <option value="Office Chair">Office Chair</option>
                  <option value="Desk">Desk</option>
                  <option value="Software License">Software License</option>
                  <option value="Server Equipment">Server Equipment</option>

                </select>
              </div>
            </div>

            {/* Asset Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <Card className="p-4 bg-blue-50 border-blue-200">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-blue-100 mr-4">
                    <FiPackage className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-blue-600 font-medium">Total Assets</p>
                    <p className="text-2xl font-bold text-blue-800">{userAssets.length}</p>
                  </div>
                </div>
              </Card>

              <Card className="p-4 bg-green-50 border-green-200">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-green-100 mr-4">
                    <FiCheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-green-600 font-medium">Active Assets</p>
                    <p className="text-2xl font-bold text-green-800">
                      {userAssets.filter(a => a.status === "Active").length}
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Data Table */}
            <Card>
              <DataTable
                columns={columns}
                data={filteredAssets}
                pagination
                highlightOnHover
                responsive
                striped
                defaultSortFieldId={null}
                defaultSortAsc={false}
              />
            </Card>
          </>
        )}
      </div>
    </section>
  );
}

export default MyAssets;
