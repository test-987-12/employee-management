
import SectionTitle from "../../../components/SectionTitle2";
import PrimaryButton from "../../../components/PrimaryButton";
import PageTitle from "../../../components/PageTitle";
import LoadingSpinner from "../../../components/LoadingSpinner";
import useDeleteAsset from './../../../Hooks/useDeleteAsset';
import useAssets from '../../../Hooks/useAssets';
import useUserData from "../../../Hooks/useUserData";
import { useMemo, useState } from "react";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import DataTable from "react-data-table-component";
import { FiPlusCircle } from "react-icons/fi";

function AssetList() {
    const { userData } = useUserData();
    const { assets, refetch, isLoading } = useAssets();
    const deleteAsset = useDeleteAsset(refetch);

    const [searchTerm, setSearchTerm] = useState("");
    const [filter, setFilter] = useState("");
    const [sort, setSort] = useState("");

    const formatDate = (dateString) => {
      const options = { day: "2-digit", month: "2-digit", year: "numeric" };
      const date = new Date(dateString);
      return date.toLocaleDateString(undefined, options);
    };

    const handleDelete = (assetId) => {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then((result) => {
        if (result.isConfirmed) {
          deleteAsset.mutate(assetId, {
            onSuccess: () => {
              Swal.fire({
                title: "Deleted!",
                text: "Your asset has been deleted.",
                icon: "success",
              });
              refetch(); // Refetch data after successful deletion
            },
            onError: () => {
              Swal.fire({
                title: "Error!",
                text: "There was a problem deleting the asset.",
                icon: "error",
              });
            },
          });
        }
      });
    };

    const handleSearch = (e) => {
      setSearchTerm(e.target.value);
    };

    const handleFilter = (e) => {
      setFilter(e.target.value);
    };

    const handleSort = (e) => {
      setSort(e.target.value);
    };

    const filteredAssets = useMemo(() => {
      let filtered = assets;

      if (userData?.company_name) {
        filtered = filtered.filter(
          (asset) => asset.company_name === userData.company_name
        );
      }

      // Search functionality
      if (searchTerm) {
        filtered = filtered.filter((asset) =>
          asset.product_name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      // Filter functionality
      if (filter) {
        if (filter === "Available") {
          filtered = filtered.filter((asset) => asset.product_quantity > 0);
        } else if (filter === "Out Of Stock") {
          filtered = filtered.filter((asset) => asset.product_quantity === 0);
        } else {
          // Filter by product type
          filtered = filtered.filter(
            (asset) => asset.product_type === filter
          );
        }
      }

      // Sort functionality
      if (sort) {
        if (sort === "1 To 10") {
          filtered = filtered.filter(
            (asset) => asset.product_quantity >= 1 && asset.product_quantity <= 10
          );
        } else if (sort === "10 To 20") {
          filtered = filtered.filter(
            (asset) => asset.product_quantity > 10 && asset.product_quantity <= 20
          );
        } else if (sort === "20 To 30") {
          filtered = filtered.filter(
            (asset) => asset.product_quantity > 20 && asset.product_quantity <= 30
          );
        }
      }

      return filtered;
    }, [assets, searchTerm, filter, sort, userData.company_name]);

    const columns = [
      {
        name: "#",
        cell: (row, index) => <div>{index + 1}</div>,
      },
      {
        name: "Product Name",
        selector: (row) => row.product_name,
        sortable: true,
      },
      {
        name: "Product Type",
        selector: (row) => row.product_type,
        sortable: true,
      },
      {
        name: "Product Quantity",
        selector: (row) => row.product_quantity,
        sortable: true,
      },
      {
        name: "Date Added",
        selector: (row) => formatDate(row.created_date),
        sortable: true,
      },
      {
        name: "Action",
        cell: (row) => (
          <div className="flex justify-center items-center gap-1 flex-wrap">
            <Link
              to={`/dashboard/editAsset/${row.id}`}
              type="button"
              className="p-2 rounded-md bg-green-700 text-white text-lg"
            >
              Update
            </Link>
            <button
              type="button"
              onClick={() => handleDelete(row.id)}
              className="p-2 rounded-md bg-red-700 text-white text-lg"
            >
              Delete
            </button>
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
        <PageTitle title={"Asset List"} />
        <div className="template-container">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-6">
              <SectionTitle sectionTitle={"Asset List"} />
              <Link
                to="/dashboard/addAsset"
                className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
              >
                <FiPlusCircle className="w-5 h-5" />
                <span>Add Asset</span>
              </Link>
            </div>
          </div>
          <div className="flex flex-wrap gap-6 items-start mt-12">
            <div className="w-full max-w-[320px]">
              <input
                type="text"
                value={searchTerm}
                placeholder="Search Item By Asset Name"
                onChange={handleSearch}
                className="w-full p-2 rounded-md border border-green-500"
              />
            </div>
            <div className="w-full max-w-[320px]">
              <select
                className="w-full md:w-[200px] p-2 rounded-md bg-gray-200 text-green-700 font-normal text-lg"
                onChange={handleFilter}
                value={filter}
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
                <option value="Returnable">Returnable</option>
                <option value="Non-Returnable">Non-Returnable</option>
              </select>
            </div>
          </div>
          <div className="w-full sm:max-w-[320px] mt-5">
            <select
              className="w-full p-2 rounded-md bg-gray-200 text-green-700 font-normal text-lg"
              onChange={handleSort}
              value={sort}
            >
              <option value="">Sort Assets By Quantity</option>
              <option value="1 To 10">1 To 10</option>
              <option value="10 To 20">10 To 20</option>
              <option value="20 To 30">20 To 30</option>
            </select>
          </div>
          {/* Data Table */}
          <div className="mt-8">
            <DataTable
              columns={columns}
              data={filteredAssets}
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

  export default AssetList;