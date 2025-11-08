import axios from "axios";
import React, { useContext, useEffect, useRef, useState } from "react";
import {
  FaComment,
  FaRetweet,
  FaShare,
  FaSpinner,
  FaUserCircle,
  FaHeart,
  FaFire,
  FaTrophy,
  FaBookOpen,
  FaMicrophone,
  FaChartBar,
  FaRocket,
  FaBolt,
  FaEye,
  FaClock,
} from "react-icons/fa";
import { HiSparkles, HiTrendingUp } from "react-icons/hi";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "semantic-ui-css/semantic.min.css";
import { Icon } from "semantic-ui-react";
import Comments from "../components/Comments";
import PostContent from "../components/PostContent";
import Reactions from "../components/Reactions";
import InputModal from "../components/InputModal";
import PopupModal from "../components/PopupModal";
import { DataContext } from "../context/DataProvider";
import { leftsideBar, mainContaint } from "../utils/colors";
import { ToastContainer } from "react-toastify";

/**
 * Enhanced Homepage component with modern UI design
 * Features improved animations, glassmorphism effects, and responsive design
 */
function Homepage() {
  const { user } = useContext(DataContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [posts, setPosts] = useState([]);
  const [visiblePosts, setVisiblePosts] = useState([]);
  const [openCommentSection, setOpenCommentSection] = useState(null);
  const [parentCommentCounts, setParentCommentCounts] = useState({});
  const [loadIndex, setLoadIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hoveredPost, setHoveredPost] = useState(null);
  const loaderRef = useRef(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/posts`,
          { withCredentials: true }
        );
        setTimeout(() => {
          setPosts(res.data);
          setVisiblePosts(res.data.slice(0, 5));
          setLoadIndex(5);
          setIsLoading(false);

          res.data.forEach((post) => {
            fetchParentCommentCount(post._id);
          });
        }, 1000);
      } catch (err) {
        console.error("Error fetching posts", err);
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const fetchParentCommentCount = async (postId) => {
    try {
      const res = await axios.get(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/posts/${postId}/parent-comments-count`,
        { withCredentials: true }
      );
      setParentCommentCounts((prev) => ({ ...prev, [postId]: res.data.count }));
    } catch (error) {
      console.error("Error fetching parent comment count:", error);
    }
  };

  useEffect(() => {
    if (location.state?.loginSuccess) {
      toast.success(`Login successful! Welcome back ${user?.name}`, {
        icon: "🎉",
        style: {
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
        },
      });
    } else if (location.state?.signupSuccess) {
      toast.success(`Signup successful! Welcome aboard ${user?.name}`, {
        icon: "🚀",
        style: {
          background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
          color: "white",
        },
      });
    }
    window.history.replaceState({}, document.title, location.pathname);
  }, [location.state]);

  const toggleCommentSection = (postId) => {
    if (openCommentSection === postId) {
      setOpenCommentSection(null);
    } else {
      setOpenCommentSection(postId);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          !isLoading &&
          loadIndex < posts.length
        ) {
          setIsLoading(true);
          setTimeout(() => {
            const nextPosts = posts.slice(loadIndex, loadIndex + 5);
            setVisiblePosts((prev) => [...prev, ...nextPosts]);
            setLoadIndex((prev) => prev + 5);
            setIsLoading(false);
          }, 1000);
        }
      },
      { threshold: 1.0 }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [loadIndex, posts, isLoading]);

  const formatTimeAgo = (timestamp) => {
    // Mock function - replace with actual timestamp formatting
    return "2h ago";
  };

  return (
    <>
    <ToastContainer 
        position="top-right" 
        hideProgressBar={false} 
        theme="dark"
        toastStyle={{
          background: 'rgba(17, 24, 39, 0.9)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          zIndex: 10000,
        }}
      />
      <div className="flex flex-1 h-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* Main Content */}
        <div
          style={{ backgroundColor: `${mainContaint}` }}
          className="flex flex-col flex-1 gap-6 overflow-scroll py-4 px-2 lg:px-6 custom-scrollbar backdrop-blur-sm"
        >
          {/* Create Post Section */}
          <div className="group m-2 lg:m-5 p-6 rounded-2xl bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-lg border border-white/20 shadow-2xl hover:shadow-purple-500/20 transition-all duration-500 hover:scale-[1.02] hover:border-purple-400/50">
            <div className="flex items-center space-x-4">
              <div className="relative">
                {user?.profilePicture ? (
                  <img
                    src={user?.profilePicture}
                    alt="Profile"
                    className="w-14 h-14 rounded-full object-cover border-3 border-gradient-to-r from-purple-400 to-pink-400 p-0.5 hover:scale-110 transition-transform duration-300 shadow-lg"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300">
                    <FaUserCircle className="text-white text-2xl" />
                  </div>
                )}
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
              </div>
              
              <button
                onClick={() => navigate("/share-experience")}
                className="flex-1 group/btn relative overflow-hidden bg-gradient-to-r from-purple-600/20 to-pink-600/20 hover:from-purple-600/30 hover:to-pink-600/30 border border-purple-400/30 rounded-full p-4 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-purple-500/25"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                <div className="flex justify-between items-center relative z-10">
                  <div className="flex items-center space-x-3">
                    <HiSparkles className="text-purple-400 text-xl animate-pulse" />
                    <p className="font-bold text-white/90 group-hover/btn:text-white transition-colors">
                      Share your experience with the community
                    </p>
                  </div>
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-full group-hover/btn:scale-110 transition-transform duration-300 shadow-lg">
                    <Icon name="edit" className="text-white" />
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Posts Feed */}
          <div className="w-full flex flex-col gap-6">
            {visiblePosts?.map((post, index) => (
              <div
                key={post._id}
                className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/20 shadow-2xl transition-all duration-500 hover:scale-[1.02] hover:shadow-purple-500/20 hover:border-purple-400/50 ${
                  hoveredPost === post._id ? 'shadow-2xl shadow-purple-500/30' : ''
                }`}
                onMouseEnter={() => setHoveredPost(post._id)}
                onMouseLeave={() => setHoveredPost(null)}
                style={{
                  animationDelay: `${index * 100}ms`,
                  animation: 'fadeInUp 0.6s ease-out forwards'
                }}
              >
                {/* Animated Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 via-pink-600/5 to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative z-10 p-6">
                  {/* Post Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        {post?.user?.profilePicture ? (
                          <img
                            src={post.user.profilePicture}
                            alt="Profile"
                            className="w-12 h-12 rounded-full object-cover border-2 border-purple-400/50 hover:border-purple-400 transition-all duration-300 shadow-lg hover:scale-110"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300">
                            <FaUserCircle className="text-white text-xl" />
                          </div>
                        )}
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white shadow-md"></div>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <p className="font-bold text-white/90 hover:text-white transition-colors">
                            {post?.user?.name}
                          </p>
                          {/* <div className="w-1 h-1 bg-purple-400 rounded-full"></div>
                          <span className="text-sm text-white/60 flex items-center space-x-1">
                            <FaClock className="text-xs" />
                            <span>{formatTimeAgo(post.createdAt)}</span>
                          </span> */}
                        </div>
                        <p className="text-sm text-purple-300 font-medium mt-1">
                          {post.title}
                        </p>
                      </div>
                    </div>
                    
                    {/* <div className="flex items-center space-x-2 text-white/40">
                      <FaEye className="text-sm" />
                      <span className="text-xs">1.2k</span>
                    </div> */}
                  </div>

                  {/* Post Content */}
                  <div className="mb-6 pl-16">
                    <PostContent content={post.content} />
                  </div>

                  {/* Divider with Gradient */}
                  <div className="h-px bg-gradient-to-r from-transparent via-purple-400/50 to-transparent mb-6"></div>

                  {/* Post Actions */}
                  <div className="flex justify-between items-center pl-16">
                    <div className="flex space-x-8">
                      <Reactions postId={post._id} />
                      
                      <button
                        onClick={() => toggleCommentSection(post._id)}
                        className="group/action flex items-center space-x-2 text-white/70 hover:text-blue-400 transition-all duration-300 hover:scale-110"
                      >
                        <div className="p-2 rounded-full group-hover/action:bg-blue-400/20 transition-all duration-300">
                          <FaComment className="text-sm" />
                        </div>
                        <span className="text-sm font-medium">
                          {parentCommentCounts[post._id] || 0}
                        </span>
                      </button>
                      
                      {/* <button className="group/action flex items-center space-x-2 text-white/70 hover:text-green-400 transition-all duration-300 hover:scale-110">
                        <div className="p-2 rounded-full group-hover/action:bg-green-400/20 transition-all duration-300">
                          <FaRetweet className="text-sm" />
                        </div>
                        <span className="text-sm font-medium">{post.reposts || 0}</span>
                      </button> */}
                      
                      <button className="group/action flex items-center space-x-2 text-white/70 hover:text-pink-400 transition-all duration-300 hover:scale-110">
                        <div className="p-2 rounded-full group-hover/action:bg-pink-400/20 transition-all duration-300">
                          <FaShare className="text-sm" />
                        </div>
                        <span className="text-sm font-medium">Share</span>
                      </button>
                    </div>
                    
                    {/* <div className="flex items-center space-x-2">
                      <div className="flex -space-x-2">
                        {[1, 2, 3].map((i) => (
                          <div
                            key={i}
                            className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 border-2 border-white shadow-sm"
                          />
                        ))}
                      </div>
                      <span className="text-xs text-white/60">+127 others</span>
                    </div> */}
                    
                  </div>

                  {/* Comments Section */}
                  {openCommentSection === post._id && (
                    <div className="mt-6 pl-16 animate-fadeIn">
                      <div className="bg-black/20 rounded-xl p-4 backdrop-blur-sm border border-white/10">
                        <Comments postId={post._id} currentUserId={user?._id} />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Enhanced Loading Spinner */}
            {isLoading && (
              <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-purple-200/20 rounded-full animate-spin"></div>
                  <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-l-purple-500 rounded-full animate-spin"></div>
                  <div className="absolute top-2 left-2 w-12 h-12 border-4 border-transparent border-l-pink-500 rounded-full animate-spin animate-reverse"></div>
                </div>
                <p className="text-white/60 font-medium">Loading amazing content...</p>
              </div>
            )}

            <div ref={loaderRef}></div>
          </div>
        </div>

        {/* Enhanced Sidebar */}
        <div
          className="hidden xl:flex flex-col w-80 2xl:w-96 px-6 py-8 gap-8 overflow-scroll custom-scrollbar"
          style={{ backgroundColor: leftsideBar }}
        >
          <div className="sticky top-8 flex flex-col gap-8">
            {/* Trending Section */}
            {/* <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500/20 to-red-500/20 backdrop-blur-lg border border-orange-400/30 shadow-2xl hover:shadow-orange-500/25 transition-all duration-500 hover:scale-[1.02]">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-600/10 to-red-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative z-10 p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-full shadow-lg">
                    <FaFire className="text-white text-xl animate-pulse" />
                  </div>
                  <h2 className="text-2xl font-extrabold text-white">
                    Trending Now
                  </h2>
                  <HiTrendingUp className="text-orange-400 text-xl animate-bounce" />
                </div>
                
                <ul className="space-y-4">
                  {[
                    { icon: FaTrophy, text: "VIT'24 Interview Experiences", color: "text-yellow-400" },
                    { icon: FaBookOpen, text: "Placement Preparations", color: "text-blue-400" },
                    { icon: FaMicrophone, text: "Mock Interview Results", color: "text-green-400" },
                    { icon: FaChartBar, text: "Weekly Rankings", color: "text-purple-400" }
                  ].map((item, index) => (
                    <li
                      key={index}
                      className="group/item flex items-center space-x-3 p-3 rounded-xl hover:bg-white/10 transition-all duration-300 cursor-pointer hover:scale-105"
                    >
                      <div className="p-2 bg-black/20 rounded-lg group-hover/item:scale-110 transition-transform duration-300">
                        <item.icon className={`${item.color} text-lg`} />
                      </div>
                      <span className="text-white/80 group-hover/item:text-white font-medium transition-colors">
                        {item.text}
                      </span>
                      <div className="ml-auto w-2 h-2 bg-orange-400 rounded-full opacity-0 group-hover/item:opacity-100 transition-opacity duration-300 animate-pulse"></div>
                    </li>
                  ))}
                </ul>
              </div>
            </div> */}

            {/* Mock Interviews Section */}
            {/* <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-500/20 to-blue-500/20 backdrop-blur-lg border border-green-400/30 shadow-2xl hover:shadow-green-500/25 transition-all duration-500 hover:scale-[1.02]">
              <div className="absolute inset-0 bg-gradient-to-r from-green-600/10 to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative z-10 p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-3 bg-gradient-to-r from-green-500 to-blue-500 rounded-full shadow-lg">
                    <FaRocket className="text-white text-xl animate-bounce" />
                  </div>
                  <h2 className="text-2xl font-extrabold text-white">
                    Mock Interviews
                  </h2>
                  <FaBolt className="text-yellow-400 text-xl animate-pulse" />
                </div>

                {user ? (
                  <div className="space-y-6">
                    <div className="flex items-center space-x-3 p-4 bg-black/20 rounded-xl border border-white/10">
                      <FaRocket className="text-green-400 text-xl animate-pulse" />
                      <p className="text-white/90 font-medium">
                        Boost your interview skills with our AI tools
                      </p>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="transform hover:scale-105 transition-transform duration-300">
                        <PopupModal />
                      </div>
                      <div className="transform hover:scale-105 transition-transform duration-300">
                        <InputModal />
                      </div>
                    </div>
                    
                    <div className="p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl border border-purple-400/30">
                      <p className="text-white/80 text-sm font-medium text-center">
                        💡 Get instant feedback, track your progress, and ace every interview!
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center space-y-6">
                    <div className="p-4 bg-black/20 rounded-xl border border-white/10">
                      <FaRocket className="text-green-400 text-3xl mx-auto mb-3 animate-bounce" />
                      <p className="text-white/80 font-medium">
                        Join our community to access premium mock interview tools
                      </p>
                    </div>
                    
                    <div className="flex gap-4">
                      <button
                        className="flex-1 group/btn relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105"
                        onClick={() => navigate("/login")}
                      >
                        <div className="absolute inset-0 bg-white/20 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                        <span className="relative z-10">Login</span>
                      </button>
                      
                      <button
                        className="flex-1 group/btn relative overflow-hidden bg-transparent border-2 border-purple-400 hover:bg-purple-400/20 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105"
                        onClick={() => navigate("/signup")}
                      >
                        <div className="absolute inset-0 bg-purple-400/10 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                        <span className="relative z-10">Sign Up</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div> */}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        .animate-reverse {
          animation-direction: reverse;
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
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
    </>
  );
}

export default Homepage;