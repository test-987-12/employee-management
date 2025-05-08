import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../Providers/AuthProvider";
import { Navigate, useLocation } from "react-router-dom";
import LoadingSpinner from "../../components/LoadingSpinner";
import PropTypes from "prop-types";
import { isAuthenticated } from "../../utils/auth";

function PrivateRoute({ children }) {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);

  console.log("PrivateRoute - User:", user);
  console.log("PrivateRoute - Loading:", loading);

  useEffect(() => {
    // Check if user is authenticated using our utility function
    const authStatus = isAuthenticated();
    console.log("PrivateRoute - Auth status from utility:", authStatus);

    // If we have a user object from context or a token in localStorage, consider authenticated
    const authenticated = !!user || authStatus;
    console.log("PrivateRoute - Final auth status:", authenticated);

    setIsUserAuthenticated(authenticated);
    setCheckingAuth(false);
  }, [user]);

  // Show loading spinner while checking authentication
  if (loading || checkingAuth) {
    console.log("PrivateRoute - Still checking auth, showing spinner");
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // If authenticated, render children
  if (isUserAuthenticated) {
    console.log("PrivateRoute - User authenticated, rendering children");
    return children;
  }

  // Otherwise redirect to login
  console.log("PrivateRoute - Not authenticated, redirecting to /auth");
  return <Navigate to="/auth" state={{ from: location }} replace />;
}

PrivateRoute.propTypes = {
  children: PropTypes.node,
};

export default PrivateRoute;
