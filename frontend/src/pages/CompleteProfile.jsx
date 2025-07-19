import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { DataContext } from "../context/DataProvider";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CompleteProfile = () => {
  const { user } = useContext(DataContext);
  const { setUser } = useContext(DataContext);
  const [formData, setFormData] = useState({
    college: "",
    branch: "",
    prn: "",
    batch: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.college || !formData.branch || !formData.prn || !formData.batch) {
      toast.error("All fields are required.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/complete-profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Profile updated successfully!");
        setUser(data.user)
        setTimeout(() => navigate("/"), 1500);
      } else {
        toast.error(data.message || "Failed to update profile");
      }
    } catch (error) {
      console.error(error);
      toast.error("Server error. Try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex overflow-hidden">
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

      {/* Left side: Hero section */}
      <div className="hidden lg:block w-1/2 relative bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
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
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
              </svg>
            </div>
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-400 rounded-full animate-bounce"></div>
          </div>

          {/* Main heading */}
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent leading-tight">
            Complete Your
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              Profile
            </span>
          </h1>

          {/* Description */}
          <p className="text-gray-300 text-lg leading-relaxed mb-8 max-w-md">
            Just a few more details to personalize your interview preparation experience and get started.
          </p>

          {/* Feature highlights */}
          <div className="space-y-4 text-left">
            <div className="flex items-center space-x-3 text-gray-300">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm">Personalized Content</span>
            </div>
            <div className="flex items-center space-x-3 text-gray-300">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse animation-delay-1000"></div>
              <span className="text-sm">Academic Integration</span>
            </div>
            <div className="flex items-center space-x-3 text-gray-300">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse animation-delay-2000"></div>
              <span className="text-sm">Progress Tracking</span>
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

      {/* Right side: Form section */}
      <div className="w-full lg:w-1/2 relative bg-gray-900 overflow-y-auto">
        <div className="min-h-full flex flex-col justify-center px-8 py-12">
          <div className="w-full max-w-md mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Almost There!
              </h1>
              <p className="text-gray-300 text-sm">Complete your profile to get started</p>
            </div>

            {/* Welcome message */}
            <div className="mb-6 p-4 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-xl border border-purple-500/20">
              <p className="text-gray-300 text-sm text-center">
                Welcome, <span className="text-purple-400 font-semibold">{user?.name || 'User'}</span>! 
                Let's set up your academic profile.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="group">
                <label className="block text-gray-300 mb-2 font-medium text-sm">College/University</label>
                <input
                  type="text"
                  name="college"
                  placeholder="Enter your college or university name"
                  value={formData.college}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-gray-800 text-white placeholder-gray-400 
                           focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-gray-700
                           border border-gray-600 hover:border-gray-500 transition-all duration-200"
                  required
                />
              </div>

              <div className="group">
                <label className="block text-gray-300 mb-2 font-medium text-sm">Branch/Department</label>
                <input
                  type="text"
                  name="branch"
                  placeholder="e.g., Computer Science, Electronics, etc."
                  value={formData.branch}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-gray-800 text-white placeholder-gray-400 
                           focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-gray-700
                           border border-gray-600 hover:border-gray-500 transition-all duration-200"
                  required
                />
              </div>

              <div className="group">
                <label className="block text-gray-300 mb-2 font-medium text-sm">PRN/Roll Number</label>
                <input
                  type="text"
                  name="prn"
                  placeholder="Enter your PRN or Roll Number"
                  value={formData.prn}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-gray-800 text-white placeholder-gray-400 
                           focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-gray-700
                           border border-gray-600 hover:border-gray-500 transition-all duration-200"
                  required
                />
              </div>

              <div className="group">
                <label className="block text-gray-300 mb-2 font-medium text-sm">Batch/Year</label>
                <input
                  type="number"
                  name="batch"
                  placeholder="e.g., 2024, 2025, etc."
                  value={formData.batch}
                  onChange={handleChange}
                  min="2020"
                  max="2030"
                  className="w-full px-4 py-3 rounded-xl bg-gray-800 text-white placeholder-gray-400 
                           focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-gray-700
                           border border-gray-600 hover:border-gray-500 transition-all duration-200"
                  required
                />
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 mt-8 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 
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
                      Updating Profile...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                      </svg>
                      Complete Profile
                    </>
                  )}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </form>

            {/* Progress indicator */}
            <div className="mt-8 text-center">
              <div className="flex justify-center space-x-2 mb-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
              </div>
              <p className="text-gray-400 text-xs">Step 2 of 3 - Profile Setup</p>
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
};

export default CompleteProfile;
