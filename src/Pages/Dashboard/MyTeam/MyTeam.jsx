
import SectionTitle from "../../../components/SectionTitle2";
import PageTitle from "../../../components/PageTitle";
import LoadingSpinner from "../../../components/LoadingSpinner";
import useUsersByCompany from "../../../Hooks/useUsersByCompany";
import useUserData from "../../../Hooks/useUserData";
import { useState } from "react";
import DataTable from "react-data-table-component";

function MyTeam() {
    const { usersByCompany, isLoading } = useUsersByCompany();
    const { userData } = useUserData();
    const [searchTerm, setSearchTerm] = useState("");

    if (isLoading) {
      return (
        <div className="flex justify-center mt-5">
          <LoadingSpinner size="large" color="green" />
        </div>
      );
    }

    const columns = [
      {
        name: "#",
        cell: (row, index) => <div>{index + 1}</div>,
        width: "60px",
      },
      {
        name: "Member Image",
        selector: (row) => {
          return (
            <img
              src={
                row?.profile_image
                  ? row.profile_image
                  : "https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Missing_avatar.svg/2048px-Missing_avatar.svg.png"
              }
              alt="Image"
              className="h-[80px] w-[80px] object-cover rounded-full my-2 border-2 border-green-500"
            />
          );
        },
        width: "120px",
      },
      {
        name: "Member Name",
        selector: (row) => row?.name,
        sortable: true,
      },
      {
        name: "Email",
        selector: (row) => row?.email,
        sortable: true,
      },
      {
        name: "Role",
        selector: (row) => {
          return (
            <span className={`capitalize px-3 py-1 rounded-full ${
              row.role === "hr" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"
            }`}>
              {row.role}
            </span>
          );
        },
        sortable: true,
      },
      {
        name: "Date Joined",
        selector: (row) => {
          const date = new Date(row.created_at || Date.now());
          return date.toLocaleDateString();
        },
        sortable: true,
      },
    ];

    const filteredTeamMembers = usersByCompany.filter(member =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <section className="py-8">
        <PageTitle title={"My Team"} />
        <div className="container mx-auto">
          <div className="text-center">
            <SectionTitle sectionTitle={"My Team"} />

            {!userData?.company_name ? (
              <div className="mt-8 max-w-3xl mx-auto">
                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 text-yellow-700 rounded">
                  <p className="font-medium">You are not assigned to a company yet</p>
                  <p className="text-sm mt-1">
                    You need to be added to a company by an HR administrator before you can view team members.
                    Please contact your HR department to complete your onboarding process.
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div className="flex justify-center mt-6 mb-8">
                  <div className="w-full max-w-md">
                    <input
                      type="text"
                      placeholder="Search by team member name"
                      className="w-full p-2 border border-green-700 rounded-md"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                {/* Data Table */}
                <div className="mt-2">
                  <DataTable
                    columns={columns}
                    data={filteredTeamMembers}
                    pagination
                    highlightOnHover
                    defaultSortFieldId={null}
                    defaultSortAsc={false}
                    noDataComponent={
                      <div className="p-4">
                        No team members found
                      </div>
                    }
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    );
  }

  export default MyTeam;