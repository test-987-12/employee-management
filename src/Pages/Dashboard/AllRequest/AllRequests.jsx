import DataTable from "react-data-table-component";
import SectionTitle from "../../../components/SectionTitle2";
import PageTitle from "../../../components/PageTitle";
import Swal from "sweetalert2";
import useRequestedAssets from "../../../Hooks/useRequestedAssets";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { useState } from "react";
import useUserData from "../../../Hooks/useUserData";
import { updateData, getDataById, createData } from "../../../firebase/firebaseDB";

function AllRequests() {
    const { userData } = useUserData();
    const [searchTerm, setSearchTerm] = useState("");
    const { requestedAssets, refetch, isLoading } = useRequestedAssets();

    let filtered = requestedAssets.filter((requestedAsset) => {
        const requesterName = requestedAsset.requester_name?.toLowerCase() || "";
        const requesterEmail = requestedAsset.requester_email?.toLowerCase() || "";
        return requesterName.includes(searchTerm.toLowerCase()) || requesterEmail.includes(searchTerm.toLowerCase());
    });

    if (userData?.company_name) {
        filtered = filtered.filter(
            (requestedAsset) => requestedAsset.requester_company === userData.company_name
        );
    }

    const formatDate = (dateString) => {
        const options = { day: "2-digit", month: "2-digit", year: "numeric" };
        const date = new Date(dateString);
        return date.toLocaleDateString(undefined, options);
    };

    const handleAction = async (row, status) => {
        try {
            const updateDataObj = { status };
            if (status === "Approved") {
                updateDataObj.approval_date = new Date().toISOString();
            }

            // Use the id property instead of _id for Firebase Realtime Database
            const requestId = row.id;

            if (!requestId) {
                throw new Error("Request ID is missing");
            }

            // If approving, handle asset assignment and quantity update
            if (status === "Approved") {
                // 1. Get the asset details
                const assetId = row.asset_id;
                if (!assetId) {
                    throw new Error("Asset ID is missing from the request");
                }

                // 2. Get the current asset data
                const assetData = await getDataById('assets', assetId);
                if (!assetData) {
                    throw new Error("Asset not found");
                }

                // 3. Check if there's enough quantity
                if (assetData.product_quantity <= 0) {
                    throw new Error("Asset is out of stock");
                }

                // 4. Decrease the asset quantity
                const newQuantity = Math.max(0, assetData.product_quantity - 1);
                await updateData('assets', assetId, {
                    product_quantity: newQuantity
                });

                // 5. Create a user_asset entry
                const userAssetData = {
                    user_id: row.requester_email, // Using email as user ID
                    user_name: row.requester_name,
                    asset_id: assetId,
                    asset_name: row.asset_name,
                    asset_type: row.asset_type,
                    request_id: requestId,
                    assigned_date: new Date().toISOString(),
                    status: "Active",
                    company_name: row.requester_company
                };

                await createData('user_assets', userAssetData);
            }

            // Update the request status
            const result = await updateData('requests', requestId, updateDataObj);

            if (result.success) {
                Swal.fire({
                    icon: "success",
                    title: `Request ${status}`,
                    showConfirmButton: false,
                    timer: 1500,
                });
                refetch();
            }
        } catch (error) {
            console.error("Error updating request:", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: error.message || "Failed to update request status",
            });
        }
    };

    const columns = [
        {
            name: "#",
            cell: (row, index) => <div>{index + 1}</div>,
        },
        {
            name: "Asset Name",
            selector: (row) => row?.asset_name,
            sortable: true,
        },
        {
            name: "Asset Type",
            selector: (row) => row?.asset_type,
            sortable: true,
        },
        {
            name: "Email of Requester",
            selector: (row) => row?.requester_email,
            sortable: true,
        },
        {
            name: "Name of Requester",
            selector: (row) => row?.requester_name,
            sortable: true,
        },
        {
            name: "Request Date",
            selector: (row) => formatDate(row?.request_date),
            sortable: true,
        },
        {
            name: "Additional Note",
            selector: (row) => row?.note,
            sortable: true,
        },
        {
            name: "Status",
            selector: (row) => row.status,
            sortable: true,
        },
        {
            name: "Action",
            cell: (row) => (
                <div className="py-2 flex justify-center items-center gap-2 flex-wrap">
                    {row.status !== "Approved" &&
                        row.status !== "Rejected" &&
                        row.status !== "Cancelled" &&
                        row.status !== "Returned" && (
                            <>
                                <button
                                    type="button"
                                    className="p-1 rounded-md bg-green-700 text-white text-base"
                                    onClick={() => handleAction(row, "Approved")}
                                >
                                    Approve
                                </button>
                                <button
                                    type="button"
                                    className="p-1 rounded-md bg-red-700 text-white text-base"
                                    onClick={() => handleAction(row, "Rejected")}
                                >
                                    Reject
                                </button>
                            </>
                        )}
                </div>
            ),
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
            <PageTitle title={"All Requests"} />
            <div className="template-container">
                <div className="text-center">
                    <SectionTitle sectionTitle={"All Requests"} />
                </div>
                <div className="w-full max-w-[320px] relative">
                    <input
                        type="text"
                        className="p-2 rounded-md border border-green-700 w-full"
                        placeholder="Search By Name/Email"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                {/* Data Table */}
                <div className="mt-8">
                    <DataTable
                        columns={columns}
                        data={filtered}
                        pagination
                        highlightOnHover
                        defaultSortFieldId={null}
                        defaultSortAsc={false}
                    />
                </div>
            </div>
        </section>
    );
}

export default AllRequests;
