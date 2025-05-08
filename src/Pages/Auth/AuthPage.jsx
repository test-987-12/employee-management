import { useContext, useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../Providers/AuthProvider";
import { FaEye, FaEyeSlash, FaGoogle } from "react-icons/fa";
import Swal from "sweetalert2";
import PageTitle from "../../components/PageTitle";
import axios from "axios";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import { setAuthToken, isAuthenticated } from "../../utils/auth";

const AuthPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const axiosPublic = useAxiosPublic();
  const { createUser, signInUser, signInWithGoogle, updateUserProfile, setUser, user } = useContext(AuthContext);

  // State management
  const [activeTab, setActiveTab] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [userType, setUserType] = useState("employee");
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");

  // Check if user is already authenticated
  useEffect(() => {
    const checkAuth = async () => {
      console.log("AuthPage - Checking if already authenticated");

      // Check if user is already authenticated
      const authenticated = isAuthenticated() || !!user;
      console.log("AuthPage - Already authenticated:", authenticated);

      if (authenticated) {
        console.log("AuthPage - User already authenticated, redirecting to dashboard");
        // Redirect to the intended destination or dashboard
        const from = location.state?.from || "/dashboard";
        navigate(from, { replace: true });
      }
    };

    checkAuth();
  }, [navigate, location, user]);

  // Handle login form submission
  const handleLogin = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError("");

    const form = e.target;
    const email = form.email.value;
    const password = form.password.value;

    try {
      console.log("AuthPage - Attempting login with:", email);
      const result = await signInUser(email, password);
      const user = result.user;
      console.log("AuthPage - Login successful, user:", user);

      // Get the token and store it using our utility function
      if (user) {
        try {
          console.log("AuthPage - Getting token for user");
          const token = await user.getIdToken();
          console.log("AuthPage - Token received:", token.substring(0, 10) + "...");

          // Use our utility function to store the token
          setAuthToken(token);

          // Double-check authentication status
          const authStatus = isAuthenticated();
          console.log("AuthPage - Authentication status after login:", authStatus);
        } catch (tokenError) {
          console.error("AuthPage - Error getting token:", tokenError);
        }
      }

      Swal.fire({
        icon: "success",
        title: "Login Successful",
        text: "You have been logged in successfully!",
        showConfirmButton: false,
        timer: 1500
      });

      // Navigate to dashboard
      console.log("AuthPage - Navigating to dashboard");
      navigate('/dashboard');
    } catch (error) {
      console.error("AuthPage - Login error:", error);
      setFormError(error.message);
    } finally {
      setFormLoading(false);
    }
  };

  // Handle signup form submission
  const handleSignup = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError("");

    const form = e.target;
    const name = form.name.value;
    const email = form.email.value;
    const password = form.password.value;
    const dob = form.dob.value;

    // Password validation
    if (password.length < 6) {
      setFormError("Password must be at least 6 characters");
      setFormLoading(false);
      return;
    } else if (!/[A-Z]/.test(password)) {
      setFormError("Password must contain at least one uppercase letter");
      setFormLoading(false);
      return;
    } else if (!/[a-z]/.test(password)) {
      setFormError("Password must contain at least one lowercase letter");
      setFormLoading(false);
      return;
    }

    try {
      // Different handling based on user type
      if (userType === "hr") {
        const company_name = form.company_name.value.replace(/\s+/g, "").toLowerCase();
        const packages = form.packages.value;
        const image = form.image.files[0];

        // Image validation
        if (!image || image.size > 1000 * 1024) {
          setFormError("Company logo is required and must be less than 1MB");
          setFormLoading(false);
          return;
        }

        // Upload image
        const formData = new FormData();
        formData.append("image", image);

        const { data } = await axios.post(
          `https://api.imgbb.com/1/upload?key=1da593b6ac6e12c2fccb2d913307f35b`,
          formData
        );

        const usersInfo = {
          name,
          email,
          password,
          company_logo: data.data.display_url,
          dob,
          company_name,
          packages,
          role: "hr",
          payment_status: true, // All assets are free to use for all users
        };

        const { data: users } = await axiosPublic.post("/users", usersInfo);

        if (users.insertedId) {
          await createUser(email, password);
          await updateUserProfile(name);
          setUser((prevUser) => ({ ...prevUser, displayName: name }));

          Swal.fire({
            icon: "success",
            title: "HR Account Created!",
            text: "You'll be redirected to the dashboard.",
            showConfirmButton: false,
            timer: 1500
          });

          navigate("/dashboard");
        }
      } else {
        // Employee signup
        const usersInfo = {
          name,
          email,
          dob,
          role: "employee",
        };

        await axiosPublic.post("/users", usersInfo);

        // Create user in Firebase Authentication
        console.log("AuthPage - Creating user in Firebase Auth");
        await createUser(email, password);

        // Update user profile
        console.log("AuthPage - Updating user profile");
        await updateUserProfile(name);

        setUser((prevUser) => ({ ...prevUser, displayName: name }));

        Swal.fire({
          icon: "success",
          title: "Employee Account Created!",
          showConfirmButton: false,
          timer: 1500
        });

        navigate("/");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      setFormError(errorMessage);
    } finally {
      setFormLoading(false);
    }
  };

  // Handle Google sign in
  const handleGoogleSignIn = async () => {
    try {
      console.log("AuthPage - Attempting Google sign in");
      const result = await signInWithGoogle();
      const user = result.user;
      console.log("AuthPage - Google sign in successful, user:", user);

      // Get the token and store it using our utility function
      if (user) {
        try {
          console.log("AuthPage - Getting token for Google user");
          const token = await user.getIdToken();
          console.log("AuthPage - Token received:", token.substring(0, 10) + "...");

          // Use our utility function to store the token
          setAuthToken(token);

          // Double-check authentication status
          const authStatus = isAuthenticated();
          console.log("AuthPage - Authentication status after Google login:", authStatus);
        } catch (tokenError) {
          console.error("AuthPage - Error getting token for Google user:", tokenError);
        }
      }

      const userInfo = {
        name: user?.displayName,
        email: user?.email,
        profile_image: user?.photoURL,
        role: "employee"
      };

      console.log("AuthPage - Saving Google user info to Firebase:", userInfo);
      await axiosPublic.post("/users", userInfo);

      Swal.fire({
        icon: "success",
        title: "Login Successful",
        showConfirmButton: false,
        timer: 1500
      });

      // Navigate to dashboard
      console.log("AuthPage - Navigating to dashboard after Google login");
      navigate("/dashboard");
    } catch (error) {
      console.error("AuthPage - Google sign in error:", error);
      setFormError(error.message);
    }
  };

  return (
    <>
      <PageTitle title={activeTab === "login" ? "Login" : "Sign Up"} />
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b">
            <button
              className={`w-1/2 py-4 px-6 text-center ${
                activeTab === "login"
                  ? "bg-green-600 text-white font-medium"
                  : "text-gray-700 hover:text-green-600"
              }`}
              onClick={() => setActiveTab("login")}
            >
              Login
            </button>
            <button
              className={`w-1/2 py-4 px-6 text-center ${
                activeTab === "signup"
                  ? "bg-green-600 text-white font-medium"
                  : "text-gray-700 hover:text-green-600"
              }`}
              onClick={() => setActiveTab("signup")}
            >
              Sign Up
            </button>
          </div>

          <div className="p-8">
            {/* Login Form */}
            {activeTab === "login" && (
              <>
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
                  Welcome Back
                </h2>
                <form onSubmit={handleLogin} className="space-y-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                      placeholder="your@email.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                      Password
                    </label>
                    <div className="relative mt-1">
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        required
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <FaEyeSlash className="text-gray-400" />
                        ) : (
                          <FaEye className="text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm">
                      <Link to="/reset-password" className="font-medium text-green-600 hover:text-green-500">
                        Forgot your password?
                      </Link>
                    </div>
                  </div>

                  {formError && (
                    <div className="text-red-500 text-sm font-medium">
                      {formError}
                    </div>
                  )}

                  <div>
                    <button
                      type="submit"
                      disabled={formLoading}
                      className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${
                        formLoading ? "opacity-70 cursor-not-allowed" : ""
                      }`}
                    >
                      {formLoading ? "Logging in..." : "Sign in"}
                    </button>
                  </div>
                </form>

                <div className="mt-6">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">Or continue with</span>
                    </div>
                  </div>

                  <div className="mt-6">
                    <button
                      onClick={handleGoogleSignIn}
                      className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <FaGoogle className="h-5 w-5 text-red-500 mr-2" />
                      Google
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* Signup Form */}
            {activeTab === "signup" && (
              <>
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
                  Create an Account
                </h2>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    I want to join as:
                  </label>
                  <div className="flex space-x-4">
                    <button
                      type="button"
                      className={`flex-1 py-2 px-4 rounded-md ${
                        userType === "employee"
                          ? "bg-green-600 text-white"
                          : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                      }`}
                      onClick={() => setUserType("employee")}
                    >
                      Employee
                    </button>
                    <button
                      type="button"
                      className={`flex-1 py-2 px-4 rounded-md ${
                        userType === "hr"
                          ? "bg-green-600 text-white"
                          : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                      }`}
                      onClick={() => setUserType("hr")}
                    >
                      HR Manager
                    </button>
                  </div>
                </div>

                <form onSubmit={handleSignup} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Full Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                      placeholder="your@email.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                      Password
                    </label>
                    <div className="relative mt-1">
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        required
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <FaEyeSlash className="text-gray-400" />
                        ) : (
                          <FaEye className="text-gray-400" />
                        )}
                      </button>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      Must be at least 6 characters with uppercase and lowercase letters
                    </p>
                  </div>

                  <div>
                    <label htmlFor="dob" className="block text-sm font-medium text-gray-700">
                      Date of Birth
                    </label>
                    <input
                      id="dob"
                      name="dob"
                      type="date"
                      required
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                    />
                  </div>

                  {/* HR-specific fields */}
                  {userType === "hr" && (
                    <>
                      <div>
                        <label htmlFor="company_name" className="block text-sm font-medium text-gray-700">
                          Company Name
                        </label>
                        <input
                          id="company_name"
                          name="company_name"
                          type="text"
                          required
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                          placeholder="Acme Inc."
                        />
                      </div>

                      <div>
                        <label htmlFor="packages" className="block text-sm font-medium text-gray-700">
                          Select a Package
                        </label>
                        <select
                          id="packages"
                          name="packages"
                          required
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                        >
                          <option value="" disabled selected>Choose your package</option>
                          <option value="basic">5 Members for $5</option>
                          <option value="standard">10 Members for $8</option>
                          <option value="premium">20 Members for $15</option>
                        </select>
                      </div>

                      <div>
                        <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                          Company Logo
                        </label>
                        <input
                          id="image"
                          name="image"
                          type="file"
                          required
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                        />
                        <p className="mt-1 text-xs text-gray-500">
                          File size should be less than 1MB
                        </p>
                      </div>
                    </>
                  )}

                  {formError && (
                    <div className="text-red-500 text-sm font-medium">
                      {formError}
                    </div>
                  )}

                  <div>
                    <button
                      type="submit"
                      disabled={formLoading}
                      className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${
                        formLoading ? "opacity-70 cursor-not-allowed" : ""
                      }`}
                    >
                      {formLoading ? "Creating account..." : "Create Account"}
                    </button>
                  </div>
                </form>

                <div className="mt-6">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">Or sign up with</span>
                    </div>
                  </div>

                  <div className="mt-6">
                    <button
                      onClick={handleGoogleSignIn}
                      className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <FaGoogle className="h-5 w-5 text-red-500 mr-2" />
                      Google
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthPage;
