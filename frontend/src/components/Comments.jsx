import { useEffect, useState, useRef } from "react";
import { Heart, MessageCircle, Edit3, Trash2, Send, MoreHorizontal } from "lucide-react";

const Comments = ({ postId, currentUserId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [replyContent, setReplyContent] = useState({});
  const [replyingTo, setReplyingTo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [showAllComments, setShowAllComments] = useState(false);

  // Create a ref to track the bottom of the comments section
  const commentsEndRef = useRef(null);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/posts/${postId}/comments`,
          { credentials: 'include' }
        );
        const data = await res.json();

        // Sort comments by createdAt in descending order (newest first)
        const sortedComments = Array.isArray(data)
          ? data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
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
  
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/posts/${postId}/comments`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            content,
            parentComment: parentCommentId,
            user: currentUserId,
          }),
          credentials: 'include'
        }
      );
      const data = await res.json();
  
      // Update comments state by adding the new comment to the top
      setComments((prev) => [data, ...prev]);
  
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
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/comments/${commentId}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: editContent }),
          credentials: 'include'
        }
      );
      const data = await res.json();

      // Update the comments state with the edited content
      setComments((prev) =>
        prev.map((comment) =>
          comment._id === commentId ? { ...comment, content: data.content } : comment
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
      await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/comments/${commentId}`,
        {
          method: 'DELETE',
          credentials: 'include'
        }
      );

      setComments((prev) => prev.filter((comment) => comment._id !== commentId));
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
    setLoading(false);
  };

  const handleLikeComment = async (commentId) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/comments/${commentId}/like`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: currentUserId }),
          credentials: 'include'
        }
      );
      const data = await res.json();

      setComments((prev) =>
        prev.map((comment) =>
          comment._id === commentId ? { ...comment, likes: data.likes } : comment
        )
      );
    } catch (error) {
      console.error("Error liking comment:", error);
    }
  };

  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  const renderComments = (commentList = [], parentId = null) => {
    const filteredComments = (commentList || [])
      .filter((comment) => comment.parentComment === parentId);

    // Limit the number of comments to 7 unless "Show all" is enabled
    const commentsToRender = showAllComments ? filteredComments : filteredComments.slice(0, 7);

    return commentsToRender.map((comment) => (
      <div key={comment._id} className="group">
        <div className="flex items-start space-x-3 p-4 hover:bg-gray-800/50 rounded-xl transition-all duration-200">
          <div className="relative">
            <img
              src={comment.user?.profilePicture || "/default-avatar.png"}
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-700/50"
            />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-900"></div>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-2">
              <h4 className="font-semibold text-white text-sm">
                {comment.user?.name || "Anonymous"}
              </h4>
              <span className="text-gray-400 text-xs">•</span>
              <span className="text-gray-400 text-xs">
                {formatTimeAgo(comment.createdAt)}
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
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors duration-200 disabled:opacity-50"
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

                <div className="flex items-center space-x-6">
                  <button
                    onClick={() => handleLikeComment(comment._id)}
                    className="flex items-center space-x-1 text-sm text-gray-400 hover:text-red-400 transition-colors duration-200"
                  >
                    <Heart size={16} />
                    <span>{comment.likes || 0}</span>
                  </button>

                  <button
                    onClick={() => setReplyingTo(comment._id)}
                    className="flex items-center space-x-1 text-sm text-gray-400 hover:text-blue-400 transition-colors duration-200"
                  >
                    <MessageCircle size={16} />
                    <span>Reply</span>
                  </button>

                  {comment.user?._id === currentUserId && (
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => {
                          setEditingCommentId(comment._id);
                          setEditContent(comment.content);
                        }}
                        className="flex items-center space-x-1 text-sm text-gray-400 hover:text-yellow-400 transition-colors duration-200"
                      >
                        <Edit3 size={14} />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDeleteComment(comment._id)}
                        className="flex items-center space-x-1 text-sm text-gray-400 hover:text-red-400 transition-colors duration-200"
                      >
                        <Trash2 size={14} />
                        <span>Delete</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {replyingTo === comment._id && (
          <div className="ml-13 mr-4 mb-4">
            <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
              <textarea
                value={replyContent[comment._id] || ""}
                onChange={(e) =>
                  setReplyContent({ ...replyContent, [comment._id]: e.target.value })
                }
                placeholder={`Reply to ${comment.user?.name}...`}
                className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows="3"
              />
              <div className="flex justify-end space-x-2 mt-3">
                <button
                  onClick={() => setReplyingTo(null)}
                  className="px-4 py-2 text-gray-400 hover:text-white text-sm font-medium transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleAddComment(comment._id)}
                  disabled={loading}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors duration-200 disabled:opacity-50"
                >
                  <Send size={14} />
                  <span>Reply</span>
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="ml-13">
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
          Comments ({comments?.length || 0})
        </h3>
        <MoreHorizontal size={20} className="text-gray-400" />
      </div>

      {/* Scrollable comments container */}
      <div className="space-y-1 max-h-96 overflow-y-auto custom-scrollbar">
        {comments?.length > 0 ? (
          renderComments(comments)
        ) : (
          <div className="text-center py-12">
            <MessageCircle size={48} className="text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No comments yet</p>
            <p className="text-gray-500 text-sm">Be the first to share your thoughts!</p>
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
            placeholder="What are your thoughts?"
            className="w-full p-4 bg-gray-800 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-200"
            rows="3"
          />
          <div className="flex justify-end">
            <button
              onClick={() => handleAddComment()}
              disabled={loading}
              className={`flex items-center space-x-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                loading
                  ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-blue-500/25"
              }`}
            >
              <Send size={16} />
              <span>{loading ? "Posting..." : "Comment"}</span>
            </button>
          </div>
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