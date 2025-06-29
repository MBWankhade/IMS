import { useEffect, useState, useRef } from "react";
import axios from "axios";

const Comments = ({ postId, currentUserId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [replyContent, setReplyContent] = useState({});
  const [replyingTo, setReplyingTo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [showAllComments, setShowAllComments] = useState(false); // State to track "Show all"

  // Create a ref to track the bottom of the comments section
  const commentsEndRef = useRef(null);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/posts/${postId}/comments`,
          { withCredentials: true }
        );

        // Sort comments by createdAt in descending order (newest first)
        const sortedComments = Array.isArray(res.data)
          ? res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          : [];

        setComments(sortedComments);
      } catch (error) {
        console.error("Error fetching comments:", error);
        setComments([]);
      }
    };
    fetchComments();
  }, [postId]);

  const handleAddComment = async (parentCommentId = null) => {
    if (!newComment.trim() && !replyContent[parentCommentId]?.trim()) return;
  
    setLoading(true);
    try {
      const content = parentCommentId ? replyContent[parentCommentId] : newComment;
  
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/posts/${postId}/comments`,
        {
          content,
          parentComment: parentCommentId,
          user: currentUserId,
        },
        { withCredentials: true }
      );
  
      // Update comments state by adding the new comment to the top
      setComments((prev) => [res.data, ...prev]);
  
      // Reset states
      if (parentCommentId) {
        setReplyContent((prev) => ({ ...prev, [parentCommentId]: "" })); // Clear reply content
        setReplyingTo(null); // Hide reply box
      } else {
        setNewComment(""); // Clear new comment
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
    setLoading(false);
  };

  // Scroll to the top whenever comments are updated
  useEffect(() => {
    if (comments.length > 0) {
      const commentsContainer = document.querySelector(".max-h-96"); // Adjust the selector if needed
      if (commentsContainer) {
        commentsContainer.scrollTop = 0; // Scroll to the top
      }
    }
  }, [comments]);

  const handleSaveEdit = async (commentId) => {
    if (!editContent.trim()) return; // Ensure the edited content is not empty

    setLoading(true);
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/comments/${commentId}`,
        { content: editContent },
        { withCredentials: true }
      );

      // Update the comments state with the edited content
      setComments((prev) =>
        prev.map((comment) =>
          comment._id === commentId ? { ...comment, content: res.data.content } : comment
        )
      );

      // Reset editing state
      setEditingCommentId(null);
      setEditContent("");
    } catch (error) {
      console.error("Error saving edit:", error);
    }
    setLoading(false);
  };

  const handleDeleteComment = async (commentId) => {
    setLoading(true);
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/comments/${commentId}`,
        { withCredentials: true }
      );

      setComments((prev) => prev.filter((comment) => comment._id !== commentId));
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
    setLoading(false);
  };

  const handleLikeComment = async (commentId) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/comments/${commentId}/like`,
        { userId: currentUserId },
        { withCredentials: true }
      );

      setComments((prev) =>
        prev.map((comment) =>
          comment._id === commentId ? { ...comment, likes: res.data.likes } : comment
        )
      );
    } catch (error) {
      console.error("Error liking comment:", error);
    }
  };

  const renderComments = (commentList = [], parentId = null) => {
    const filteredComments = (commentList || [])
      .filter((comment) => comment.parentComment === parentId);

    // Limit the number of comments to 7 unless "Show all" is enabled
    const commentsToRender = showAllComments ? filteredComments : filteredComments.slice(0, 7);

    return commentsToRender.map((comment) => (
      <div key={comment._id} className="group">
        <div className="flex items-start space-x-3 p-4 hover:bg-gray-800/30 rounded-xl transition-all duration-200">
          <div className="relative">
            <img
              src={comment.user?.profilePicture || "/default-avatar.png"}
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-700/50"
            />
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900"></div>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-2">
              <h4 className="font-semibold text-white text-sm">
                {comment.user?.name || "Anonymous"}
              </h4>
              <span className="text-gray-400 text-xs">•</span>
              <span className="text-gray-400 text-xs">
                {new Date(comment.createdAt).toLocaleString()}
              </span>
            </div>

            {editingCommentId === comment._id ? (
              <div className="space-y-3">
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows="3"
                />
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleSaveEdit(comment._id)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors duration-200"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setEditingCommentId(null);
                      setEditContent("");
                    }}
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm font-medium transition-colors duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-gray-100 text-sm leading-relaxed mb-3">
                  {comment.content}
                </p>

                <div className="flex items-center space-x-6 text-sm text-gray-400">
                  <button
                    onClick={() => handleLikeComment(comment._id)}
                    className="hover:text-red-400 transition-colors duration-200"
                  >
                    ❤️ Like ({comment.likes || 0})
                  </button>

                  <button
                    onClick={() => setReplyingTo(comment._id)}
                    className="hover:text-blue-400 transition-colors duration-200"
                  >
                    💬 Reply
                  </button>

                  {comment.user?._id === currentUserId && (
                    <>
                      <button
                        onClick={() => {
                          setEditingCommentId(comment._id);
                          setEditContent(comment.content);
                        }}
                        className="hover:text-yellow-400 transition-colors duration-200"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDeleteComment(comment._id)}
                        className="hover:text-red-400 transition-colors duration-200"
                      >
                        🗑️ Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {replyingTo === comment._id && (
          <div className="mt-2 ml-10">
            <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
              <textarea
                value={replyContent[comment._id] || ""}
                onChange={(e) =>
                  setReplyContent({ ...replyContent, [comment._id]: e.target.value })
                }
                placeholder="Write a reply..."
                className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows="3"
              />
              <button
                onClick={() => handleAddComment(comment._id)}
                className="mt-2 p-2 w-full rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
              >
                Reply
              </button>
            </div>
          </div>
        )}

        <div className="ml-6 mt-2">
          {renderComments(comments || [], comment._id)}
        </div>
      </div>
    ));
  };

  return (
    <div className="bg-gray-900 rounded-2xl p-6 space-y-6">
      {/* Comments Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-white">
          Comments
        </h3>
      </div>

      {/* Scrollable comments container */}
      <div className="space-y-2 max-h-96 overflow-y-auto custom-scrollbar">
        {comments?.length > 0 ? (
          renderComments(comments)
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">💬</div>
            <p className="text-gray-400 text-lg">No comments yet</p>
            <p className="text-gray-500 text-sm">Be the first to comment!</p>
          </div>
        )}
        {/* Add a ref to the bottom of the comments section */}
        <div ref={commentsEndRef} />
      </div>

      {/* Show more button */}
      {comments?.length > 7 && !showAllComments && (
        <button
          onClick={() => setShowAllComments(true)}
          className="w-full py-3 text-blue-400 hover:text-blue-300 bg-gray-800/50 hover:bg-gray-800 rounded-lg text-sm font-medium transition-all duration-200 border border-gray-700/50"
        >
          Show more comments
        </button>
      )}

      {/* Add new comment section */}
      <div className="border-t border-gray-700/50 pt-6">
        <div className="space-y-3">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="w-full p-4 bg-gray-800 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-200"
            rows="3"
          />
          <button
            onClick={() => handleAddComment()}
            className={`w-full p-3 rounded-xl text-white font-medium transition-all duration-200 ${
              loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
            }`}
            disabled={loading}
          >
            {loading ? "Posting..." : "Comment"}
          </button>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #374151;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #6B7280;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #9CA3AF;
        }
      `}</style>
    </div>
  );
};

export default Comments;