import { useEffect } from "react";
import HRChart from "../../../components/HRChart";
import LimitedStock from "../../../components/LimitedStock";
import PendingRequestsInHome from "../../../components/PendingRequestsInHome";
import TopRequestedItems from "../../../components/TopRequestedItems";
import SectionTitle from "../../../components/SectionTitle2";
import { FiActivity, FiUsers, FiPackage, FiCheckCircle } from "react-icons/fi";
import Card from "../../../components/ui/Card";
import useDashboardStats from "../../../Hooks/useDashboardStats";
import LoadingSpinner from "../../../components/LoadingSpinner";

/**
 * HR Dashboard Home Page
 */
const HrHome = () => {
  // Set page title
  useEffect(() => {
    document.title = "HR Dashboard | Trinet";
  }, []);

  // Get real-time dashboard statistics
  const { stats, isLoading } = useDashboardStats();

  // If loading, show spinner
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Prepare stats data with real values
  const statsData = [
    {
      title: "Total Employees",
      value: stats.totalEmployees || 0,
      change: stats.employeeChange || "+0%",
      changeType: stats.employeeChange?.startsWith("+") ? "increase" : "decrease",
      icon: <FiUsers className="h-6 w-6 text-primary-500" />,
    },
    {
      title: "Total Assets",
      value: stats.totalAssets || 0,
      change: stats.assetChange || "+0%",
      changeType: stats.assetChange?.startsWith("+") ? "increase" : "decrease",
      icon: <FiPackage className="h-6 w-6 text-secondary-500" />,
    },
    {
      title: "Pending Requests",
      value: stats.pendingRequests || 0,
      change: stats.pendingChange || "0%",
      changeType: stats.pendingChange?.startsWith("+") ? "increase" : "decrease",
      icon: <FiActivity className="h-6 w-6 text-warning-500" />,
    },
    {
      title: "Approved This Month",
      value: stats.approvedThisMonth || 0,
      change: stats.approvedChange || "+0%",
      changeType: stats.approvedChange?.startsWith("+") ? "increase" : "decrease",
      icon: <FiCheckCircle className="h-6 w-6 text-success-500" />,
    },
  ];

  return (
    <div>
      {/* Welcome section */}
      <div className="mb-8">
        <SectionTitle
          title="HR Dashboard"
          subtitle="Welcome back! Here's what's happening with your assets today."
          align="left"
          accentColor="primary"
        />
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsData.map((stat, index) => (
          <Card key={index} className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                <p className="mt-1 text-3xl font-semibold text-gray-900">{stat.value}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-full">{stat.icon}</div>
            </div>
            <div className="mt-4">
              <span
                className={`inline-flex items-center text-sm font-medium ${
                  stat.changeType === "increase"
                    ? "text-success-500"
                    : "text-error-500"
                }`}
              >
                {stat.change}
                <svg
                  className={`ml-1 h-4 w-4 ${
                    stat.changeType === "increase" ? "rotate-0" : "rotate-180"
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 10l7-7m0 0l7 7m-7-7v18"
                  />
                </svg>
              </span>
              <span className="text-sm text-gray-500 ml-1">from last month</span>
            </div>
          </Card>
        ))}
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-8">
          <PendingRequestsInHome />
          <LimitedStock />
        </div>
        <div className="space-y-8">
          <HRChart />
          <TopRequestedItems />
        </div>
      </div>
    </div>
  );
};

export default HrHome;