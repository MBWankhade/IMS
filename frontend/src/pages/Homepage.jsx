import React, { useContext, useEffect, useState } from "react";
import { DataContext } from "../context/DataProvider";
import { useNavigate, useLocation } from "react-router-dom";
import { FaUserCircle, FaThumbsUp, FaComment, FaShare, FaRetweet } from "react-icons/fa";
import { Icon } from "semantic-ui-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "semantic-ui-css/semantic.min.css";
import axios from "axios";

function Homepage() {
  const { setUser, user } = useContext(DataContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [posts, setPosts] = useState([]);
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/posts`, { withCredentials: true })
      .then((res) => setPosts(res.data))
      .catch((err) => console.error("Error fetching posts", err));
  }, []);
  

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

  return (
    <> 
      {/* <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} pauseOnHover /> */}
      <div className="flex h-full w-full p-20 shadow-sm bg-gray-50">
        {/* Profile Card (Left) */}
        <div className="w-1/5 m-5 p-5 bg-white border border-blue-300 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300" style={{ height: "250px", overflowY: "auto" }}>
  <div className="flex flex-col items-center">
    {user?.profilePicture ? (
      <img 
        src={user.profilePicture} 
        alt="Profile" 
        className="w-20 h-20 rounded-full cursor-pointer border-2 border-blue-200 hover:border-blue-400 transition-all duration-300" 
      />
    ) : (
      <FaUserCircle size={80} className="mb-4 cursor-pointer text-blue-300 hover:text-blue-400 transition-colors duration-300" />
    )}
    <h2 className="text-xl font-bold text-gray-800 mt-2">{user?.name}</h2>
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
      <FaUserCircle size={80} className="mb-4 cursor-pointer text-blue-300 hover:text-blue-400 transition-colors duration-300" />
    )}
              <button onClick={()=>navigate('/share-experience')} className="border border-blue-300 rounded-full cursor-pointer p-2 w-full h-14">
                <div className="flex justify-between">
                  <p className="ml-2 font-bold">Write for Community</p>
                  <Icon name="edit" size="large" className="text-green-500 space-x-2" />
                </div>
              </button>
            </div>
          </div>

          {/* Posts Feed */}
          <div className="m-5">
            {posts?.map((post) => (
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
      <FaUserCircle size={30} className="mb-4 cursor-pointer text-blue-300 hover:text-blue-400 transition-colors duration-300" />
    )}
                  <div>
                    <p className="font-bold">{post?.user?.name}</p>
                    <p className="text-sm text-gray-500">{post.title}</p>
                  </div>
                </div>

                {/* Post Content */}
                {/* <p style={{ whiteSpace: "pre-line" }} className="text-gray-700 mb-4">{post.content}</p>  */}
                <div dangerouslySetInnerHTML={{ __html: post.content }} className="prose max-w-none" /> 

                {/* Divider Line */}
                <hr className="my-4 border-gray-200" />        

                {/* Post Actions */}
                <div className="flex justify-between text-gray-600">
                  <button className="flex items-center space-x-2 hover:text-blue-500">
                    <FaThumbsUp />
                    <span>{post.likes} Likes</span>
                  </button>
                  <button className="flex items-center space-x-2 hover:text-green-500">
                    <FaComment />
                    <span>{post.comments.length} Comments</span>
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
              </div>
            ))}
          </div>
        </div>

        {/* Trending Now Card (Right) */}
        <div className="w-1/5 m-5 p-5 bg-white border border-blue-300 rounded-lg" style={{ height: "200px", overflowY: "auto" }}>
          <h2 className="text-xl font-bold mb-4">Trending Now</h2>
          <ul className="list-disc list-inside">
            <li className="mb-2">VIT'24 Interview Experiences</li>
            <li className="mb-2">Placement Preparations</li>
            <li className="mb-2">Mock Interviews Results</li>
            <li className="mb-2">Weekly Rankings</li>
          </ul>
        </div>
      </div>
    </>
  );
}

export default Homepage; 