import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import useAnHR from '../Hooks/UseAnHR';
import LoadingSpinner from './LoadingSpinner';

/**
 * Component that redirects users to the appropriate dashboard home page
 * based on their role (HR or Employee)
 */
const DashboardRedirect = () => {
  const { isHR, isHRLoading } = useAnHR();

  // Show loading spinner while checking role
  if (isHRLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Redirect based on role
  return isHR ? (
    <Navigate to="/dashboard/home" replace />
  ) : (
    <Navigate to="/dashboard/employeeHome" replace />
  );
};

export default DashboardRedirect;
