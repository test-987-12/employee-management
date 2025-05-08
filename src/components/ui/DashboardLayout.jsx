import { useState, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { AuthContext } from '../../Providers/AuthProvider';
import { 
  FiMenu, FiX, FiHome, FiUsers, FiBox, FiClipboard, 
  FiSettings, FiLogOut, FiUser, FiBarChart2, FiDollarSign,
  FiChevronDown, FiChevronRight, FiBell
} from 'react-icons/fi';

/**
 * Modern, professional Dashboard Layout component
 */
const DashboardLayout = ({ children }) => {
  const { user, logOut } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Handle logout
  const handleLogout = () => {
    logOut()
      .then(() => {
        navigate('/');
      })
      .catch((error) => console.error(error));
  };
  
  // Navigation items
  const hrNavItems = [
    { name: 'Dashboard', icon: <FiHome />, path: '/dashboard' },
    { name: 'Employees', icon: <FiUsers />, path: '/dashboard/employees' },
    { name: 'Assets', icon: <FiBox />, path: '/dashboard/assets' },
    { name: 'Requests', icon: <FiClipboard />, path: '/dashboard/requests' },
    { name: 'Reports', icon: <FiBarChart2 />, path: '/dashboard/reports' },
    { name: 'Payments', icon: <FiDollarSign />, path: '/dashboard/payments' },
  ];
  
  const employeeNavItems = [
    { name: 'Dashboard', icon: <FiHome />, path: '/dashboard' },
    { name: 'Request Assets', icon: <FiBox />, path: '/dashboard/request-assets' },
    { name: 'My Requests', icon: <FiClipboard />, path: '/dashboard/my-requests' },
    { name: 'Monthly Requests', icon: <FiClipboard />, path: '/dashboard/monthly-requests' },
    { name: 'My Team', icon: <FiUsers />, path: '/dashboard/my-team' },
  ];
  
  // Determine which navigation items to show based on user role
  // This is a placeholder - you should replace with your actual role logic
  const isHR = user?.email?.includes('hr');
  const navItems = isHR ? hrNavItems : employeeNavItems;
  
  // Check if a nav item is active
  const isActive = (path) => {
    return location.pathname === path;
  };
  
  // Toggle sidebar on mobile
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
      
      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 flex flex-col z-50 w-64 bg-white shadow-lg transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 transition-transform duration-300 ease-in-out`}
      >
        {/* Sidebar header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
          <Link to="/" className="flex items-center">
            <img
              src="https://i.ibb.co/Wff1shd/download-1.jpg"
              alt="Logo"
              className="h-8 w-8 rounded-full"
            />
            <span className="ml-2 text-lg font-semibold text-gray-900">Trinet</span>
          </Link>
          <button
            className="md:hidden text-gray-500 hover:text-gray-700 focus:outline-none"
            onClick={toggleSidebar}
          >
            <FiX className="h-6 w-6" />
          </button>
        </div>
        
        {/* Sidebar content */}
        <div className="flex-1 overflow-y-auto py-4 px-3">
          <nav className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  isActive(item.path)
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <span className={`mr-3 h-5 w-5 ${
                  isActive(item.path) ? 'text-primary-500' : 'text-gray-500 group-hover:text-gray-500'
                }`}>
                  {item.icon}
                </span>
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
        
        {/* Sidebar footer */}
        <div className="p-4 border-t border-gray-200">
          <Link
            to="/profile"
            className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-50 hover:text-gray-900"
          >
            <FiSettings className="mr-3 h-5 w-5 text-gray-500" />
            Settings
          </Link>
          <button
            onClick={handleLogout}
            className="mt-1 flex items-center px-3 py-2 text-sm font-medium text-red-600 rounded-md hover:bg-red-50 hover:text-red-700 w-full text-left"
          >
            <FiLogOut className="mr-3 h-5 w-5" />
            Sign out
          </button>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top navigation */}
        <header className="bg-white shadow-sm z-10">
          <div className="h-16 flex items-center justify-between px-4 md:px-6">
            {/* Mobile menu button */}
            <button
              className="md:hidden text-gray-500 hover:text-gray-700 focus:outline-none"
              onClick={toggleSidebar}
            >
              <FiMenu className="h-6 w-6" />
            </button>
            
            {/* Page title - mobile */}
            <div className="md:hidden">
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
                  <FiChevronDown className="hidden md:block w-4 h-4" />
                </button>
                
                {userMenuOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                    <div className="py-1">
                      <Link
                        to="/profile"
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
          {children}
        </main>
      </div>
    </div>
  );
};

DashboardLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default DashboardLayout;
