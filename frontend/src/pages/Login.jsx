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
  const [isLoading, setIsLoading] = useState(false);
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
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok) {
        setUser(data.user);
        localStorage.setItem("token", data.token);
        toast.success("Login successful! Welcome back.");
        navigate("/", { state: { loginSuccess: true } });
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Login failed. Please try again.");
      console.error("Login Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/google-login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ token: credentialResponse.credential }),
        }
      );
      const data = await res.json();

      if (res.ok) {
        setUser(data.user);
        localStorage.setItem("token", data.token);
        localStorage.setItem("googleLoginSuccess", "true");
        toast.success("Google Login successful!");
        navigate("/");
      } else if (data.needsSignup) {
        toast.info(data.message);
        navigate("/signup");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Google login failed. Please try again.");
      console.log(error);
    }
  };

  return (
    <div className="h-screen flex overflow-hidden">
      {/* Enhanced animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.3),transparent)] animate-pulse"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      

      {/* Left side: Login form section */}
      <div className="w-full md:w-1/2 relative bg-gray-900 overflow-y-auto">
        <div className="min-h-full flex flex-col justify-center px-8 py-6">
          <div className="w-full max-w-md mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Welcome Back
              </h1>
              <p className="text-gray-300 text-sm">Sign in to continue your interview preparation journey</p>
            </div>

            {/* Google Login */}
            <div className="flex flex-col items-center mb-6">
              <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
                <div className="transform hover:scale-105 transition-transform duration-200">
                  <GoogleLogin
                    onSuccess={handleGoogleLogin}
                    onError={() => toast.error("Google login failed.")}
                    cookiePolicy={"single_host_origin"}
                    uxMode="redirect"
                    text="continue_with"
                    theme="filled_black"
                    width="300"
                  />
                </div>
              </GoogleOAuthProvider>
            </div>

            {/* Divider */}
            <div className="flex items-center my-6">
              <div className="flex-grow h-px bg-gradient-to-r from-transparent via-gray-500 to-transparent"></div>
              <span className="mx-4 text-gray-400 text-sm font-medium">Or sign in with username</span>
              <div className="flex-grow h-px bg-gradient-to-r from-transparent via-gray-500 to-transparent"></div>
            </div>

            {/* Form fields */}
            <div className="space-y-5">
              <div className="group">
                <label className="block text-gray-300 mb-2 font-medium text-sm">Username</label>
                <input
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-gray-800 text-white placeholder-gray-400 
                           focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-gray-700
                           border border-gray-600 hover:border-gray-500 transition-all duration-200"
                />
              </div>

              <div className="group">
                <label className="block text-gray-300 mb-2 font-medium text-sm">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-gray-800 text-white placeholder-gray-400 
                             focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-gray-700
                             border border-gray-600 hover:border-gray-500 transition-all duration-200 pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200"
                    tabIndex={-1}
                  >
                    {!showPassword ? (
                      <EyeOffIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Forgot password link */}
              <div className="text-right">
                <Link 
                  to="/forgot-password" 
                  className="text-sm text-purple-400 hover:text-purple-300 transition-colors duration-200"
                >
                  Forgot Password?
                </Link>
              </div>

              {/* Submit button */}
              <button
                onClick={handleLogin}
                disabled={isLoading}
                className="w-full py-4 mt-6 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 
                         hover:from-purple-700 hover:via-blue-700 hover:to-indigo-700 
                         rounded-xl text-white font-bold shadow-lg shadow-purple-500/25 
                         transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-purple-500/40
                         disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                         relative overflow-hidden group"
              >
                <span className="relative z-10 flex items-center justify-center">
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing In...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>

              <p className="text-center text-gray-300 mt-8">
                Don't have an account?{" "}
                <Link 
                  to="/signup" 
                  className="text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text hover:from-purple-300 hover:to-pink-300 font-semibold transition-all duration-200 hover:underline"
                >
                  Create Account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right side: Custom designed hero section */}
      <div className="hidden md:block w-1/2 relative bg-gradient-to-bl from-slate-900 via-indigo-900 to-slate-900 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-16 right-16 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-24 left-24 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
          <div className="absolute top-1/3 right-1/3 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse animation-delay-4000"></div>
        </div>

        {/* Code-like pattern overlay */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-12 font-mono text-xs text-purple-400 leading-relaxed">
            {'const success = () => {\n  return interview.prepare()\n    .then(practice)\n    .then(excel);\n};'}
          </div>
          <div className="absolute bottom-32 right-16 font-mono text-xs text-blue-400 leading-relaxed">
            {'if (prepared) {\n  career.advance();\n  confidence.boost();\n}'}
          </div>
        </div>

        {/* Geometric patterns */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-16 right-12 w-28 h-28 border border-indigo-400 rotate-12"></div>
          <div className="absolute top-48 left-20 w-20 h-20 border border-purple-400 rotate-45"></div>
          <div className="absolute bottom-40 right-24 w-36 h-36 border border-blue-400 rotate-75"></div>
          <div className="absolute bottom-16 left-16 w-16 h-16 border border-pink-400 rotate-30"></div>
        </div>

        {/* Central content area */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center p-12 text-center">
          {/* Icon/Logo area */}
          <div className="mb-8 relative">
            <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-500/25 -rotate-3 hover:-rotate-6 transition-transform duration-300">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 rounded-full animate-pulse"></div>
          </div>

          {/* Main heading */}
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-white via-indigo-200 to-purple-200 bg-clip-text text-transparent leading-tight">
            Continue Your
            <br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
              Success Journey
            </span>
          </h1>

          {/* Description */}
          <p className="text-gray-300 text-lg leading-relaxed mb-8 max-w-md">
            Welcome back! Continue building your confidence and mastering the skills that will land you your dream job.
          </p>

          {/* Stats/achievements */}
          <div className="grid grid-cols-3 gap-6 text-center mb-8">
            <div className="group">
              <div className="text-2xl font-bold text-purple-400 mb-1 group-hover:scale-110 transition-transform duration-200">50K+</div>
              <div className="text-gray-400 text-xs">Students</div>
            </div>
            <div className="group">
              <div className="text-2xl font-bold text-blue-400 mb-1 group-hover:scale-110 transition-transform duration-200">95%</div>
              <div className="text-gray-400 text-xs">Success Rate</div>
            </div>
            <div className="group">
              <div className="text-2xl font-bold text-indigo-400 mb-1 group-hover:scale-110 transition-transform duration-200">500+</div>
              <div className="text-gray-400 text-xs">Companies</div>
            </div>
          </div>

          {/* Bottom decorative element */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
            <div className="flex space-x-2">
              <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce animation-delay-200"></div>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce animation-delay-400"></div>
            </div>
          </div>
        </div>

        {/* Floating elements */}
        <div className="absolute top-12 left-16 w-3 h-3 bg-indigo-400 rounded-full animate-float"></div>
        <div className="absolute bottom-24 right-12 w-4 h-4 bg-purple-400 rounded-full animate-float animation-delay-3000"></div>
        <div className="absolute top-2/3 left-8 w-2 h-2 bg-blue-400 rounded-full animate-float animation-delay-1000"></div>
      </div>

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .animation-delay-200 {
          animation-delay: 0.2s;
        }
        .animation-delay-400 {
          animation-delay: 0.4s;
        }
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        .animation-delay-3000 {
          animation-delay: 3s;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(180deg); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

export default Login;