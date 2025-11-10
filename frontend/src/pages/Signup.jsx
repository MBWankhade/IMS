import React, { useContext, useState } from "react";
import { DataContext } from "../context/DataProvider";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { EyeIcon, EyeOffIcon } from "@heroicons/react/outline";
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

const displayImage = "/src/assets/displayImage.jpg";

function Signup() {
  const { setUser } = useContext(DataContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async () => {
    if (!name || !email || !username || !password || !confirmPassword) {
      toast.error("All fields are required.");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Password and Confirm Password do not match.");
      return;
    }
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Required for browser to accept cookie
        body: JSON.stringify({ name, email, username, password, confirmPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message);
        return;
      }

      toast.success("Signup successful!");
      setUser(data.data);
      localStorage.setItem("token", data.token);
      navigate("/complete-profile", { state: { signupSuccess: true } });
    } catch (error) {
      toast.error(error.message);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async (credentialResponse) => {
    try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/google-signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ token: credentialResponse.credential }),
      });
      const data = await res.json();

      if (res.ok) {
        setUser(data.user);
        localStorage.setItem("token", data.token);
        localStorage.setItem("googleSignupSuccess", "true");
        toast.success("Google Signup successful!");
        navigate("/complete-profile");
      } else if (data.needsLogin) {
        toast.info("Account already exists. Redirecting to login...");
        navigate("/login");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Google signup failed. Please try again.");
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

      <ToastContainer 
        position="top-right" 
        autoClose={3000} 
        hideProgressBar={false} 
        theme="dark"
        toastStyle={{
          background: 'rgba(17, 24, 39, 0.9)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}
      />
      
      {/* Left side: Custom designed hero section */}
      <div className="hidden md:block w-1/2 relative bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl animate-pulse animation-delay-4000"></div>
        </div>

        {/* Geometric patterns */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 border border-purple-400 rotate-45"></div>
          <div className="absolute top-40 right-20 w-24 h-24 border border-blue-400 rotate-12"></div>
          <div className="absolute bottom-32 left-16 w-40 h-40 border border-indigo-400 rotate-75"></div>
          <div className="absolute bottom-20 right-32 w-20 h-20 border border-pink-400 rotate-30"></div>
        </div>

        {/* Central content area */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center p-12 text-center">
          {/* Icon/Logo area */}
          <div className="mb-8 relative">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-purple-500/25 rotate-3 hover:rotate-6 transition-transform duration-300">
              <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full animate-bounce"></div>
          </div>

          {/* Main heading */}
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent leading-tight">
            Master Your
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              Interview Skills
            </span>
          </h1>

          {/* Description */}
          <p className="text-gray-300 text-lg leading-relaxed mb-8 max-w-md">
            Join thousands of students who've transformed their career prospects with our comprehensive interview preparation platform.
          </p>

          {/* Feature highlights */}
          <div className="space-y-4 text-left">
            <div className="flex items-center space-x-3 text-gray-300">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm">AI-Powered Mock Interviews</span>
            </div>
            <div className="flex items-center space-x-3 text-gray-300">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse animation-delay-1000"></div>
              <span className="text-sm">Real-time Performance Analytics</span>
            </div>
            <div className="flex items-center space-x-3 text-gray-300">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse animation-delay-2000"></div>
              <span className="text-sm">Industry-Specific Preparation</span>
            </div>
          </div>

          {/* Bottom decorative element */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
            <div className="flex space-x-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce animation-delay-200"></div>
              <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce animation-delay-400"></div>
            </div>
          </div>
        </div>

        {/* Floating elements */}
        <div className="absolute top-16 right-16 w-4 h-4 bg-yellow-400 rounded-full animate-float"></div>
        <div className="absolute bottom-32 left-12 w-3 h-3 bg-pink-400 rounded-full animate-float animation-delay-3000"></div>
        <div className="absolute top-1/3 right-8 w-2 h-2 bg-green-400 rounded-full animate-float animation-delay-1000"></div>
      </div>

      {/* Right side: Full height form section */}
      <div className="w-full md:w-1/2 relative bg-gray-900 overflow-y-auto">
        <div className="min-h-full flex flex-col justify-center px-8 py-6">
          <div className="w-full max-w-md mx-auto">
            <div className="text-center mb-6">
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Welcome to MockInt
              </h1>
              <p className="text-gray-300 text-sm">Create your account and unlock your potential</p>
            </div>

            {/* Google Login */}
            <div className="flex flex-col items-center mb-5">
              <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
                <div className="transform hover:scale-105 transition-transform duration-200">
                  <GoogleLogin
                    onSuccess={handleGoogleSignup}
                    onError={() => toast.error("Google signup failed.")}
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
            <div className="flex items-center my-5">
              <div className="flex-grow h-px bg-gradient-to-r from-transparent via-gray-500 to-transparent"></div>
              <span className="mx-4 text-gray-400 text-sm font-medium">Or continue with email</span>
              <div className="flex-grow h-px bg-gradient-to-r from-transparent via-gray-500 to-transparent"></div>
            </div>

            {/* Form fields */}
            <div className="space-y-4">
              <div className="group">
                <label className="block text-gray-300 mb-2 font-medium text-sm">Full Name</label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-gray-800 text-white placeholder-gray-400 
                           focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-gray-700
                           border border-gray-600 hover:border-gray-500 transition-all duration-200"
                />
              </div>

              <div className="group">
                <label className="block text-gray-300 mb-2 font-medium text-sm">Email Address</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-gray-800 text-white placeholder-gray-400 
                           focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-gray-700
                           border border-gray-600 hover:border-gray-500 transition-all duration-200"
                />
              </div>

              <div className="group">
                <label className="block text-gray-300 mb-2 font-medium text-sm">Username</label>
                <input
                  type="text"
                  placeholder="Choose a username"
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
                    placeholder="Create a strong password"
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

              <div className="group">
                <label className="block text-gray-300 mb-2 font-medium text-sm">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-gray-800 text-white placeholder-gray-400 
                             focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-gray-700
                             border border-gray-600 hover:border-gray-500 transition-all duration-200 pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200"
                    tabIndex={-1}
                  >
                    {!showConfirmPassword ? (
                      <EyeOffIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit button */}
              <button
                onClick={handleSignup}
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
                      Creating Account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>

              <p className="text-center text-gray-300 mt-6">
                Already have an account?{" "}
                <Link 
                  to="/login" 
                  className="text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text hover:from-purple-300 hover:to-pink-300 font-semibold transition-all duration-200 hover:underline"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
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

export default Signup;