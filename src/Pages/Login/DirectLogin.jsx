import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDatabase, ref, get } from "firebase/database";
import Swal from "sweetalert2";

const DirectLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("hr@techsolutions.com");
  const [password, setPassword] = useState("Password123!");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const database = getDatabase();

  const handleDirectLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Check if the user exists in the database
      const userSnapshot = await get(ref(database, 'users'));
      let userExists = false;
      let userData = null;

      if (userSnapshot.exists()) {
        const users = userSnapshot.val();
        for (const key in users) {
          if (users[key].email === email) {
            // For demo purposes, we're not checking the password
            // In a real app, you would verify the password here
            userExists = true;
            userData = { id: key, ...users[key] };
            break;
          }
        }
      }

      if (!userExists) {
        setError("User not found in the database");
        setLoading(false);
        return;
      }

      // Simulate successful login for demo purposes
      Swal.fire({
        icon: "success",
        title: "Demo Login Successful",
        text: "Logging in with demo credentials for testing purposes.",
        showConfirmButton: false,
        timer: 1500,
      });

      // Store user data in localStorage to simulate authentication
      localStorage.setItem('demo-user', JSON.stringify(userData));

      // Navigate to dashboard
      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-green-600 mb-6">
          Direct Login for Testing
        </h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleDirectLogin}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 rounded font-medium hover:bg-green-700 transition duration-300"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-gray-600">
            This is a direct login component for testing purposes.
          </p>
          <p className="text-gray-600 mt-2">
            Default credentials: hr@techsolutions.com / Password123!
          </p>
        </div>
      </div>
    </div>
  );
};

export default DirectLogin;
