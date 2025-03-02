import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { DataContext } from "../context/DataProvider";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { EyeIcon, EyeOffIcon } from "@heroicons/react/outline";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

function Login() {
  const { setUser } = useContext(DataContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const navigate = useNavigate();

  const validateForm = () => {
    if (!username.trim()) {
      toast.error("Username is required.");
      return false;
    }
    if (!password.trim()) {
      toast.error("Password is required.");
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    if (!validateForm()) return; // Stop if validation fails
    setIsLoading(true); // Set loading state

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
        credentials: "include", // Include cookies
      });

      const data = await res.json();

      if (res.ok) {
        setUser(data.user); // Set user in context
        navigate("/", { state: { loginSuccess: true } });
        toast.success("Login successful! Welcome back.");
      } else {
        toast.error(data.message || "Invalid credentials. Please try again.");
      }
    } catch (error) {
      toast.error("Login failed. Please check your connection and try again.");
      console.error("Login Error:", error);
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  const handleGoogleLogin = async (credentialResponse) => {
    setIsLoading(true); // Set loading state

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/google-login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // Include cookies
          body: JSON.stringify({ token: credentialResponse.credential }),
        }
      );
      const data = await res.json();

      if (res.ok) {
        setUser(data.user); // Set user in context
        navigate("/"); // Redirect to homepage
        toast.success("Google Login successful!");
      } else {
        toast.error(data.message || "Google login failed. Please try again.");
      }
    } catch (error) {
      toast.error("Google login failed. Please check your connection and try again.");
      console.error("Google Login Error:", error);
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-purple-50 flex flex-col justify-center items-center">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <h1 className="text-4xl font-bold text-center text-gray-800 my-5">
          Welcome to MockInt
        </h1>

        <div className="flex justify-center items-center my-5">
          <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
            <GoogleLogin
              onSuccess={handleGoogleLogin}
              onError={() => toast.error("Google login failed.")}
              cookiePolicy={"single_host_origin"}
              uxMode="redirect"
            />
          </GoogleOAuthProvider>
        </div>

        <div className="flex items-center justify-center my-5">
          <div className="border-t border-gray-300 flex-grow"></div>
          <span className="mx-4 text-gray-500">Or, sign in with your username</span>
          <div className="border-t border-gray-300 flex-grow"></div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              placeholder="johndoe"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {!showPassword ? (
                  <EyeOffIcon className="h-5 w-5 text-gray-500" />
                ) : (
                  <EyeIcon className="h-5 w-5 text-gray-500" />
                )}
              </button>
            </div>
          </div>
          <button
            onClick={handleLogin}
            disabled={isLoading} // Disable button while loading
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>

          <p className="text-center text-gray-600">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-600 hover:text-blue-700 font-semibold">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;