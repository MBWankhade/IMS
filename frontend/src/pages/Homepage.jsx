import axios from "axios";
import React, { useContext, useEffect, useRef, useState } from "react";
import {
  FaComment,
  FaRetweet,
  FaShare,
  FaSpinner,
  FaUserCircle,
  FaEllipsisH,
  FaBookmark,
  FaRegBookmark,
} from "react-icons/fa";
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

function Homepage() {
  const { setUser, user } = useContext(DataContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [posts, setPosts] = useState([]);
  const [visiblePosts, setVisiblePosts] = useState([]);
  const [openCommentSection, setOpenCommentSection] = useState(null);
  const [parentCommentCounts, setParentCommentCounts] = useState({});
  const [loadIndex, setLoadIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [savedPosts, setSavedPosts] = useState({});
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
    if (localStorage.getItem("googleLoginSuccess")) {
      toast.success(`Google Login successful! Welcome back ${user?.name}.`);
      localStorage.removeItem("googleLoginSuccess");
      setUser(user);
    }
  }, []);

  useEffect(() => {
    if (location.state?.loginSuccess) {
      toast.success(`Login successful! Welcome back ${user?.name}`);
    } else if (location.state?.signupSuccess) {
      toast.success(`Signup successful! Welcome aboard ${user?.name}`);
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

  const toggleSavePost = (postId) => {
    setSavedPosts(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
    
    // Here you would typically call an API to save/unsave the post
    toast.success(savedPosts[postId] ? "Post removed from bookmarks" : "Post saved to bookmarks");
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

  // Determine time of day for greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="flex flex-1 h-screen bg-[#0a0a0a] text-white">
      {/* Main Content */}
      <div className="flex flex-col flex-1 gap-6 overflow-auto py-6 px-0 sm:px-4 lg:px-6 custom-scrollbar">
        {/* Welcome Section */}
        {user && (
          <div className="mx-2 sm:mx-4 mb-2">
            <h1 className="text-xl font-bold text-white">
              {getGreeting()}, <span className="text-emerald-400">{user.name}</span>
            </h1>
            <p className="text-zinc-400 text-sm">Stay updated with the latest community posts</p>
          </div>
        )}
      
        {/* Create Post Card */}
        <div className="mx-2 sm:mx-4 p-4 rounded-2xl bg-[#111111] border border-[#222222] shadow-lg transition-all duration-300 hover:shadow-emerald-900/10">
          <div className="flex items-center">
            {user?.profilePicture ? (
              <div className="relative">
                <img
                  src={user.profilePicture}
                  alt="Profile"
                  className="w-11 h-11 rounded-full cursor-pointer border-2 border-zinc-800 hover:border-emerald-500 transition-all duration-300 object-cover"
                />
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#111111]"></div>
              </div>
            ) : (
              <div className="relative">
                <FaUserCircle
                  size={44}
                  className="text-zinc-400 rounded-full cursor-pointer hover:text-zinc-200 transition-all duration-300"
                />
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#111111]"></div>
              </div>
            )}
            <button
              onClick={() => navigate("/share-experience")}
              className="ml-4 border border-[#2a2a2a] rounded-full cursor-pointer p-3 w-full bg-[#151515] hover:bg-[#1a1a1a] transition-all duration-200 shadow-inner shadow-black/50"
            >
              <div className="flex justify-between items-center">
                <p className="ml-2 font-medium text-zinc-400">What's on your mind?</p>
                <Icon
                  name="edit"
                  size="small"
                  className="text-emerald-500 mr-2"
                />
              </div>
            </button>
          </div>
          
          <div className="mt-4 pt-4 border-t border-[#222222] flex justify-between">
            <button className="flex items-center gap-2 text-zinc-400 hover:text-emerald-400 transition-all duration-200 text-sm px-3 py-1 rounded-full hover:bg-emerald-500/10">
              <Icon name="image" />
              <span>Photo</span>
            </button>
            
            <button className="flex items-center gap-2 text-zinc-400 hover:text-blue-400 transition-all duration-200 text-sm px-3 py-1 rounded-full hover:bg-blue-500/10">
              <Icon name="video" />
              <span>Video</span>
            </button>
            
            <button className="flex items-center gap-2 text-zinc-400 hover:text-purple-400 transition-all duration-200 text-sm px-3 py-1 rounded-full hover:bg-purple-500/10">
              <Icon name="file alternate" />
              <span>Document</span>
            </button>
          </div>
        </div>

        {/* Posts Feed */}
        <div className="w-full flex flex-col gap-5 px-2 sm:px-4">
          {visiblePosts?.map((post) => (
            <div
              key={post._id}
              className="p-5 rounded-2xl bg-[#111111] border border-[#222222] shadow-lg transition-all duration-300 hover:shadow-[0_4px_20px_rgba(0,0,0,0.6)]"
            >
              {/* Post Header */}
              <div className="flex justify-between mb-4">
                <div className="flex items-center">
                  <div className="relative">
                    {post?.user?.profilePicture ? (
                      <img
                        src={post.user.profilePicture}
                        alt="Profile"
                        className="w-10 h-10 rounded-full cursor-pointer border-2 border-zinc-800 hover:border-emerald-500 transition-all duration-300 object-cover"
                      />
                    ) : (
                      <FaUserCircle
                        size={40}
                        className="text-zinc-400 rounded-full cursor-pointer hover:text-zinc-200 transition-all duration-300"
                      />
                    )}
                    <div className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-500 rounded-full border border-[#111111]"></div>
                  </div>

                  <div className="ml-3">
                    <p className="font-bold text-white hover:text-emerald-400 cursor-pointer transition-all duration-200">{post?.user?.name}</p>
                    <p className="text-xs text-zinc-500">{post.title} • 2h ago</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => toggleSavePost(post._id)}
                    className="text-zinc-500 hover:text-emerald-400 transition-all duration-200"
                  >
                    {savedPosts[post._id] ? <FaBookmark /> : <FaRegBookmark />}
                  </button>
                  
                  <button className="text-zinc-500 hover:text-zinc-300 transition-all duration-200">
                    <FaEllipsisH />
                  </button>
                </div>
              </div>

              {/* Post Content */}
              <div className="mb-4">
                <PostContent content={post.content} />
              </div>

              {/* Engagement Stats */}
              <div className="flex items-center text-xs text-zinc-500 mb-4">
                <div className="flex -space-x-1 mr-2">
                  <div className="w-5 h-5 rounded-full bg-emerald-500 border border-[#111111]"></div>
                  <div className="w-5 h-5 rounded-full bg-blue-500 border border-[#111111]"></div>
                  <div className="w-5 h-5 rounded-full bg-purple-500 border border-[#111111]"></div>
                </div>
                <span>{post.likes || 0} reactions</span>
                <span className="mx-2">•</span>
                <span>{parentCommentCounts[post._id] || 0} comments</span>
              </div>

              {/* Divider */}
              <div className="h-px w-full bg-gradient-to-r from-transparent via-zinc-800 to-transparent my-3"></div>

              {/* Post Actions */}
              <div className="flex justify-between text-zinc-400">
                <Reactions postId={post._id} />
                
                <button
                  onClick={() => toggleCommentSection(post._id)}
                  className="flex items-center space-x-2 hover:text-emerald-400 transition-all duration-200 px-2 py-1 rounded-lg hover:bg-emerald-500/10"
                >
                  <FaComment />
                  <span>Comment</span>
                </button>
                
                <button className="flex items-center space-x-2 hover:text-purple-400 transition-all duration-200 px-2 py-1 rounded-lg hover:bg-purple-500/10">
                  <FaRetweet />
                  <span>Repost</span>
                </button>
                
                <button className="flex items-center space-x-2 hover:text-blue-400 transition-all duration-200 px-2 py-1 rounded-lg hover:bg-blue-500/10">
                  <FaShare />
                  <span>Share</span>
                </button>
              </div>

              {/* Conditionally Render Comments Section */}
              {openCommentSection === post._id && (
                <div className="mt-4 pt-4 border-t border-[#222222] bg-[#0c0c0c] -mx-5 -mb-5 px-5 pt-2 pb-3 rounded-b-2xl">
                  <Comments postId={post._id} currentUserId={user?._id} />
                </div>
              )}
            </div>
          ))}
          
          {/* Loading Spinner */}
          {isLoading && (
            <div className="flex justify-center items-center w-full h-32">
              <div className="relative">
                <div className="w-12 h-12 rounded-full absolute border-4 border-zinc-700 border-opacity-20"></div>
                <div className="w-12 h-12 rounded-full animate-spin absolute border-4 border-emerald-500 border-t-transparent"></div>
              </div>
            </div>
          )}

          <div ref={loaderRef}></div>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="hidden xl:flex flex-col w-80 2xl:w-96 px-5 py-6 bg-[#0c0c0c] border-l border-[#222222]">
        <div className="sticky top-20 flex flex-col gap-6">
          
        
          {/* Trending Now Section */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-[#111111] to-[#080808] border border-[#222222] shadow-lg transition-all duration-300 hover:shadow-emerald-900/5">
            <h2 className="text-lg font-bold mb-4 text-white flex items-center gap-2">
              <span className="text-emerald-500">🔥</span> Trending Now
            </h2>
            <ul className="space-y-3">
              <li className="p-2 rounded-lg hover:bg-[#151515] transition-all duration-200 cursor-pointer border border-transparent hover:border-[#222222]">
                <div className="flex items-center gap-3">
                  <span className="text-emerald-500 font-bold">01</span>
                  <div>
                    <p className="text-zinc-200 font-medium">VIT'24 Interview Experiences</p>
                    <p className="text-xs text-zinc-500">142 new posts today</p>
                  </div>
                </div>
              </li>
              <li className="p-2 rounded-lg hover:bg-[#151515] transition-all duration-200 cursor-pointer border border-transparent hover:border-[#222222]">
                <div className="flex items-center gap-3">
                  <span className="text-emerald-500 font-bold">02</span>
                  <div>
                    <p className="text-zinc-200 font-medium">Placement Preparations</p>
                    <p className="text-xs text-zinc-500">87 new posts today</p>
                  </div>
                </div>
              </li>
              <li className="p-2 rounded-lg hover:bg-[#151515] transition-all duration-200 cursor-pointer border border-transparent hover:border-[#222222]">
                <div className="flex items-center gap-3">
                  <span className="text-emerald-500 font-bold">03</span>
                  <div>
                    <p className="text-zinc-200 font-medium">Mock Interview Results</p>
                    <p className="text-xs text-zinc-500">56 new posts today</p>
                  </div>
                </div>
              </li>
              <li className="p-2 rounded-lg hover:bg-[#151515] transition-all duration-200 cursor-pointer border border-transparent hover:border-[#222222]">
                <div className="flex items-center gap-3">
                  <span className="text-emerald-500 font-bold">04</span>
                  <div>
                    <p className="text-zinc-200 font-medium">Weekly Rankings</p>
                    <p className="text-xs text-zinc-500">Updated 2 hours ago</p>
                  </div>
                </div>
              </li>
            </ul>
          </div>

          {/* Mock Interviews Section */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-[#111111] to-[#080808] border border-[#222222] shadow-lg transition-all duration-300 hover:shadow-emerald-900/5 relative overflow-hidden">
            <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-emerald-500/10 blur-2xl"></div>
            
            <h2 className="text-lg font-bold mb-4 text-white flex items-center gap-2">
              <span className="text-emerald-500">🎯</span> Mock Interviews
            </h2>
            
            {user ? (
              <div className="flex flex-col w-full">
                <p className="mb-4 text-zinc-300 text-sm">
                  Boost your interview skills with our AI-powered tools:
                </p>
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-[#151515] border border-[#222222] hover:border-emerald-500/40 transition-all duration-200 cursor-pointer">
                    <h4 className="text-sm font-medium text-white mb-1">Technical Interview</h4>
                    <p className="text-xs text-zinc-500">Practice DSA & system design</p>
                  </div>
                  
                  <div className="p-3 rounded-lg bg-[#151515] border border-[#222222] hover:border-emerald-500/40 transition-all duration-200 cursor-pointer">
                    <h4 className="text-sm font-medium text-white mb-1">HR Interview</h4>
                    <p className="text-xs text-zinc-500">Improve soft skills & communication</p>
                  </div>
                </div>
                
                <button className="mt-4 py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2">
                  <Icon name="play" />
                  Start Practice Session
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <p className="text-zinc-400 mb-4 text-center text-sm">
                  Login or sign up to start practicing for mock interviews
                </p>
                <div className="flex gap-3 w-full">
                  <button
                    className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition-all duration-200"
                    onClick={() => navigate("/login")}
                  >
                    Login
                  </button>
                  <button
                    className="flex-1 py-2 bg-[#151515] hover:bg-[#1a1a1a] border border-[#222222] text-white rounded-lg text-sm font-medium transition-all duration-200"
                    onClick={() => navigate("/signup")}
                  >
                    Signup
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* Footer Links */}
          <div className="mt-2 text-xs text-zinc-600">
            <div className="flex flex-wrap gap-x-3 gap-y-1">
              <a href="#" className="hover:text-zinc-400 transition-all duration-200">About</a>
              <a href="#" className="hover:text-zinc-400 transition-all duration-200">Help Center</a>
              <a href="#" className="hover:text-zinc-400 transition-all duration-200">Privacy</a>
              <a href="#" className="hover:text-zinc-400 transition-all duration-200">Terms</a>
              <a href="#" className="hover:text-zinc-400 transition-all duration-200">Careers</a>
            </div>
            <p className="mt-3">© 2025 VIT Connect Community</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Homepage;