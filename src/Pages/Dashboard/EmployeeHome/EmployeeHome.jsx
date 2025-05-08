
import { useEffect } from "react";
import PendingRequests from "../../../components/PendingRequests";
import SectionTitle from "../../../components/SectionTitle2";
import useFilteredRequestedAssets from "../../../Hooks/useFilteredRequestedAssets";
import useUserAssets from "../../../Hooks/useUserAssets";
import Card from "../../../components/ui/Card";
import { FiPackage, FiClipboard, FiClock, FiCheckCircle, FiXCircle } from "react-icons/fi";
import { Link } from "react-router-dom";
import LoadingSpinner from "../../../components/LoadingSpinner";

const EmployeeHome = () => {
    // Set page title
    useEffect(() => {
        document.title = "Employee Dashboard | Trinet";
    }, []);

    // Get user assets and requests data
    const { userAssets, isLoading: assetsLoading } = useUserAssets();
    const { requestedAssets, isLoading: requestsLoading } = useFilteredRequestedAssets();

    // Calculate summary statistics
    const totalAssets = userAssets.length;
    const activeAssets = userAssets.filter(asset => asset.status === "Active").length;

    const totalRequests = requestedAssets.length;
    const pendingRequests = requestedAssets.filter(request => request.status === "Pending").length;
    const approvedRequests = requestedAssets.filter(request => request.status === "Approved").length;
    const rejectedRequests = requestedAssets.filter(request => request.status === "Rejected").length;

    // Loading state
    if (assetsLoading || requestsLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <LoadingSpinner size="large" color="primary" />
            </div>
        );
    }

    return (
        <div>
            {/* Welcome section */}
            <div className="mb-8">
                <SectionTitle
                    title="Employee Dashboard"
                    subtitle="Welcome to your asset management dashboard. Here's an overview of your assets and requests."
                    align="left"
                    accentColor="primary"
                />
            </div>

            {/* Dashboard summary cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* My Assets card */}
                <Card className="p-6 border-l-4 border-blue-500">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">My Assets</p>
                            <p className="mt-1 text-3xl font-semibold text-gray-900">{totalAssets}</p>
                            <p className="mt-1 text-sm text-gray-500">
                                {activeAssets} active
                            </p>
                        </div>
                        <div className="p-3 bg-blue-50 rounded-full">
                            <FiPackage className="h-6 w-6 text-blue-500" />
                        </div>
                    </div>
                    <div className="mt-4">
                        <Link
                            to="/dashboard/myAssets"
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                            View all assets →
                        </Link>
                    </div>
                </Card>

                {/* Total Requests card */}
                <Card className="p-6 border-l-4 border-purple-500">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Total Requests</p>
                            <p className="mt-1 text-3xl font-semibold text-gray-900">{totalRequests}</p>
                            <p className="mt-1 text-sm text-gray-500">
                                All time asset requests
                            </p>
                        </div>
                        <div className="p-3 bg-purple-50 rounded-full">
                            <FiClipboard className="h-6 w-6 text-purple-500" />
                        </div>
                    </div>
                    <div className="mt-4">
                        <Link
                            to="/dashboard/myRequestedAssets"
                            className="text-purple-600 hover:text-purple-800 text-sm font-medium"
                        >
                            View all requests →
                        </Link>
                    </div>
                </Card>

                {/* Pending Requests card */}
                <Card className="p-6 border-l-4 border-amber-500">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Pending Requests</p>
                            <p className="mt-1 text-3xl font-semibold text-gray-900">{pendingRequests}</p>
                            <p className="mt-1 text-sm text-gray-500">
                                Awaiting approval
                            </p>
                        </div>
                        <div className="p-3 bg-amber-50 rounded-full">
                            <FiClock className="h-6 w-6 text-amber-500" />
                        </div>
                    </div>
                    <div className="mt-4">
                        <Link
                            to="/dashboard/myRequestedAssets"
                            className="text-amber-600 hover:text-amber-800 text-sm font-medium"
                        >
                            Check status →
                        </Link>
                    </div>
                </Card>

                {/* Request Status card */}
                <Card className="p-6 border-l-4 border-green-500">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Request Status</p>
                            <div className="flex items-center mt-1">
                                <FiCheckCircle className="h-5 w-5 text-green-500 mr-1" />
                                <span className="text-green-600 font-medium">{approvedRequests} approved</span>
                            </div>
                            <div className="flex items-center mt-1">
                                <FiXCircle className="h-5 w-5 text-red-500 mr-1" />
                                <span className="text-red-600 font-medium">{rejectedRequests} rejected</span>
                            </div>
                        </div>
                        <div className="p-3 bg-green-50 rounded-full">
                            <FiCheckCircle className="h-6 w-6 text-green-500" />
                        </div>
                    </div>
                    <div className="mt-4">
                        <Link
                            to="/dashboard/requestAssets"
                            className="text-green-600 hover:text-green-800 text-sm font-medium"
                        >
                            Request new asset →
                        </Link>
                    </div>
                </Card>
            </div>

            {/* Pending Requests section */}
            <div className="mb-8">
                <Card className="p-6">
                    <div className="mb-4">
                        <h2 className="text-lg font-medium text-gray-900">Pending Requests</h2>
                        <p className="text-sm text-gray-500">
                            Your asset requests that are waiting for approval from HR.
                        </p>
                    </div>
                    <PendingRequests />
                </Card>
            </div>

            {/* Quick Actions section */}
            <div className="mb-8">
                <Card className="p-6">
                    <div className="mb-4">
                        <h2 className="text-lg font-medium text-gray-900">Quick Actions</h2>
                        <p className="text-sm text-gray-500">
                            Common tasks you might want to perform.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Link
                            to="/dashboard/requestAssets"
                            className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                        >
                            <FiPackage className="h-6 w-6 text-blue-500 mr-3" />
                            <div>
                                <h3 className="font-medium text-blue-700">Request New Asset</h3>
                                <p className="text-sm text-blue-600">Browse available assets</p>
                            </div>
                        </Link>
                        <Link
                            to="/dashboard/myRequestedAssets"
                            className="flex items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                        >
                            <FiClipboard className="h-6 w-6 text-purple-500 mr-3" />
                            <div>
                                <h3 className="font-medium text-purple-700">View My Requests</h3>
                                <p className="text-sm text-purple-600">Check all your requests</p>
                            </div>
                        </Link>
                        <Link
                            to="/dashboard/myAssets"
                            className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                        >
                            <FiCheckCircle className="h-6 w-6 text-green-500 mr-3" />
                            <div>
                                <h3 className="font-medium text-green-700">Manage My Assets</h3>
                                <p className="text-sm text-green-600">View and return assets</p>
                            </div>
                        </Link>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default EmployeeHome;