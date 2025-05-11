import axios from "axios";
import React, { useContext, useEffect, useRef, useState } from "react";
import {
  FaComment,
  FaRetweet,
  FaShare,
  FaSpinner,
  FaUserCircle,
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
import { leftsideBar, mainContaint } from "../utils/colors";
import { lazy } from "react";
import Cursor from "quill/blots/cursor";

function Homepage() {
  const { setUser, user } = useContext(DataContext);
  const navigate = useNavigate();
  const location = useLocation();
  console.log("homepage rendered");

  const [posts, setPosts] = useState([]);
  const [visiblePosts, setVisiblePosts] = useState([]);
  const [openCommentSection, setOpenCommentSection] = useState(null);
  const [parentCommentCounts, setParentCommentCounts] = useState({});
  const [loadIndex, setLoadIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false); // State to track loading status
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
      {/* <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} pauseOnHover /> */}
      <div className="flex flex-1 h-full ">
        <div
          style={{ backgroundColor: `${mainContaint}` }}
          className="flex flex-col flex-1  gap-10 overflow-scroll py-2 px-1 sm:px-2  lg:p-4 custom-scrollbar"
        >
          <div
            className="m-5 p-4  rounded-lg"
            style={{
              // backgroundColor: "rgb(19, 18, 18)",
              boxShadow: "0px 0px 7px rgb(202, 199, 199)",
            }}
          >
            <div className="flex items-center">
              {user?.profilePicture ? (
                <img
                  src={user?.profilePicture}
                  alt="Profile"
                  className="w-12 h-12 mr-5 p-[1px] rounded-full cursor-pointer border-2 border-white hover:border-green-400 transition-all duration-300"
                />
              ) : (
                <FaUserCircle
                  size={80}
                  className="w-12 h-12 mr-5 p-[1px] rounded-full cursor-pointer border-2 border-white hover:border-green-400 transition-all duration-300"
                />
              )}
              <button
                onClick={() => navigate("/share-experience")}
                className="border border-gray-600 rounded-full cursor-pointer p-2 w-full h-14"
              >
                <div className="flex justify-between ">
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

          <div className="w-screen-sm flex flex-col w-full gap-6 md:gap-9 ">
            {visiblePosts?.map((post) => (
              <div
                key={post._id}
                className="mb-6 p-4  rounded-lg"
                style={{
                  // backgroundColor: "rgb(19, 18, 18)",
                  boxShadow: "0px 0px 7px rgb(202, 199, 199)",
                }}
              >
                {/* Post Header */}
                <div className="flex items-center mb-4">
                  <div className="flex justify-center gap-4">
                    {post?.user?.profilePicture ? (
                      <img
                        src={post.user.profilePicture}
                        alt="Profile"
                        className="w-10 h-10 mr-5 rounded-full cursor-pointer border-2 border-white hover:border-blue-400 transition-all duration-300"
                      />
                    ) : (
                      <FaUserCircle
                        size={30}
                        className="w-10 h-10 mr-5 rounded-full cursor-pointer border-2 border-white hover:border-blue-400 transition-all duration-300"
                      />
                    )}
                  </div>

                  <div>
                    <p className="font-bold">{post?.user?.name}</p>
                    <p className="text-sm ">{post.title}</p>
                  </div>
                </div>

                {/* Post Content */}
                <PostContent content={post.content} />

                {/* Divider Line */}
                <hr className="my-4 border-gray-200" />

                {/* Post Actions */}
                <div className="flex justify-between ">
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

            <div ref={loaderRef}></div>
          </div>
        </div>

        <div
          className="hidden xl:flex flex-col w-72 2xl:w-[350px] px-4 py-10 gap-10 overflow-scroll custom-scrollbar 
   rounded-lg"
          style={{
            backgroundColor: leftsideBar,
          }}
        >
          <div className="sticky top-20 flex flex-col gap-10">
            {/* Trending Now Section */}
            <div
              className="mt-5 p-3 rounded-xl border-[1px] border-[rgba(103,61,243,0.4)] 
             bg-gradient-to-br from-[#0e0f0e] to-transparent 
             shadow-[0px_0px_7px_rgb(11,234,164)] transition-all 
             hover:shadow-[0px_0px_20px_rgba(0,255,180,0.5)] 
             hover:border-[rgba(237,243,239,0.51)] cursor-pointer"
            >
              <h2 className="text-2xl font-extrabold mb-4 text-gray-200 text-center">
                🔥 Trending Now
              </h2>
              <ul className="space-y-2 text-gray-400">
                <li className="hover:text-white transition-all duration-300 cursor-pointer">
                  🏆 VIT'24 Interview Experiences
                </li>
                <li className="hover:text-white transition-all duration-300 cursor-pointer">
                  📚 Placement Preparations
                </li>
                <li className="hover:text-white transition-all duration-300 cursor-pointer">
                  🎤 Mock Interviews Results
                </li>
                <li className="hover:text-white transition-all duration-300 cursor-pointer">
                  📊 Weekly Rankings
                </li>
              </ul>
            </div>

            {/* Mock Interviews Section */}
            <div
              className="mt-5 p-3 rounded-xl border border-[rgba(9,237,66,0.51)] 
             bg-gradient-to-br from-[#0e0f0e] to-transparent 
             shadow-[0px_0px_7px_rgb(11,234,164)] transition-all 
             hover:shadow-[0px_0px_20px_rgba(9,237,66,0.51)] 
             hover:border-[rgba(237,243,239,0.51)] cursor-pointer"
            >
              <h2 className="text-2xl text-center font-extrabold mb-4 text-gray-200">
                🎯 Mock Interviews
              </h2>
              {user ? (
                <div className="flex flex-col w-full text-gray-400">
                  <p className="hover:text-white mb-4 transition-all duration-300 cursor-pointer">
                    🚀 Boost your interview skills with our tools:
                  </p>
                  <div className="space-y-4">
                    <PopupModal />
                    <InputModal />
                  </div>
                  <p className="text-sm hover:text-white mb-4 transition-all duration-300 cursor-pointer mt-4">
                    Get feedback, track progress, and ace your interviews!
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <p className="text-gray-400 mb-4">
                    🚀 Login or sign up to start practicing for mock interviews:
                  </p>
                  <div className="flex gap-6">
                    <button
                      className="bg-blue-500 font-semibold text-lg text-white px-6 py-2 rounded-xl shadow-lg 
              hover:bg-blue-600 transition-all duration-300 transform hover:scale-105"
                      onClick={() => navigate("/login")}
                    >
                      Login
                    </button>
                    <button
                      className="font-semibold text-lg px-6 py-2 rounded-xl border border-gray-500 shadow-lg 
              hover:bg-gray-700 hover:text-white transition-all duration-300 transform hover:scale-105"
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
