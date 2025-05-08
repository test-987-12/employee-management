
import SectionTitle from "../../../components/SectionTitle2";
import PageTitle from "../../../components/PageTitle";
import useUserData from "../../../Hooks/useUserData";
import useUsersByCompany from "../../../Hooks/useUsersByCompany";
import { useState } from "react";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import DataTable from "react-data-table-component";
import { FiUserPlus } from "react-icons/fi";
import { updateData } from "../../../firebase/firebaseDB";
import LoadingSpinner from "../../../components/LoadingSpinner";

function MyEmployeeList() {
    const { usersByCompany, isLoading, refetch } = useUsersByCompany();
    const [loading, setLoading] = useState(false);
    const { userData } = useUserData();

    const handleRemoveUser = async (userId) => {
      try {
        setLoading(true);

        // Confirm before removing
        const result = await Swal.fire({
          title: "Are you sure?",
          text: "This will remove the employee from your company",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#d33",
          cancelButtonColor: "#3085d6",
          confirmButtonText: "Yes, remove employee"
        });

        if (!result.isConfirmed) {
          setLoading(false);
          return;
        }

        // Update the user record to remove company association
        const { success } = await updateData('users', userId, {
          company_name: null,
          company_logo: null
        });

        if (success) {
          Swal.fire({
            icon: "success",
            title: "Employee Removed!",
            showConfirmButton: false,
            timer: 1500,
          });
          refetch(); // Refresh the user list
        }
      } catch (error) {
        console.error("Error removing employee:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to remove employee. Please try again."
        });
      } finally {
        setLoading(false);
      }
    };


    const columns = [
      {
        name: "#", // Column header for serial number
        cell: (row, index) => <div>{index + 1}</div>, // Render serial number based on row index
      },
      {
        name: "Member Image",
        selector: (row) => {
          return (
            <img
              src={
                row?.image
                  ? row.image
                  : "https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Missing_avatar.svg/2048px-Missing_avatar.svg.png"
              }
              alt="Image"
              className="h-[100px] w-[100px] object-cover rounded my-2"
            />
          );
        },
        sortable: true,
      },
      {
        name: "Member Name",
        selector: (row) => row?.name,
        sortable: true,
      },
      {
        name: "Member Type",
        selector: (row) => {
          return <p className="uppercase">{row.role}</p>;
        },
        sortable: true,
      },
      {
        name: "Action",
        cell: (row) => {
          if (row.role === "hr") {
            return "";
          } else {
            return (
              <div className="py-2 flex justify-center">
                <button
                  onClick={() => handleRemoveUser(row.id)}
                  type="button"
                  className="px-3 py-1 rounded-md bg-red-600 text-white text-sm hover:bg-red-700 transition-colors"
                  disabled={loading}
                >
                  {loading ? 'Removing...' : 'Remove'}
                </button>
              </div>
            );
          }
        },
      },
    ];

    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-[60vh]">
          <LoadingSpinner size="lg" />
        </div>
      );
    }

    return (
      <section className="py-8">
        <PageTitle title={"Employee List"} />
        <div className="template-container">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-6">
              <SectionTitle sectionTitle={"My Employee List"} />
              <Link
                to="/dashboard/addEmployee"
                className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
              >
                <FiUserPlus className="w-5 h-5" />
                <span>Add Employee</span>
              </Link>
            </div>

            {usersByCompany.length === 0 ? (
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 text-blue-700 mb-6">
                <p className="font-medium">No employees found</p>
                <p className="text-sm mt-1">You haven't added any employees to your company yet.</p>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <DataTable
                  columns={columns}
                  data={usersByCompany}
                  pagination
                  highlightOnHover
                  responsive
                  striped
                  defaultSortFieldId={null}
                  defaultSortAsc={false}
                />
              </div>
            )}
          </div>
        </div>
      </section>
    );
  }

  export default MyEmployeeList;