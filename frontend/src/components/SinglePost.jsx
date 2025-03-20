import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PostContent from "./PostContent";
import axios from "axios";
import { formatDate } from "../utils/utils";
import { FaSpinner } from "react-icons/fa";

const SinglePost = ({ recommendedPosts, onBack }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/search/${id}`,
          { withCredentials: true }
        );
        setPost(response.data);
      } catch (err) {
        console.error("Error fetching post", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  // Filter out the currently displayed post from recommendedPosts
  const filteredRecommendedPosts = recommendedPosts?.filter(
    (recommendedPost) => recommendedPost._id !== id
  );

  // Show a spinner while loading
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <FaSpinner className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  // Show an error message if the post is not found
  if (!post) {
    return (
      <div className="text-center text-gray-600 py-8">Post not found.</div>
    );
  }

  return (
    <div>
      {/* Back Button and Single Post Details */}
      <button
        type="button"
        class="bg-black border text-white rounded-md border-r border-gray-100 hover:bg-red-700 hover:text-white mb-6 px-4 py-2"
        onClick={onBack}
      >
        <div class="flex flex-row align-middle">
          <svg
            class="w-5 mr-2"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z"
              clip-rule="evenodd"
            ></path>
          </svg>
          <p class="ml-2">Back to Search</p>
        </div>
      </button>

      <div className="border py-4 px-2 sm:px-4 lg:px-8  rounded-lg shadow-md mb-8">
        {/* Single Post Details */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-4">{post.title}</h2>
          <div className="text-xl">{formatDate(post.updatedAt)}</div>
          <hr className="my-4 border-gray-200" />
          <div
            dangerouslySetInnerHTML={{ __html: post.content }}
            className="prose max-w-none mt-4"
          />
        </div>
      </div>

      {/* Recommended Posts */}
      <div className="border py-4 px-2 sm:px-4 lg:px-8 rounded-lg shadow-md">
        <h3 className="text-2xl font-semibold  mb-6">Recommended Posts</h3>
        <div className="space-y-6">
          {filteredRecommendedPosts?.map((recommendedPost) => (
            <div
              key={recommendedPost._id}
              className="p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => {
                navigate(`/search/${recommendedPost._id}`);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              <div className="flex justify-between items-center">
                <h4 className="text-xl font-semibold  mb-2">
                  {recommendedPost.title}
                </h4>
                <div className="text-sm text-gray-500">
                  {formatDate(recommendedPost.updatedAt)}
                </div>
              </div>
              <PostContent content={recommendedPost.content} />{" "}
              {/* Use the new component */}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SinglePost;
