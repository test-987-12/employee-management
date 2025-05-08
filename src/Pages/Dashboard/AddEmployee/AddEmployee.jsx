
import SectionTitle from "../../../components/SectionTitle2";
import PageTitle from "../../../components/PageTitle";
import LoadingSpinner from "../../../components/LoadingSpinner";
import Swal from "sweetalert2";
import { useState } from "react";
import useUnaffiliatedUsers from './../../../Hooks/useUnaffialtedUsers';
import useUsersByCompany from "../../../Hooks/useUsersByCompany";
import useUserData from "../../../Hooks/useUserData";
import DataTable from "react-data-table-component";
import { Link, useNavigate } from "react-router-dom";
import { updateData } from "../../../firebase/firebaseDB";

function AddEmployee() {
    const navigate = useNavigate();
    const { userData } = useUserData();
    const { unaffiliatedUsers, isLoading, refetch } = useUnaffiliatedUsers();
    const { usersByCompany } = useUsersByCompany();
    const [selectedUsers, setSelectedUsers] = useState([]);

    const packageLimits = {
      basic: 5,
      standard: 10,
      premium: 20,
    };

    const currentLimit = packageLimits[userData?.packages] || 0;
    const currentEmployees = usersByCompany?.length || 0;

    const handleCheckboxChange = (userId) => {
      setSelectedUsers((prevSelectedUsers) =>
        prevSelectedUsers.includes(userId)
          ? prevSelectedUsers.filter((id) => id !== userId)
          : [...prevSelectedUsers, userId]
      );
    };

    const handleAddSelectedMembers = async (e) => {
      e.preventDefault();
      if (currentEmployees + selectedUsers.length > currentLimit) {
        Swal.fire({
          icon: "error",
          title: "Limit Exceeded",
          text: `You can only add up to ${currentLimit} members (You are also a member) with this package.`,
        });
        return;
      }

      try {
        const updatePromises = selectedUsers.map((userId) =>
          updateData('users', userId, {
            company_name: userData.company_name,
            company_logo: userData.company_logo || null,
          })
        );

        const results = await Promise.all(updatePromises);
        const successCount = results.filter(result => result.success).length;

        if (successCount > 0) {
          refetch();
          Swal.fire({
            icon: "success",
            title: `${successCount} Employee(s) Added!`,
            showConfirmButton: false,
            timer: 1500,
          });
          navigate("/dashboard/myEmployeeList");
        }
      } catch (error) {
        console.error("Error updating users:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to add employees. Please try again.",
        });
      }
    };

    const handleAddClick = async (userId) => {
      if (currentEmployees >= currentLimit) {
        Swal.fire({
          icon: "error",
          title: "Limit Exceeded",
          text: `You can only add up to ${currentLimit} members (You are also a Member) with this package.`,
        });
        return;
      }

      try {
        // Use Firebase updateData instead of axios
        const { success } = await updateData('users', userId, {
          company_name: userData.company_name,
          company_logo: userData.company_logo || null,
        });

        if (success) {
          refetch();
          Swal.fire({
            icon: "success",
            title: "Employee Added!",
            showConfirmButton: false,
            timer: 1500,
          });
          navigate("/dashboard/myEmployeeList");
        }
      } catch (error) {
        console.error("Error updating user:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to add employee. Please try again.",
        });
      }
    };

    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-[60vh]">
          <LoadingSpinner size="lg" />
        </div>
      );
    }

    const columns = [
      {
        name: "Select",
        cell: (row) => {
          return (
            <div className="flex items-center justify-center">
              <input
                type="checkbox"
                className="h-4 w-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
                onChange={() => handleCheckboxChange(row.id)}
                checked={selectedUsers.includes(row.id)}
              />
            </div>
          );
        },
        width: "80px",
      },
      {
        name: "User Photo",
        selector: (row) => {
          return (
            <img
              src={
                row?.image
                  ? row.image
                  : "https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Missing_avatar.svg/2048px-Missing_avatar.svg.png"
              }
              alt="User Photo"
              className="h-[100px] w-[100px] object-cover rounded my-2"
            />
          );
        },
        sortable: true,
      },
      {
        name: "User Name",
        selector: (row) => row?.name,
        sortable: true,
      },
      {
        name: "Email",
        selector: (row) => row?.email,
        sortable: true,
      },
      {
        name: "Action",
        cell: (row) => {
          return (
            <div className="py-2 flex justify-center">
              <button
                onClick={() => handleAddClick(row.id)}
                type="button"
                className="py-2 px-4 rounded-md bg-primary-600 text-white text-sm hover:bg-primary-700 transition-colors"
              >
                Add to Company
              </button>
            </div>
          );
        },
      },
    ];

    return (
      <section className="py-8">
        <PageTitle title={"Add Employees to Your Company"} />
        <div className="template-container">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-6">
              <SectionTitle sectionTitle={"Add Employees to Your Company"} />
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
              <h2 className="text-lg font-medium mb-2">Current Status</h2>
              <p className="text-gray-700 mb-3">
                You have <span className="font-semibold">{usersByCompany.length}</span> employees
              </p>
              <p className="text-primary-600 font-medium mb-4">
                {userData?.packages === "basic"
                  ? "You are using the Basic package (5 members limit)"
                  : userData?.packages === "standard"
                  ? "You are using the Standard package (10 members limit)"
                  : userData?.packages === "premium"
                  ? "You are using the Premium package (20 members limit)"
                  : "No package selected"}
              </p>
              <Link
                to="/dashboard/increaseLimit"
                className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
              >
                Increase Your Limit
              </Link>
            </div>
          </div>

            {/* Section explaining the list */}
            <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
              <h2 className="text-lg font-medium mb-2">Available Users</h2>
              <p className="text-gray-700 mb-4">
                The list below shows users who have registered in the system but are not yet associated with any company.
                You can add them to your company by clicking the "Add Employee" button.
              </p>

              {unaffiliatedUsers.length === 0 && (
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 text-blue-700">
                  <p className="font-medium">No available users found</p>
                  <p className="text-sm mt-1">There are currently no unaffiliated users in the system that you can add to your company.</p>
                </div>
              )}
            </div>

            {/* Data Table */}
            {unaffiliatedUsers.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-4 bg-gray-50 border-b">
                  <h3 className="font-medium text-gray-700">Unaffiliated Users ({unaffiliatedUsers.length})</h3>
                </div>
                <DataTable
                  columns={columns}
                  data={unaffiliatedUsers}
                  pagination
                  highlightOnHover
                  responsive
                  striped
                />
              </div>
            )}
            {unaffiliatedUsers.length > 0 && selectedUsers.length > 0 && (
              <form className="mt-6" onSubmit={handleAddSelectedMembers}>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
                  >
                    Add {selectedUsers.length} Selected User{selectedUsers.length > 1 ? 's' : ''} to Company
                  </button>
                </div>
              </form>
            )}
          </div>
      </section>
    );
  }

  export default AddEmployee;
