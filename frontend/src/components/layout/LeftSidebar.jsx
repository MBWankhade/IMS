import React, { useContext, useState, useEffect } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Loader } from "semantic-ui-react";
import {
  FaHome,
  FaUser,
  FaUsers,
  FaBookmark,
  FaCog,
  FaSignOutAlt,
  FaBell,
  FaChevronRight,
  FaGraduationCap,
  FaRocket,
  FaStar,
  FaFire,
  FaCrown,
} from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";
import { BiTrendingUp } from "react-icons/bi";
import Logo from "../../assets/logo-vit.png";
import { DataContext } from "../../context/DataProvider";
import { hoverleftBar, leftsideBar } from "../../utils/colors";
import { sidebarLinks } from "../../utils/constants";

function Navbar() {
  const { user, setUser } = useContext(DataContext);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [hoveredItem, setHoveredItem] = useState(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/logout`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (!res.ok) {
        throw new Error("Logout failed!");
      }

      await res.json();
      setUser(null);
      localStorage.removeItem("token");
      navigate("/login");
    } catch (error) {
      console.error("Logout Error:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Enhanced icon mapping for better visual appeal
  const getIconForRoute = (route, label) => {
    const iconMap = {
      "/": FaHome,
      "/profile": FaUser,
      "/explore": FaRocket,
      "/saved": FaBookmark,
      "/create-post": HiSparkles,
      "/all-users": FaUsers,
      "/settings": FaCog,
      "/notifications": FaBell,
    };
    return iconMap[route] || FaChevronRight;
  };

  return (
    <nav
      className="hidden h-screen md:flex px-4 py-6 flex-col justify-between min-w-[280px] max-w-[320px] overflow-y-auto custom-scrollbar text-white relative"
      style={{ 
        background: `linear-gradient(145deg, ${leftsideBar}, rgba(0,0,0,0.2))`,
        borderRight: "1px solid rgba(255,255,255,0.1)"
      }}
    >
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-blue-900/20 pointer-events-none"></div>
      
      <div className="flex flex-col gap-6 relative z-10">
        {/* Logo Section */}
        <div className="group flex items-center gap-4 mb-8 p-3 rounded-2xl hover:bg-white/5 transition-all duration-300">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full animate-pulse opacity-75"></div>
            <div className="relative border-2 border-white/20 rounded-full p-3 bg-white/10 backdrop-blur-lg flex items-center justify-center hover:scale-110 transition-transform duration-300 shadow-2xl">
              <Link to="/" className="block">
                <img 
                  src={Logo} 
                  alt="logo" 
                  className="w-10 h-10 object-contain filter drop-shadow-lg" 
                />
              </Link>
            </div>
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-white/90 group-hover:text-white transition-all duration-300 cursor-pointer font-bold text-sm leading-tight">
              Vishwakarma Institute
            </p>
            <p className="text-purple-300 text-xs font-medium">of Technology</p>
          </div>
        </div>

        {/* User Profile Section */}
        {!user?.email ? (
          <div className="flex justify-center items-center h-20 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10">
            <div className="flex flex-col items-center space-y-2">
              <Loader size="small" className="text-purple-400" />
              <span className="text-xs text-white/60">Loading profile...</span>
            </div>
          </div>
        ) : (
          <Link
            to={`/profile`}
            className="group flex gap-4 items-center p-4 rounded-2xl hover:bg-gradient-to-r hover:from-purple-600/20 hover:to-blue-600/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-purple-500/20 border border-transparent hover:border-purple-400/30 backdrop-blur-sm"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-pulse opacity-0 group-hover:opacity-75 transition-opacity duration-300"></div>
              <img
                src={user?.imageUrl || user?.profilePicture || "/assets/icons/profile-placeholder.svg"}
                alt="profile"
                className="relative h-14 w-14 rounded-full object-cover border-3 border-purple-400/50 group-hover:border-purple-400 shadow-lg group-hover:scale-105 transition-all duration-300"
              />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
            </div>
            <div className="flex flex-col flex-1 overflow-hidden">
              <div className="flex items-center space-x-2">
                <p className="font-bold text-white/90 group-hover:text-white transition-colors truncate">
                  {user?.name}
                </p>
                {/* <FaCrown className="text-yellow-400 text-sm animate-pulse" /> */}
              </div>
              <p className="text-sm text-purple-300 group-hover:text-purple-200 transition-colors truncate">
                @{user?.username || "Guest"}
              </p>
              <div className="flex items-center space-x-1 mt-1">
                {/* <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar key={star} className="text-yellow-400 text-xs" />
                  ))}
                </div> */}
                {/* <span className="text-xs text-white/60">Pro Member</span> */}
              </div>
            </div>
            <FaChevronRight className="text-white/40 group-hover:text-white/80 transition-colors" />
          </Link>
        )}

        {/* Navigation Links */}
        <ul className="flex flex-col gap-3">
          {sidebarLinks.map((link, index) => {
            const isActive = pathname === link.route;
            const IconComponent = getIconForRoute(link.route, link.label);

            return (
              <li
                key={link.label}
                className="relative group"
                onMouseEnter={() => setHoveredItem(link.label)}
                onMouseLeave={() => setHoveredItem(null)}
                style={{
                  animationDelay: `${index * 100}ms`,
                  animation: 'slideInLeft 0.6s ease-out forwards'
                }}
              >
                {/* Active indicator */}
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-400 to-blue-400 rounded-r-full shadow-lg shadow-purple-500/50"></div>
                )}
                
                <NavLink
                  to={link.route}
                  className={`
                    flex gap-4 items-center p-4 rounded-2xl transition-all duration-300 relative overflow-hidden
                    ${isActive 
                      ? 'bg-gradient-to-r from-purple-600/30 to-blue-600/30 text-white shadow-lg shadow-purple-500/20 border border-purple-400/30' 
                      : 'hover:bg-gradient-to-r hover:from-purple-600/20 hover:to-blue-600/20 hover:shadow-lg hover:shadow-purple-500/10 border border-transparent hover:border-purple-400/20'
                    }
                  `}
                >
                  {/* Animated background for active/hover states */}
                  <div className={`
                    absolute inset-0 opacity-0 transition-opacity duration-300
                    ${isActive ? 'bg-gradient-to-r from-purple-600/10 to-blue-600/10 opacity-100' : 'group-hover:opacity-100 bg-gradient-to-r from-purple-600/5 to-blue-600/5'}
                  `}></div>
                  
                  <div className="relative z-10 flex gap-4 items-center w-full">
                    <div className={`
                      p-2 rounded-xl transition-all duration-300 relative
                      ${isActive 
                        ? 'bg-gradient-to-r from-purple-500 to-blue-500 shadow-lg' 
                        : 'bg-white/10 group-hover:bg-gradient-to-r group-hover:from-purple-500/50 group-hover:to-blue-500/50'
                      }
                    `}>
                      {link.imgURL ? (
                        <img
                          src={link.imgURL}
                          alt={link.label}
                          className={`w-5 h-5 transition-all duration-300 ${
                            isActive || hoveredItem === link.label ? "brightness-0 invert" : "brightness-75"
                          }`}
                        />
                      ) : (
                        <IconComponent 
                          className={`w-5 h-5 transition-all duration-300 ${
                            isActive ? 'text-white' : 'text-white/70 group-hover:text-white'
                          }`} 
                        />
                      )}
                    </div>
                    
                    <span className={`
                      font-medium transition-all duration-300 flex-1
                      ${isActive ? 'text-white' : 'text-white/80 group-hover:text-white'}
                    `}>
                      {link.label}
                    </span>
                    
                    {isActive && (
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <FaFire className="text-orange-400 text-sm animate-pulse" />
                      </div>
                    )}
                    
                    {hoveredItem === link.label && !isActive && (
                      <FaChevronRight className="text-white/60 animate-pulse" />
                    )}
                  </div>
                </NavLink>
              </li>
            );
          })}
        </ul>

        {/* Quick Stats */}
        {/* <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-2xl p-4 backdrop-blur-sm border border-purple-400/20 hover:border-purple-400/40 transition-all duration-300">
          <h3 className="text-white font-bold mb-3 flex items-center space-x-2">
            <BiTrendingUp className="text-green-400" />
            <span>Quick Stats</span>
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-white/70 text-sm">Profile Views</span>
              <span className="text-green-400 font-bold text-sm">+24%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/70 text-sm">Network Growth</span>
              <span className="text-blue-400 font-bold text-sm">+12</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/70 text-sm">Post Engagement</span>
              <span className="text-purple-400 font-bold text-sm">87%</span>
            </div>
          </div>
        </div> */}
      </div>

      {/* Bottom Section - Logout */}
      <div className="relative z-10">
        <button
          className="group w-full flex gap-4 items-center p-4 text-white rounded-2xl transition-all duration-300 hover:bg-gradient-to-r hover:from-red-600/20 hover:to-pink-600/20 hover:shadow-lg hover:shadow-red-500/20 border border-transparent hover:border-red-400/30 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleLogout}
          disabled={isLoggingOut}
        >
          <div className="p-2 rounded-xl bg-white/10 group-hover:bg-gradient-to-r group-hover:from-red-500/50 group-hover:to-pink-500/50 transition-all duration-300">
            {isLoggingOut ? (
              <Loader size="mini" className="w-5 h-5" />
            ) : (
              <FaSignOutAlt className="w-5 h-5 text-white/70 group-hover:text-white transition-colors duration-300" />
            )}
          </div>
          <span className="font-medium text-white/80 group-hover:text-white transition-colors duration-300 flex-1 text-left">
            {isLoggingOut ? "Signing out..." : "Logout"}
          </span>
          <div className="w-2 h-2 bg-red-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity duration-300"></div>
        </button>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-white/10">
          <p className="text-xs text-white/40 text-center">
            © 2025 IMS Connect
          </p>
          <p className="text-xs text-white/30 text-center mt-1">
            Empowering Students
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #8b5cf6, #ec4899);
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #7c3aed, #db2777);
        }
      `}</style>
    </nav>
  );
}

export default Navbar;