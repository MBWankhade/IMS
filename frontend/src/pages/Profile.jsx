import { useContext, useState } from "react";
import { DataContext } from "../context/DataProvider";
import { ToastContainer, toast } from "react-toastify";

const Profile = () => {
  const { user, setUser } = useContext(DataContext);
  const [ isEditOpen, setIsEditOpen ] = useState(false);
  const [ formData, setFormData ] = useState({
    name: user?.name || "",
    email: user?.email || "",
    username: user?.username || "",
    profilePicture: user?.profilePicture || ""
  });

  if (!user) {
    return (
      <div className="w-full bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading profile...</p>
        </div>
      </div>
    );
  }

  const fields = [
    { label: "Name", value: user.name, icon: "👤" },
    { label: "Email", value: user.email, icon: "📧" },
    { label: "Username", value: user.username, icon: "🔖" },
    { label: "College", value: user.college, icon: "🎓" },
    { label: "Branch", value: user.branch, icon: "🌿" },
    { label: "PRN", value: user.prn, icon: "📋" },
    { label: "Batch", value: user.batch, icon: "📅" },
  ];

  const handleSave = async () => {
    
    try{
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/edit-profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(formData)
      })

      const data = await res.json();

      if(!res.ok) throw new Error(data.message);

      setUser(data.user);  
      toast.success("success");
      setTimeout(() => {
        setIsEditOpen(false);
      }, 5000)
      

    } catch(err){
      console.error(err);
      toast.error(err.message)
    }
  }

  return (
    <div className="relative w-full min-h-screen overflow-x-hidden">
      {/* Gradient Background – Fixed and sidebar-aware */}
<div className="fixed top-0 left-64 w-[calc(100%-16rem)] min-h-screen z-[-1]">
  <div className="w-full h-full bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.3),transparent)] animate-pulse"></div>
    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
    <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
    <div className="absolute bottom-20 left-1/3 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
  </div>
</div>


      {/* Floating Elements */}
      <div className="absolute top-16 right-16 w-4 h-4 bg-yellow-400 rounded-full animate-float"></div>
      <div className="absolute bottom-32 left-1/2 w-3 h-3 bg-pink-400 rounded-full animate-float animation-delay-3000"></div>
      <div className="absolute top-1/3 right-8 w-2 h-2 bg-green-400 rounded-full animate-float animation-delay-1000"></div>

      {/* Main Content */}
      <div className="relative z-10 p-4 py-8 pb-16 ml-4 mr-4 min-h-screen">
        <div className="w-full max-w-2xl mx-auto">
          {/* Profile Header */}
          <div className="text-center mb-8">
            <div className="relative inline-block mb-6">
              {user?.profilePicture ? (
                <img
                  src={user.profilePicture}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover shadow-2xl shadow-purple-500/25 rotate-3 hover:rotate-6 transition-transform duration-300 mx-auto"
                />
              ) : (
                <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center shadow-2xl shadow-purple-500/25 rotate-3 hover:rotate-6 transition-transform duration-300 mx-auto">
                  <span className="text-4xl text-white font-bold">
                    {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </span>
                </div>
              )}
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-400 rounded-full flex items-center justify-center">
                <div className="w-4 h-4 bg-white rounded-full"></div>
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
              {user.name || "User Profile"}
            </h1>
            <p className="text-gray-300 text-lg">Your MockInt Profile</p>
          </div>

          {/* Profile Card */}
          <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-gray-700/50 shadow-2xl shadow-purple-500/10 p-8 mx-auto max-w-xl">
            <div className="space-y-6">
              {fields.map(({ label, value, icon }) => (
                <div key={label} className="group">
                  <div className="flex items-center space-x-4 p-4 rounded-xl bg-gray-800/50 border border-gray-600/50 hover:border-purple-500/50 hover:bg-gray-700/50 transition-all duration-200">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg">
                      {icon}
                    </div>
                    <div className="flex-1">
                      <label className="block text-gray-400 text-sm font-medium mb-1">
                        {label}
                      </label>
                      <p className="text-white text-lg font-medium">
                        {value || (
                          <span className="text-gray-500 italic">Not provided</span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => setIsEditOpen(true)}
                className="flex-1 py-3 px-6 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 hover:from-purple-700 hover:via-blue-700 hover:to-indigo-700 rounded-xl text-white font-bold shadow-lg shadow-purple-500/25 transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-purple-500/40 relative overflow-hidden group"
              >
                <span className="relative z-10">Edit Profile</span>
                <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
              <button className="flex-1 py-3 px-6 bg-gray-800 hover:bg-gray-700 border border-gray-600 hover:border-purple-500 rounded-xl text-white font-bold transition-all duration-300 transform hover:scale-105">
                Settings
              </button>
            </div>
          </div>

          {/* Stats Section */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl border border-gray-700/50 p-6 text-center hover:border-purple-500/50 transition-all duration-200">
              <div className="text-3xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                0
              </div>
              <p className="text-gray-400 mt-2">Interviews Completed</p>
            </div>
            <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl border border-gray-700/50 p-6 text-center hover:border-purple-500/50 transition-all duration-200">
              <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                0
              </div>
              <p className="text-gray-400 mt-2">Posts Added</p>
            </div>
            <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl border border-gray-700/50 p-6 text-center hover:border-purple-500/50 transition-all duration-200">
              <div className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                0
              </div>
              <p className="text-gray-400 mt-2">Likes Received</p>
            </div>
          </div>
        </div>
      </div>

      


       {/* Edit Profile Modal */}
      {isEditOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
          <div className="bg-gray-900/80 backdrop-blur-xl text-white rounded-2xl p-8 w-full max-w-md shadow-2xl border border-gray-700/50">
            <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
              Edit Profile
            </h2>

            <div className="space-y-5">
              {/* Name */}
              <div className="flex items-center space-x-4 p-4 rounded-xl bg-gray-800/50 border border-gray-600/50 hover:border-purple-500/50 hover:bg-gray-700/50 transition-all duration-200">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg">
                  👤
                </div>
                <div className="flex-1">
                  <label className="block text-gray-400 text-sm font-medium mb-1">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-transparent text-white text-lg font-medium focus:outline-none placeholder-gray-500"
                    placeholder="Enter name"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center space-x-4 p-4 rounded-xl bg-gray-800/50 border border-gray-600/50 hover:border-purple-500/50 hover:bg-gray-700/50 transition-all duration-200">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white shadow-lg">
                  📧
                </div>
                <div className="flex-1">
                  <label className="block text-gray-400 text-sm font-medium mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-transparent text-white text-lg font-medium focus:outline-none placeholder-gray-500"
                    placeholder="Enter email"
                  />
                </div>
              </div>

              {/* Username */}
              <div className="flex items-center space-x-4 p-4 rounded-xl bg-gray-800/50 border border-gray-600/50 hover:border-purple-500/50 hover:bg-gray-700/50 transition-all duration-200">
                <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center text-white shadow-lg">
                  🔖
                </div>
                <div className="flex-1">
                  <label className="block text-gray-400 text-sm font-medium mb-1">Username</label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="w-full bg-transparent text-white text-lg font-medium focus:outline-none placeholder-gray-500"
                    placeholder="Enter username"
                  />
                </div>
              </div>

              {/* Profile Picture */}
              <div className="flex items-center space-x-4 p-4 rounded-xl bg-gray-800/50 border border-gray-600/50 hover:border-purple-500/50 hover:bg-gray-700/50 transition-all duration-200">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-lg flex items-center justify-center text-white shadow-lg">
                  🖼️
                </div>
                <div className="flex-1">
                  <label className="block text-gray-400 text-sm font-medium mb-1">Profile Picture</label>
                  <input
                    type="text"
                    value={formData.profilePicture}
                    onChange={(e) => setFormData({ ...formData, profilePicture: e.target.value })}
                    className="w-full bg-transparent text-white text-lg font-medium focus:outline-none placeholder-gray-500"
                    placeholder="Enter image URL"
                  />
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => setIsEditOpen(false)}
                className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 font-bold"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

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


      {/* Animations */}
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
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
        .animation-delay-1000 { animation-delay: 1s; }
        .animation-delay-3000 { animation-delay: 3s; }

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

export default Profile;
