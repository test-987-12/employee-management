import { useState } from "react";
import useUserData from "../../../Hooks/useUserData";
import useReports from "../../../Hooks/useReports";
import LoadingSpinner from "../../../components/LoadingSpinner";
import SectionTitle from "../../../components/SectionTitle2";
import PageTitle from "../../../components/PageTitle";
import { Link } from "react-router-dom";
import PrimaryButton from "../../../components/PrimaryButton";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";

function Reports() {
  const { userData } = useUserData();
  const [reportType, setReportType] = useState("assets");
  const { reportData, isLoading } = useReports(reportType);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  if (isLoading) {
    return (
      <div className="flex justify-center mt-5">
        <LoadingSpinner size="large" color="green" />
      </div>
    );
  }

  // All users have access to reports

  return (
    <section className="py-8">
      <PageTitle title={"Reports & Analytics"} />
      <div className="container mx-auto">
        <div className="text-center">
          <SectionTitle sectionTitle={"Reports & Analytics"} />
        </div>

        <div className="flex justify-center gap-4 mt-8 mb-8">
          <button
            className={`px-4 py-2 rounded-md ${
              reportType === "assets" ? "bg-green-600 text-white" : "bg-gray-200"
            }`}
            onClick={() => setReportType("assets")}
          >
            Asset Distribution
          </button>
          <button
            className={`px-4 py-2 rounded-md ${
              reportType === "requests" ? "bg-green-600 text-white" : "bg-gray-200"
            }`}
            onClick={() => setReportType("requests")}
          >
            Request Status
          </button>
          <button
            className={`px-4 py-2 rounded-md ${
              reportType === "monthly" ? "bg-green-600 text-white" : "bg-gray-200"
            }`}
            onClick={() => setReportType("monthly")}
          >
            Monthly Requests
          </button>
        </div>

        {reportType === "assets" && (
          <div className="mt-8">
            <h3 className="text-xl font-bold mb-4">Asset Distribution by Type</h3>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={reportData.assetsByType || []}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-12">
              <h3 className="text-xl font-bold mb-4">Asset Availability</h3>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={reportData.assetAvailability || []}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {(reportData.assetAvailability || []).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {reportType === "requests" && (
          <div className="mt-8">
            <h3 className="text-xl font-bold mb-4">Request Status Distribution</h3>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={reportData.requestsByStatus || []}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {(reportData.requestsByStatus || []).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-12">
              <h3 className="text-xl font-bold mb-4">Requests by Employee</h3>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={reportData.requestsByEmployee || []}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {reportType === "monthly" && (
          <div className="mt-8">
            <h3 className="text-xl font-bold mb-4">Monthly Requests Distribution</h3>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={reportData.monthlyRequestsByType || []}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {(reportData.monthlyRequestsByType || []).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default Reports;
