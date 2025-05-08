import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../Providers/AuthProvider';
import Swal from 'sweetalert2';
import { FiMail, FiLock, FiAlertCircle } from 'react-icons/fi';
import { FaGoogle } from 'react-icons/fa';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('hr@techsolutions.com');
  const [password, setPassword] = useState('Password123!');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signInUser } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Check if using one of the test accounts
    const isTestAccount = (
      (email === 'hr@techsolutions.com' && password === 'Password123!') ||
      (email === 'john.doe@techsolutions.com' && password === 'Password123!')
    );

    try {
      console.log("Login.jsx - Attempting login with:", email);
      const result = await signInUser(email, password);
      const user = result.user;
      console.log("Login.jsx - Login successful, user:", user);

      // Get the token and store it in localStorage
      if (user) {
        try {
          console.log("Login.jsx - Getting token for user");
          const token = await user.getIdToken();
          console.log("Login.jsx - Token received:", token.substring(0, 10) + "...");
          localStorage.setItem('access-token', token);
          console.log("Login.jsx - Token stored in localStorage");

          // Verify token was stored
          const storedToken = localStorage.getItem('access-token');
          console.log("Login.jsx - Verified token in localStorage:", storedToken ? "Present" : "Missing");
        } catch (tokenError) {
          console.error("Login.jsx - Error getting token:", tokenError);
        }
      }

      Swal.fire({
        icon: 'success',
        title: 'Welcome back!',
        text: 'You have successfully logged in.',
        showConfirmButton: false,
        timer: 1500,
      });

      console.log("Login.jsx - Navigating to dashboard");
      navigate('/dashboard');
    } catch (error) {
      console.error("Login.jsx - Login error:", error);
      console.error("Login error:", error);

      // Provide more user-friendly error messages
      let errorMessage = "Login failed. Please try again.";
      let showHelp = false;

      if (error.code === 'auth/user-not-found') {
        errorMessage = "No account found with this email. Please check your email or register.";
        showHelp = isTestAccount;
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = "Incorrect password. Please try again.";
        showHelp = isTestAccount;
      } else if (error.code === 'auth/invalid-credential') {
        errorMessage = "Invalid login credentials. Please check your email and password.";
        showHelp = isTestAccount;
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = "Too many failed login attempts. Please try again later.";
        showHelp = isTestAccount;
      }

      if (showHelp && isTestAccount) {
        // For test accounts, show a more helpful message
        Swal.fire({
          icon: "warning",
          title: "Authentication Issue",
          html: `
            <p>${errorMessage}</p>
            <p class="mt-4 text-sm">For demonstration purposes, you need to run the user creation script:</p>
            <pre class="mt-2 p-2 bg-gray-100 rounded text-left text-xs">node create-demo-users.js</pre>
            <p class="mt-4 text-sm">This will create the necessary authentication accounts.</p>
          `,
          confirmButtonText: "Got it"
        });
      } else {
        // Standard error message
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link to="/" className="inline-flex items-center justify-center">
            <img
              src="https://i.ibb.co/Wff1shd/download-1.jpg"
              alt="Trinet Logo"
              className="h-12 w-12 rounded-full"
            />
          </Link>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Or{' '}
            <Link to="/register" className="font-medium text-primary-600 hover:text-primary-500">
              create a new account
            </Link>
          </p>
        </div>

        <Card className="px-6 py-8">
          {/* Demo credentials info */}
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 text-sm text-blue-700 rounded">
            <p className="font-bold">Demo Credentials</p>
            <p>HR: hr@techsolutions.com / Password123!</p>
            <p>Employee: john.doe@techsolutions.com / Password123!</p>
            <p className="mt-2 text-xs">Note: You may need to run the script <code>node create-demo-users.js</code> first.</p>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded flex items-start">
              <FiAlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <Input
              id="email"
              name="email"
              type="email"
              label="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<FiMail className="h-5 w-5 text-gray-400" />}
              required
              autoComplete="email"
            />

            <Input
              id="password"
              name="password"
              type="password"
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={<FiLock className="h-5 w-5 text-gray-400" />}
              required
              autoComplete="current-password"
            />

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link to="/reset-password" className="font-medium text-primary-600 hover:text-primary-500">
                  Forgot your password?
                </Link>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              fullWidth
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="mt-6">
              <Button
                type="button"
                variant="outline"
                fullWidth
                icon={<FaGoogle className="h-5 w-5" />}
                iconPosition="left"
              >
                Sign in with Google
              </Button>
            </div>
          </div>
        </Card>

        <p className="mt-8 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to="/register" className="font-medium text-primary-600 hover:text-primary-500">
            Sign up now
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
