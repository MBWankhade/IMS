import React, { useContext, useEffect, useState, useRef } from "react";
import { DataContext } from "../context/DataProvider";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaUserCircle,
  FaThumbsUp,
  FaComment,
  FaShare,
  FaRetweet,
  FaSpinner,
} from "react-icons/fa";
import { Icon } from "semantic-ui-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "semantic-ui-css/semantic.min.css";
import axios from "axios";
import InputModal from "../components/InputModal";
import PopupModal from "../components/PopupModal";
import Reactions from "../components/Reactions";
import Comments from "../components/Comments";
import Navbar from "../components/Navbar"; 
import PostContent from "../components/PostContent";

function Homepage() {
  const { setUser, user } = useContext(DataContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [posts, setPosts] = useState([]);
  const [visiblePosts, setVisiblePosts] = useState([]);
  const [openCommentSection, setOpenCommentSection] = useState(null);
  const [parentCommentCounts, setParentCommentCounts] = useState({});
  const [loadIndex, setLoadIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false); // State to track loading status
  const loaderRef = useRef(null);

  // Fetch posts and parent comment counts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/posts`, { withCredentials: true });
        setTimeout(() => {
          setPosts(res.data);
          setVisiblePosts(res.data.slice(0, 1));
          setLoadIndex(1);
          setIsLoading(false);
  
          // Fetch parent comment counts for each post
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

  // Fetch parent comment count for a specific post
  const fetchParentCommentCount = async (postId) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL
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

  // Function to toggle comment section
  const toggleCommentSection = (postId) => {
    if (openCommentSection === postId) {
      setOpenCommentSection(null); // Collapse the comment section
    } else {
      setOpenCommentSection(postId); // Open the comment section for this post
    }
  };

  // Load more posts when the loader is in view
  // Infinite Scroll for More Posts
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading && loadIndex < posts.length) {
          setIsLoading(true);
          setTimeout(() => {
            const nextPosts = posts.slice(loadIndex, loadIndex + 1);
            setVisiblePosts((prev) => [...prev, ...nextPosts]);
            setLoadIndex((prev) => prev + 1);
            setIsLoading(false);
          }, 1000); // 2-second delay before loading new posts
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

  return (
    <>
      {user && <Navbar />}
      {/* <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} pauseOnHover /> */}
      <div className="flex w-full p-20 shadow-sm bg-gray-50 h-full">
        {/* Profile Card (Left) */}
        <div
          className="w-1/5 m-5 p-5 bg-white border border-blue-300 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
          style={{ height: "250px", overflowY: "auto" }}
        >
          <div className="flex flex-col items-center">
            {user?.profilePicture ? (
              <img
                src={user.profilePicture}
                alt="Profile"
                className="w-20 h-20 rounded-full cursor-pointer border-2 border-blue-200 hover:border-blue-400 transition-all duration-300"
              />
            ) : (
              <FaUserCircle
                size={80}
                className="mb-4 cursor-pointer text-blue-300 hover:text-blue-400 transition-colors duration-300"
              />
            )}
            <h2 className="text-xl font-bold text-gray-800 mt-2">
              {user?.name}
            </h2>
            <h2 className="text-sm text-gray-600 mt-1">{user?.email}</h2>
            <button className="mt-4 p-2 w-full bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300">
              View Profile
            </button>
          </div>
        </div>

        {/* Main Feed (Middle) */}
        <div className="flex-1">
          {/* Write for Community Div */}
          <div className="m-5 p-5 bg-white border border-blue-300 rounded-lg">
            <div className="flex items-center">
              {user?.profilePicture ? (
                <img
                  src={user?.profilePicture}
                  alt="Profile"
                  className="w-10 h-10 mr-5 rounded-full cursor-pointer border-2 border-blue-200 hover:border-blue-400 transition-all duration-300"
                />
              ) : (
                <FaUserCircle
                  size={80}
                  className="mb-4 cursor-pointer text-blue-300 hover:text-blue-400 transition-colors duration-300"
                />
              )}
              <button
                onClick={() => navigate("/share-experience")}
                className="border border-blue-300 rounded-full cursor-pointer p-2 w-full h-14"
              >
                <div className="flex justify-between">
                  <p className="ml-2 font-bold">Write for Community</p>
                  <Icon
                    name="edit"
                    size="large"
                    className="text-green-500 space-x-2"
                  />
                </div>
              </button>
            </div>
          </div>

          {/* Posts Feed */}
          <div className="m-5">
            {visiblePosts?.map((post) => (
              <div key={post._id} className="mb-6 p-4 border border-blue-300 rounded-lg">
                {/* Post Header */}
                <div className="flex items-center mb-4">
                  {post?.user?.profilePicture ? (
                    <img
                      src={post.user.profilePicture}
                      alt="Profile"
                      className="w-10 h-10 mr-5 rounded-full cursor-pointer border-2 border-blue-200 hover:border-blue-400 transition-all duration-300"
                    />
                  ) : (
                    <FaUserCircle
                      size={30}
                      className="mb-4 cursor-pointer text-blue-300 hover:text-blue-400 transition-colors duration-300"
                    />
                  )}
                  <div>
                    <p className="font-bold">{post?.user?.name}</p>
                    <p className="text-sm text-gray-500">{post.title}</p>
                  </div>
                </div>

                {/* Post Content */}
                <PostContent content={post.content} />

                {/* Divider Line */}
                <hr className="my-4 border-gray-200" />

                {/* Post Actions */}
                <div className="flex justify-between text-gray-600">
                  <Reactions postId={post._id} />
                  <button
                    onClick={() => toggleCommentSection(post._id)} // Toggle comment section
                    className="flex items-center space-x-2 hover:text-green-500"
                  >
                    <FaComment />
                    <span>{parentCommentCounts[post._id] || 0} Comments</span>
                  </button>
                  <button className="flex items-center space-x-2 hover:text-purple-500">
                    <FaRetweet />
                    <span>{post.reposts} Reposts</span>
                  </button>
                  <button className="flex items-center space-x-2 hover:text-red-500">
                    <FaShare />
                    <span>Send</span>
                  </button>
                </div>

                {/* Conditionally Render Comments Section */}
                {openCommentSection === post._id && (
                  <Comments postId={post._id} currentUserId={user?._id} />
                )}
              </div>
            ))}
            {/* Loader */}
            {/* {isLoading && (
              <div className="text-center py-4">
                <div className="spinner-border text-primary" role="status">
                  <span className="sr-only">Loading...</span>
                </div>
              </div>
            )} */}
            {/* Load more trigger */}
            {/* {loadIndex < posts.length && !isLoading && (
              <div ref={loaderRef} className="text-center py-4">Scroll to load more posts...</div>
            )} */}
            {isLoading && (
              <div className="flex justify-center items-center w-full h-40">
                <FaSpinner className="animate-spin text-blue-500 text-4xl" />
              </div>
            )}

            <div ref={loaderRef} ></div>
          </div>
        </div>

        {/* Trending Now Card (Right) */}
        <div className="w-1/5 m-5">
          {/* Sticky Container */}
          <div className="sticky top-20">
            {/* Trending Now Card */}
            <div className="p-5 bg-white border border-blue-300 rounded-lg" style={{ height: "200px", overflowY: "auto" }}>
              <h2 className="text-xl font-bold mb-4">Trending Now</h2>
              <ul className="list-disc list-inside">
                <li className="mb-2">VIT'24 Interview Experiences</li>
                <li className="mb-2">Placement Preparations</li>
                <li className="mb-2">Mock Interviews Results</li>
                <li className="mb-2">Weekly Rankings</li>
              </ul>
            </div>

            {/* Mock Interviews Card */}
            <div className="mt-5 p-5 bg-white border border-blue-300 rounded-lg" style={{ height: "230px", overflowY: "auto" }}>
              <h2 className="text-xl font-bold text-gray-800 mb-4">Mock Interviews</h2>
              {user ? (
                <div className="flex flex-col">
                  <div className="mb-4">
                    <p className="text-gray-600 mb-2">Practice and improve your interview skills with our tools:</p>
                    <div className="flex gap-4">
                      <div>
                        <PopupModal />
                      </div>
                      <div>
                        <InputModal />
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">Get feedback, track progress, and ace your interviews!</p>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <p className="text-gray-600 mb-4">Login or sign up to start practicing for mock interviews:</p>
                  <div className="flex gap-8">
                    <button
                      className="bg-blue-400 font-semibold text-lg text-white px-4 py-1 rounded-md shadow-md hover:bg-blue-500 transition-colors"
                      onClick={() => navigate("/login")}
                    >
                      Login
                    </button>
                    <button
                      className="font-semibold text-lg px-4 py-1 rounded-md border border-gray-300 shadow-md hover:bg-gray-100 transition-colors"
                      onClick={() => navigate("/signup")}
                    >
                      Signup
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Homepage;