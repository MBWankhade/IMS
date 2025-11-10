import React, { useEffect, useState } from "react";
import axios from "axios";
import { 
  FaCheckCircle, 
  FaTimesCircle, 
  FaSpinner, 
  FaUserCircle,
  FaClock,
  FaBuilding,
  FaBriefcase,
  FaGraduationCap,
  FaShieldAlt,
  FaEye
} from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const AdminHomePage = () => {
  const [pendingPosts, setPendingPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [expandedPost, setExpandedPost] = useState(null);

  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/api/admin-route/ims-startupfounders/pending-posts`, {
        withCredentials: true,
      })
      .then((res) => {
        setPendingPosts(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching pending posts:", err);
        toast.error("Unable to load pending posts. Please check your connection or try again later.");
        setLoading(false);
      });
  }, []);

  const handleApprove = async (postId) => {
    setProcessingId(postId);
    try {
      await axios.post(`${BACKEND_URL}/pending-posts/${postId}/approve`, {}, {
        withCredentials: true
      });
      setPendingPosts(pendingPosts.filter((post) => post._id !== postId));
      toast.success("Post approved successfully!", {
        icon: <FaCheckCircle className="text-green-400" />,
      });
    } catch (err) {
      console.error("Error approving post:", err);
      toast.error("Failed to approve post");
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (postId) => {
    setProcessingId(postId);
    try {
      await axios.post(`${BACKEND_URL}/pending-posts/${postId}/reject`, {}, {
        withCredentials: true
      });
      setPendingPosts(pendingPosts.filter((post) => post._id !== postId));
      toast.success("Post rejected successfully", {
        icon: <FaTimesCircle className="text-red-400" />,
      });
    } catch (err) {
      console.error("Error rejecting post:", err);
      toast.error("Failed to reject post");
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-purple-200/20 rounded-full animate-spin"></div>
            <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-l-purple-500 rounded-full animate-spin"></div>
            <div className="absolute top-2 left-2 w-12 h-12 border-4 border-transparent border-l-pink-500 rounded-full animate-spin"></div>
          </div>
          <p className="text-white/60 font-medium">Loading pending posts...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover
        limit={3}
        theme="dark"
      /> */}

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-8 group">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-lg border border-white/20 shadow-2xl p-8">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-pink-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl shadow-lg">
                    <FaShieldAlt className="text-white text-3xl" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-extrabold text-white mb-2 flex items-center space-x-3">
                      Admin Dashboard
                      <HiSparkles className="text-yellow-400 animate-pulse" />
                    </h1>
                    <p className="text-white/70 text-lg">Review and manage pending posts</p>
                  </div>
                </div>
                
                <div className="hidden lg:flex items-center space-x-6">
                  <div className="text-center px-6 py-3 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20">
                    <p className="text-3xl font-bold text-white">{pendingPosts.length}</p>
                    <p className="text-white/60 text-sm font-medium">Pending</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Posts Section */}
          {pendingPosts.length === 0 ? (
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/20 shadow-2xl p-12 text-center">
              <div className="absolute inset-0 bg-gradient-to-r from-green-600/5 to-blue-600/5"></div>
              <div className="relative z-10 flex flex-col items-center space-y-4">
                <div className="p-6 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-full">
                  <FaCheckCircle className="text-green-400 text-6xl" />
                </div>
                <h3 className="text-2xl font-bold text-white">All Clear!</h3>
                <p className="text-white/60 text-lg max-w-md">
                  No pending posts to review. Great job keeping up with the queue!
                </p>
              </div>
            </div>
          ) : (
            <div className="grid gap-6">
              {pendingPosts.map((post, index) => (
                <div
                  key={post._id}
                  className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/20 shadow-2xl transition-all duration-500 hover:scale-[1.01] hover:shadow-purple-500/20 hover:border-purple-400/50"
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animation: 'fadeInUp 0.6s ease-out forwards'
                  }}
                >
                  {/* Animated Background Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 via-pink-600/5 to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  <div className="relative z-10 p-6">
                    {/* Post Header */}
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-start space-x-4 flex-1">
                        <div className="relative">
                          {post?.user?.profilePicture ? (
                            <img
                              src={post.user.profilePicture}
                              alt="Profile"
                              className="w-14 h-14 rounded-full object-cover border-2 border-purple-400/50 shadow-lg"
                            />
                          ) : (
                            <div className="w-14 h-14 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center shadow-lg">
                              <FaUserCircle className="text-white text-2xl" />
                            </div>
                          )}
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full border-2 border-white shadow-md flex items-center justify-center">
                            <FaClock className="text-white text-xs" />
                          </div>
                        </div>

                        <div className="flex-1">
                          <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                            {post.title}
                          </h3>
                          
                          <div className="flex flex-wrap gap-3 mb-4">
                            <div className="flex items-center space-x-2 px-3 py-1.5 bg-blue-500/20 rounded-lg border border-blue-400/30">
                              <FaBuilding className="text-blue-400 text-sm" />
                              <span className="text-white/90 text-sm font-medium">{post.company}</span>
                            </div>
                            
                            <div className="flex items-center space-x-2 px-3 py-1.5 bg-purple-500/20 rounded-lg border border-purple-400/30">
                              <FaBriefcase className="text-purple-400 text-sm" />
                              <span className="text-white/90 text-sm font-medium">{post.role}</span>
                            </div>
                            
                            <div className="flex items-center space-x-2 px-3 py-1.5 bg-pink-500/20 rounded-lg border border-pink-400/30">
                              <FaGraduationCap className="text-pink-400 text-sm" />
                              <span className="text-white/90 text-sm font-medium">{post.placementType}</span>
                            </div>
                          </div>

                          <p className="text-white/60 text-sm">
                            Posted by <span className="text-white/80 font-medium">{post?.user?.name || 'Anonymous'}</span>
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Post Content Preview */}
                    <div className="mb-6">
                      <button
                        onClick={() => setExpandedPost(expandedPost === post._id ? null : post._id)}
                        className="flex items-center space-x-2 text-purple-400 hover:text-purple-300 transition-colors mb-4"
                      >
                        <FaEye className="text-sm" />
                        <span className="text-sm font-medium">
                          {expandedPost === post._id ? "Hide Content" : "View Full Content"}
                        </span>
                      </button>

                      {expandedPost === post._id && (
                        <div className="bg-black/20 rounded-xl p-6 backdrop-blur-sm border border-white/10 max-h-96 overflow-y-auto custom-scrollbar">
                          <div 
                            className="prose prose-invert max-w-none text-white/90"
                            dangerouslySetInnerHTML={{ __html: post.content }}
                          />
                        </div>
                      )}
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-gradient-to-r from-transparent via-purple-400/50 to-transparent mb-6"></div>

                    {/* Action Buttons */}
                    <div className="flex gap-4">
                      <button
                        onClick={() => handleApprove(post._id)}
                        disabled={processingId === post._id}
                        className="flex-1 group/btn relative overflow-hidden bg-gradient-to-r from-green-600/20 to-emerald-600/20 hover:from-green-600/30 hover:to-emerald-600/30 border border-green-400/30 rounded-xl p-4 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-green-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-green-600/10 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                        <div className="flex items-center justify-center space-x-2 relative z-10">
                          {processingId === post._id ? (
                            <>
                              <FaSpinner className="text-green-400 text-lg animate-spin" />
                              <span className="font-bold text-white/90">Processing...</span>
                            </>
                          ) : (
                            <>
                              <FaCheckCircle className="text-green-400 text-lg" />
                              <span className="font-bold text-white/90 group-hover/btn:text-white transition-colors">
                                Approve Post
                              </span>
                            </>
                          )}
                        </div>
                      </button>

                      <button
                        onClick={() => handleReject(post._id)}
                        disabled={processingId === post._id}
                        className="flex-1 group/btn relative overflow-hidden bg-gradient-to-r from-red-600/20 to-pink-600/20 hover:from-red-600/30 hover:to-pink-600/30 border border-red-400/30 rounded-xl p-4 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-red-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-red-600/10 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                        <div className="flex items-center justify-center space-x-2 relative z-10">
                          {processingId === post._id ? (
                            <>
                              <FaSpinner className="text-red-400 text-lg animate-spin" />
                              <span className="font-bold text-white/90">Processing...</span>
                            </>
                          ) : (
                            <>
                              <FaTimesCircle className="text-red-400 text-lg" />
                              <span className="font-bold text-white/90 group-hover/btn:text-white transition-colors">
                                Reject Post
                              </span>
                            </>
                          )}
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
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

        .prose-invert {
          color: rgba(255, 255, 255, 0.9);
        }

        .prose-invert h1,
        .prose-invert h2,
        .prose-invert h3,
        .prose-invert h4 {
          color: white;
        }

        .prose-invert a {
          color: #a78bfa;
        }

        .prose-invert a:hover {
          color: #c4b5fd;
        }

        .prose-invert code {
          background: rgba(0, 0, 0, 0.3);
          padding: 2px 6px;
          border-radius: 4px;
        }
      `}</style>
    </>
  );
};

export default AdminHomePage;