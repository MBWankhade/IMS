import React, { useContext, useState } from "react";
import { DataContext } from "../context/DataProvider";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { EyeIcon, EyeOffIcon } from "@heroicons/react/outline"; 
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

function Signup() {
  const { setUser } = useContext(DataContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
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

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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
      navigate("/", { state: { signupSuccess: true } });
    } catch (error) {
      toast.error(error.message);
      console.error(error);
    }
  };   

  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/google-login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: credentialResponse.credential }),
      });
      const data = await res.json();
  
      if (res.ok) {
        setUser(data.user); // Store only user data, not the token
        localStorage.setItem("token", data.token);
        localStorage.setItem("googleLoginSuccess", "true"); 

        toast.success("Google Login successful!");
        navigate("/"); // Redirect to homepage 
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Google login failed. Please try again.");
      console.log(error); 
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-purple-50 flex flex-col justify-center items-center">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md transform transition-all">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Welcome to MockInt</h1>
        <div className="space-y-6">  
           <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email 
            </label>  
            <input type="email" placeholder="john@gmail.com" value={email} onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" /> 
          </div>     
          <div className="flex space-x-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label> 
                <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" />
              </div>  
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>  
                <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" /> 
              </div> 
          </div>    
          <div className="flex space-x-5">
      <div className="relative w-full">
        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
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

      <div className="relative w-full">
        <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
        <div className="relative">
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
          <button
            type="button"
            className="absolute inset-y-0 right-3 flex items-center"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {!showConfirmPassword ? (
              <EyeOffIcon className="h-5 w-5 text-gray-500" />
            ) : (
              <EyeIcon className="h-5 w-5 text-gray-500" />
            )}
          </button>
        </div>
      </div>
    </div>
          
           <button onClick={handleSignup} className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105">Sign Up</button>   
           {/* Divider */}
           <div className="flex items-center justify-center">
            <div className="border-t border-gray-300 flex-grow"></div>
            <span className="mx-4 text-gray-500">or</span>
            <div className="border-t border-gray-300 flex-grow"></div>
          </div>

          {/* Google Sign-In Button */}
          <div className="flex justify-center items-center">
          <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}> 
          <GoogleLogin onSuccess={handleGoogleLogin} onError={() => toast.error("Google login failed.")} cookiePolicy={"single_host_origin"} uxMode="redirect" />
          </GoogleOAuthProvider> 
          </div> 

          <p className="text-center text-gray-600">Already have an account? <Link to="/login" className="text-blue-600 hover:text-blue-700 font-semibold">Log In</Link></p>  
          
        </div>       
      </div>
    </div>
  );
}

export default Signup;

