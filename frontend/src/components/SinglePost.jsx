import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PostContent from "./PostContent";
import axios from "axios";

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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!post) {
    return <div>Post not found</div>;
  }

  return (
    <div className="p-8">
      {/* Back Button and Single Post Details */}
      <div className="bg-white p-8 rounded-lg shadow-md mb-8">
        <button
          onClick={onBack}
          className="mb-6 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
        >
          Back to Search
        </button>

        {/* Single Post Details */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">{post.title}</h2>
          <div
            dangerouslySetInnerHTML={{ __html: post.content }}
            className="prose max-w-none"
          />
          <div className="text-sm text-gray-500">
            <span className="mr-4">Company: {post.company}</span>
            <span className="mr-4">Role: {post.role}</span>
            <span>Placement Type: {post.placementType}</span>
          </div>
        </div>
      </div>

      {/* Recommended Posts */}
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h3 className="text-2xl font-semibold text-gray-800 mb-6">
          Recommended Posts
        </h3>
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
              <h4 className="text-xl font-semibold text-gray-800 mb-2">
                {recommendedPost.title}
              </h4>
              <PostContent content={recommendedPost.content} />{" "}
              {/* Use the new component */}
              <div className="text-sm text-gray-500">
                <span className="mr-4">Company: {recommendedPost.company}</span>
                <span className="mr-4">Role: {recommendedPost.role}</span>
                <span>Placement Type: {recommendedPost.placementType}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SinglePost;