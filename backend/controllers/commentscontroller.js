import mongoose from "mongoose";
import Comment from "../models/comment";

// ✅ Add a new comment (supports replies)
export const addComment = async (req, res) => {
  try {
    const { content, parentComment } = req.body;
    const { postId } = req.params;
    const userId = req.user._id; // Get user ID from authenticated user

    // Validate post ID
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ error: "Invalid post ID" });
    }

    // Ensure content is not empty
    if (!content || content.trim() === "") {
      return res.status(400).json({ error: "Comment content is required" });
    }

    // Validate parentComment (if provided)
    if (parentComment && !mongoose.Types.ObjectId.isValid(parentComment)) {
      return res.status(400).json({ error: "Invalid parent comment ID" });
    }

    const comment = new Comment({
      user: userId,
      post: postId,
      content,
      parentComment: parentComment || null, // Handle replies
    });

    await comment.save();
    res.status(201).json(comment);
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// ✅ Like a comment
export const likeComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user._id; // Get user ID from authenticated user

    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ error: "Comment not found" });

    if (comment.likedBy.includes(userId)) {
      return res.status(400).json({ error: "User already liked this comment" });
    }

    comment.likes += 1;
    comment.likedBy.push(userId);
    await comment.save();

    res.json(comment);
  } catch (error) {
    console.error("Error liking comment:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// ✅ Edit a comment
export const editComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { content } = req.body;

    const comment = await Comment.findByIdAndUpdate(
      commentId,
      { content },
      { new: true }
    );
    res.json(comment);
  } catch (error) {
    console.error("Error editing comment:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// ✅ Delete a comment
export const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    await Comment.findByIdAndDelete(commentId);
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// ✅ Get all comments for a post (with replies)
export const getComments = async (req, res) => {
  try {
    const { postId } = req.params;

    const fetchComments = async (parentId = null) => {
      const comments = await Comment.find({ post: postId, parentComment: parentId })
        .populate("user", "name profilePicture")
        .lean();

      for (let comment of comments) {
        comment.replies = await fetchComments(comment._id);
      }
      return comments;
    };

    const comments = await fetchComments();
    res.json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};