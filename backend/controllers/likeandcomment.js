import Post from "../models/post.js";
import Comment from "../models/comment.js";
import mongoose from "mongoose";

// Handle post reactions
export const reactToPost = async (req, res) => {
  const { postId } = req.params;
  const { reactionType } = req.body;
  const userId = req.user._id.toString(); // Ensure user ID is a string

  if (!mongoose.isValidObjectId(postId)) {
    return res.status(400).json({ message: "Invalid post ID" });
  }

  try {
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    // Check if user already reacted
    const existingReaction = post.reactions.find((r) => r.user.toString() === userId);
    if (existingReaction) {
      existingReaction.type = reactionType; // Update reaction
    } else {
      post.reactions.push({ user: userId, type: reactionType }); // Add new reaction
    }

    await post.save();

    // Count reactions by type
    const reactionCounts = post.reactions.reduce((acc, { type }) => {
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});

    res.json({ message: "Reaction updated", reactionCounts });
  } catch (error) {
    console.error("Error reacting to post:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get reactions for a post
export const getPostReactions = async (req, res) => {
  const { postId } = req.params;
  const userId = req.user._id.toString();

  if (!mongoose.isValidObjectId(postId)) {
    return res.status(400).json({ message: "Invalid post ID" });
  }

  try {
    const post = await Post.findById(postId).lean(); // Use lean() for read-only efficiency
    if (!post) return res.status(404).json({ message: "Post not found" });

    // Count reactions
    const reactionCounts = post.reactions.reduce((acc, { type }) => {
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});

    // Find the user's reaction
    const userReaction = post.reactions.find((r) => r.user.toString() === userId)?.type;

    res.json({ reactionCounts, userReaction });
  } catch (error) {
    console.error("Error fetching reactions:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Add a new comment
export const addComment = async (req, res) => {
  try {
    const { content, parentComment } = req.body;
    const { postId } = req.params;
    const userId = req.user._id.toString();

    if (!mongoose.isValidObjectId(postId)) {
      return res.status(400).json({ error: "Invalid post ID" });
    }

    if (!content || content.trim() === "") {
      return res.status(400).json({ error: "Comment content is required" });
    }

    const comment = new Comment({
      user: userId,
      post: postId,
      content,
      parentComment: parentComment ? new mongoose.Types.ObjectId(parentComment) : null,
    });

    // Save the comment
    await comment.save();

    // Populate the user field in the response
    const populatedComment = await Comment.findById(comment._id).populate("user", "name profilePicture");

    // Send the populated comment as the response
    res.status(201).json(populatedComment);
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Like a comment
export const likeComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user._id; // Ensure user ID is available

    // Validate comment ID
    if (!mongoose.Types.ObjectId.isValid(commentId)) {
      return res.status(400).json({ error: "Invalid comment ID" });
    }

    // Find the comment
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    // Check if the user has already liked the comment
    const userIndex = comment.likedBy.indexOf(userId);

    if (userIndex !== -1) {
      // User has already liked the comment, so remove the like
      comment.likes -= 1;
      comment.likedBy.splice(userIndex, 1); // Remove the user from the likedBy array
    } else {
      // User has not liked the comment, so add the like
      comment.likes += 1;
      comment.likedBy.push(userId); // Add the user to the likedBy array
    }

    // Save the updated comment
    await comment.save();

    // Return the updated comment
    res.status(200).json(comment);
  } catch (error) {
    console.error("Error liking comment:", error.message, error.stack);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


// Edit a comment
export const editComment = async (req, res) => {
  const { commentId } = req.params;
  const { content } = req.body;
  const userId = req.user._id.toString();

  if (!mongoose.isValidObjectId(commentId)) {
    return res.status(400).json({ error: "Invalid comment ID" });
  }

  try {
    const comment = await Comment.findOne({ _id: commentId, user: userId });
    if (!comment) return res.status(403).json({ error: "You are not authorized to edit this comment" });

    comment.content = content;
    await comment.save();
    res.json(comment);
  } catch (error) {
    console.error("Error editing comment:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Delete a comment
export const deleteComment = async (req, res) => {
  const { commentId } = req.params;
  const userId = req.user._id.toString();

  if (!mongoose.isValidObjectId(commentId)) {
    return res.status(400).json({ error: "Invalid comment ID" });
  }

  try {
    const comment = await Comment.findOne({ _id: commentId, user: userId });
    if (!comment) return res.status(403).json({ error: "You are not authorized to delete this comment" });

    await Comment.findByIdAndDelete(commentId);
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get all comments for a post
export const getPostComments = async (req, res) => {
  const { postId } = req.params;

  if (!mongoose.isValidObjectId(postId)) {
    return res.status(400).json({ error: "Invalid post ID" });
  }

  try {
    const comments = await Comment.find({ post: postId })
      .populate("user", "name email profilePicture")
      .lean();

    res.json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get parent comment count for a post
export const getParentCommentCount = async (req, res) => {
  const { postId } = req.params;

  if (!mongoose.isValidObjectId(postId)) {
    return res.status(400).json({ message: "Invalid post ID" });
  }

  try {
    const count = await Comment.countDocuments({ post: postId, parentComment: null });
    res.json({ count });
  } catch (error) {
    console.error("Error fetching parent comment count:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
