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
        setComments(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.error("Error fetching comments:", error);
        setComments([]);
      }
    };
    fetchComments();
  }, [postId]);

  // Scroll to the bottom whenever comments are updated
  useEffect(() => {
    if (commentsEndRef.current) {
      commentsEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [comments]);

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

      // Update comments state
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
      <div key={comment._id} className="p-2 border-b">
        <div className="flex items-start space-x-2">
          <img
            src={comment.user?.profilePicture || "/default-avatar.png"}
            alt="Profile"
            className="w-8 h-8 rounded-full"
          />
          <div>
            <p className="font-bold">{comment.user?.name || "Anonymous"}</p>
            {editingCommentId === comment._id ? (
              <>
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={() => handleSaveEdit(comment._id)}
                  className="mt-2 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setEditingCommentId(null);
                    setEditContent("");
                  }}
                  className="mt-2 ml-2 p-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                >
                  Cancel
                </button>
              </>
            ) : (
              <p className="text-gray-700">{comment.content}</p>
            )}
            <div className="flex space-x-4 text-sm text-gray-500">
              <button
                onClick={() => handleLikeComment(comment._id)}
                className="hover:text-blue-500"
              >
                Like ({comment.likes || 0})
              </button>
              <button
                onClick={() => setReplyingTo(comment._id)}
                className="hover:text-blue-500"
              >
                Reply
              </button>
              {comment.user?._id === currentUserId && (
                <>
                  <button
                    onClick={() => {
                      setEditingCommentId(comment._id);
                      setEditContent(comment.content);
                    }}
                    className="hover:text-blue-500"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteComment(comment._id)}
                    className="hover:text-red-500"
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
            <p className="text-xs text-gray-400">
              {new Date(comment.createdAt).toLocaleString()}
            </p>
          </div>
        </div>

        {replyingTo === comment._id && (
          <div className="mt-2 ml-10">
            <textarea
              value={replyContent[comment._id] || ""}
              onChange={(e) =>
                setReplyContent({ ...replyContent, [comment._id]: e.target.value })
              }
              placeholder="Write a reply..."
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={() => handleAddComment(comment._id)}
              className="mt-2 p-2 w-full rounded-lg text-white bg-blue-500 hover:bg-blue-600"
            >
              Reply
            </button>
          </div>
        )}

        <div className="ml-6 mt-2">
          {renderComments(comments || [], comment._id)}
        </div>
      </div>
    ));
  };

  return (
    <div className="mt-4">
      {/* Scrollable comments container */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {comments?.length > 0 ? (
          renderComments(comments)
        ) : (
          <p className="text-gray-500">No comments yet. Be the first to comment!</p>
        )}
        {/* Add a ref to the bottom of the comments section */}
        <div ref={commentsEndRef} />
      </div>

      {/* Show more button */}
      {comments?.length > 7 && !showAllComments && (
        <button
          onClick={() => setShowAllComments(true)}
          className="mt-2 p-2 w-full text-blue-500 hover:bg-blue-50 rounded-lg"
        >
          Show more comments
        </button>
      )}

      {/* Add new comment section */}
      <div className="mt-4">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={() => handleAddComment()}
          className={`mt-2 p-2 w-full rounded-lg text-white ${
            loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
          }`}
          disabled={loading}
        >
          {loading ? "Posting..." : "Comment"}
        </button>
      </div>
    </div>
  );
};

export default Comments;