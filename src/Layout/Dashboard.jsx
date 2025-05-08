import { useState, useContext } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { AuthContext } from "../Providers/AuthProvider";
import useAnHR from "../Hooks/UseAnHR";
import useUserData from "../Hooks/useUserData";
import {
  FiHome,
  FiList,
  FiUsers,
  FiClipboard,
  FiPackage,
  FiMenu,
  FiX,
  FiLogOut,
  FiUser,
  FiBell
} from "react-icons/fi";
import LoadingSpinner from "../components/LoadingSpinner";

const Dashboard = () => {
  const { logOut, user } = useContext(AuthContext);
  const { userData } = useUserData();
  const { isHR, isHRLoading } = useAnHR();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();

  const handleLogout = () => {
    logOut()
      .then(() => {})
      .catch(error => console.error(error));
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // HR navigation items
  const hrNavItems = [
    { name: "HR Dashboard", icon: <FiHome className="w-5 h-5" />, path: "/dashboard/home" },
    { name: "Assets List", icon: <FiList className="w-5 h-5" />, path: "/dashboard/assetList" },
    { name: "All Requests", icon: <FiClipboard className="w-5 h-5" />, path: "/dashboard/request" },
    { name: "Employee List", icon: <FiUsers className="w-5 h-5" />, path: "/dashboard/myEmployeeList" },
  ];

  // Employee navigation items
  const employeeNavItems = [
    { name: "Employee Dashboard", icon: <FiHome className="w-5 h-5" />, path: "/dashboard/employeeHome" },
    { name: "My Assets", icon: <FiPackage className="w-5 h-5" />, path: "/dashboard/myAssets" },
    { name: "My Requests", icon: <FiClipboard className="w-5 h-5" />, path: "/dashboard/myRequestedAssets" },
    { name: "My Team", icon: <FiUsers className="w-5 h-5" />, path: "/dashboard/myTeam" },
    { name: "Request Assets", icon: <FiPackage className="w-5 h-5" />, path: "/dashboard/requestAssets" },
  ];

  // Common navigation items
  const commonNavItems = [
    { name: "Home", icon: <FiHome className="w-5 h-5" />, path: "/" },
    { name: "Profile", icon: <FiUser className="w-5 h-5" />, path: "/dashboard/profile" },
  ];

  // Check if a nav item is active
  const isActive = (path) => {
    return location.pathname === path;
  };

  if (isHRLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100 relative">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 flex flex-col z-0 w-64 bg-white shadow-lg transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 transition-transform duration-300 ease-in-out`}
      >
        {/* Sidebar header */}
        <div className="h-16 z-10 flex items-center justify-between px-4 border-b border-gray-200">
          {userData?.company_logo ? (
            <Link to="/" className="flex items-center">
              <img
                src={userData.company_logo}
                alt="Company Logo"
                className="h-8 w-8 rounded-full"
              />
              <span className="ml-2 text-lg font-semibold text-gray-900">
                {userData?.company_name || "Trinet"}
              </span>
            </Link>
          ) : (
            <Link to="/" className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center text-white font-bold">
                T
              </div>
              <span className="ml-2 text-lg font-semibold text-gray-900">Trinet</span>
            </Link>
          )}
          <button
            className="lg:hidden text-gray-500 hover:text-gray-700 focus:outline-none"
            onClick={toggleSidebar}
          >
            <FiX className="h-6 w-6" />
          </button>
        </div>

        {/* Sidebar content */}
        <div className="flex-1 overflow-y-auto py-4 px-3">
          <nav className="space-y-1">
            {/* HR or Employee navigation items */}
            <div className="mb-4">
              <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                {isHR ? "HR Management" : "Employee Portal"}
              </p>
              {(isHR ? hrNavItems : employeeNavItems).map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) =>
                    `group flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                      isActive
                        ? 'bg-primary-50 text-primary-600'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }`
                  }
                >
                  <span className={`mr-3 ${
                    isActive(item.path) ? 'text-primary-500' : 'text-gray-500 group-hover:text-gray-500'
                  }`}>
                    {item.icon}
                  </span>
                  {item.name}
                </NavLink>
              ))}
            </div>

            {/* Common navigation items */}
            <div className="pt-4 border-t border-gray-200">
              <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                General
              </p>
              {commonNavItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) =>
                    `group flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                      isActive
                        ? 'bg-primary-50 text-primary-600'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }`
                  }
                >
                  <span className={`mr-3 ${
                    isActive(item.path) ? 'text-primary-500' : 'text-gray-500 group-hover:text-gray-500'
                  }`}>
                    {item.icon}
                  </span>
                  {item.name}
                </NavLink>
              ))}

              {/* Logout button */}
              <button
                onClick={handleLogout}
                className="w-full group flex items-center px-3 py-2 text-sm font-medium rounded-md text-red-600 hover:bg-red-50 hover:text-red-700"
              >
                <FiLogOut className="mr-3 h-5 w-5" />
                Sign out
              </button>
            </div>
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden lg:ml-64 z-50 relative">
        {/* Top navigation */}
        <header className="bg-white shadow-sm z-10">
          <div className="h-16 flex items-center justify-end px-4 md:px-6">
            {/* Mobile menu button */}
            <button
              className="lg:hidden text-gray-500 hover:text-gray-700 focus:outline-none"
              onClick={toggleSidebar}
            >
              <FiMenu className="h-6 w-6" />
            </button>

            {/* Page title - mobile */}
            <div className="lg:hidden">
              <h1 className="text-lg font-semibold text-gray-900">Dashboard</h1>
            </div>

            {/* Right side navigation items */}
            <div className="flex items-center space-x-4">
              {/* Notifications dropdown */}
              <div className="relative">
                <button
                  className="text-gray-500 hover:text-gray-700 focus:outline-none"
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                >
                  <FiBell className="h-6 w-6" />
                  <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
                </button>

                {notificationsOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                    <div className="py-2 px-4 border-b border-gray-200">
                      <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                    </div>
                    <div className="max-h-60 overflow-y-auto">
                      <div className="py-2 px-4 border-b border-gray-200 hover:bg-gray-50">
                        <p className="text-sm font-medium text-gray-900">New asset request</p>
                        <p className="text-xs text-gray-500">John Doe requested a laptop</p>
                        <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
                      </div>
                      <div className="py-2 px-4 border-b border-gray-200 hover:bg-gray-50">
                        <p className="text-sm font-medium text-gray-900">Request approved</p>
                        <p className="text-xs text-gray-500">Your monitor request was approved</p>
                        <p className="text-xs text-gray-400 mt-1">Yesterday</p>
                      </div>
                    </div>
                    <div className="py-2 px-4">
                      <a href="#" className="text-xs text-primary-600 hover:text-primary-500">View all notifications</a>
                    </div>
                  </div>
                )}
              </div>

              {/* User dropdown */}
              <div className="relative">
                <button
                  className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 focus:outline-none"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                >
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                    {user?.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt={user.displayName || 'User'}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <FiUser className="w-5 h-5 text-gray-500" />
                    )}
                  </div>
                  <span className="hidden md:block text-sm font-medium">
                    {user?.displayName?.split(' ')[0] || 'User'}
                  </span>
                </button>

                {userMenuOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                    <div className="py-1">
                      <Link
                        to="/dashboard/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        Your Profile
                      </Link>
                      <Link
                        to="/settings"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        Settings
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      >
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto bg-gray-100 p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
