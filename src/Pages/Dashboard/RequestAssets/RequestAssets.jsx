
import "react-responsive-modal/styles.css";
import PrimaryButton from "../../../components/PrimaryButton";
import DataTable from "react-data-table-component";
import SectionTitle from "../../../components/SectionTitle2";
import PageTitle from "../../../components/PageTitle";
import LoadingSpinner from "../../../components/LoadingSpinner";
import Swal from "sweetalert2";
import { useQuery } from "@tanstack/react-query";
import useUserData from "../../../Hooks/useUserData";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "react-responsive-modal";
import { getAllData, createData } from "../../../firebase/firebaseDB";

function RequestAsset() {
    const navigate = useNavigate();

    const [open, setOpen] = useState(false);
    const [currentRow, setCurrentRow] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterTerm, setFilterTerm] = useState("");
    const { userData, isLoading: userDataLoading } = useUserData();

    const onOpenModal = (row) => {
      setCurrentRow(row);
      setOpen(true);
    };

    const onCloseModal = () => setOpen(false);

    const {
      data: assets = [],
      isLoading: assetsLoading,
      refetch,
    } = useQuery({
      queryKey: ["assets", searchTerm, filterTerm],
      queryFn: async () => {
        try {
          const allAssets = await getAllData("assets");

          // Filter assets based on company name, search term and filter term
          return allAssets.filter(asset => {
            // First filter by company name - only show assets from the user's company
            const matchesCompany = userData?.company_name
              ? asset.company_name === userData.company_name
              : true;

            const matchesSearch = searchTerm
              ? asset.product_name?.toLowerCase().includes(searchTerm.toLowerCase())
              : true;

            const matchesFilter = filterTerm
              ? (filterTerm === "Available" && parseInt(asset.product_quantity) > 0) ||
                (filterTerm === "Out Of Stock" && parseInt(asset.product_quantity) <= 0) ||
                (filterTerm === asset.product_type)
              : true;

            return matchesCompany && matchesSearch && matchesFilter;
          });
        } catch (error) {
          console.error("Error fetching assets:", error);
          return [];
        }
      },
      retry: 1 // Only retry once to avoid excessive retries on permanent errors
    });

    const handleSearchChange = (e) => {
      setSearchTerm(e.target.value);
    };

    const handleFilterChange = (e) => {
      setFilterTerm(e.target.value);
    };

    const handleRequest = async (e) => {
      e.preventDefault();
      const form = e.target;
      const note = form.note.value;
      const status = "Pending";
      const request_date = new Date().toISOString();
      const asset_id = currentRow.id;
      const asset_name = currentRow.product_name;
      const asset_type = currentRow.product_type;
      const asset_quantity = currentRow.product_quantity;
      const requester_name = userData.name;
      const requester_email = userData.email;
      const requester_company = userData.company_name;
      const requestAssetInfo = {
        note,
        status,
        request_date,
        asset_id,
        asset_name,
        asset_type,
        asset_quantity,
        requester_name,
        requester_email,
        requester_company,
      };

      try {
        // Save request to Firebase RTDB
        const result = await createData('requests', requestAssetInfo);

        if (result.id) {
          Swal.fire({
            icon: "success",
            title: "Requested!",
            showConfirmButton: false,
            timer: 1500,
          });
          refetch();
          navigate("/dashboard/myAssets");
        }
      } catch (error) {
        const errorMessage = error.message;
        Swal.fire({
          icon: "error",
          title: `${errorMessage}`,
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
        selector: (row) => row?.product_name,
        sortable: true,
      },
      {
        name: "Asset Type",
        selector: (row) => row?.product_type,
        sortable: true,
      },
      {
        name: "Availability",
        selector: (row) =>
          parseInt(row?.product_quantity) > 0 ? "Available" : "Out Of Stock",
        sortable: true,
      },
      {
        name: "Action",
        cell: (row) => {
          const isAvailable = parseInt(row?.product_quantity) > 0;
          if (isAvailable) {
            return (
              <>
                <span onClick={() => onOpenModal(row)}>
                  <PrimaryButton
                    buttonName="Request"
                    buttonTextColor="text-white"
                    buttonBGColor="bg-green-700"
                  />
                </span>
              </>
            );
          } else {
            return (
              <button
                type="button"
                className="px-5 py-2 text-lg rounded-md cursor-not-allowed disabled opacity-50 bg-red-400 text-white"
              >
                Request
              </button>
            );
          }
        },
      },
    ];

    if (userDataLoading || assetsLoading) {
      return (
        <div className="flex justify-center mt-5">
          <LoadingSpinner size="large" color="green" />
        </div>
      );
    }

    return (
      <>
        <PageTitle title={"Request For An Asset"} />
        <section className="py-8">
          <div className="container mx-auto">
            <div className="mb-8">
              <SectionTitle sectionTitle={"Request For An Asset"} />
              <div className="mt-4 max-w-3xl mx-auto text-center">
                <p className="text-gray-600">
                  Browse available assets below and request the ones you need. Your request will be sent to HR for approval.
                  Once approved, the asset will be assigned to you and will appear in your "My Assets" page.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-6 items-start mt-12">
              <div className="w-full max-w-[320px]">
                <input
                  type="text"
                  placeholder="Search Item By Asset Name"
                  className="p-2 rounded-md border border-green-700 w-full"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </div>
              <div className="w-full max-w-[320px]">
                <select
                  className="w-[200px] p-2 rounded-md bg-gray-200 text-green-700 font-normal text-lg"
                  value={filterTerm}
                  onChange={handleFilterChange}
                >
                  <option value="">Filter Assets</option>
                  <option value="Available">Available</option>
                  <option value="Out Of Stock">Out Of Stock</option>
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
            {/* Data Table */}
            <div className="mt-8">
              {assets.length === 0 ? (
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 text-blue-700 rounded">
                  <p className="font-medium">No assets available</p>
                  <p className="text-sm mt-1">
                    There are no assets available for your company at this time.
                  </p>
                </div>
              ) : (
                <DataTable
                  columns={columns}
                  data={assets}
                  pagination
                  highlightOnHover
                  defaultSortFieldId={null}
                  defaultSortAsc={false}
                />
              )}
            </div>
          </div>
        </section>
        <Modal
          open={open}
          onClose={onCloseModal}
          center
          styles={{
            modal: {
              maxWidth: "800px",
              width: "100%",
            },
          }}
        >
          {currentRow && (
            <div>
              <form onSubmit={handleRequest}>
                <div className="mt-4">
                  <label htmlFor="notes" className="block mb-2">
                    Additional Notes:
                  </label>
                  <textarea
                    required
                    name="note"
                    id="notes"
                    className="w-full p-2 border rounded-md border-green-500"
                    placeholder="Write Notes"
                    rows="4"
                  ></textarea>
                </div>
                <div className="mt-4 text-center">
                  <span>
                    <PrimaryButton
                      buttonName="Submit Request"
                      buttonTextColor="text-white"
                      buttonBGColor="bg-green-700"
                    />
                  </span>
                </div>
              </form>
            </div>
          )}
        </Modal>
      </>
    );
  }

  export default RequestAsset;
