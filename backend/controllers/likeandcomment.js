import Post from "../models/post.js";
import Comment from "../models/comment.js";
import mongoose from "mongoose";

// Handle post reactions
export const reactToPost = async (req, res) => {
  const { postId } = req.params;
  const { reactionType } = req.body;
  const userId = req.user.id;

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if the user already has a reaction
    const existingReactionIndex = post.reactions.findIndex(
      (r) => r.user.toString() === userId
    );

    if (existingReactionIndex !== -1) {
      // Update existing reaction
      post.reactions[existingReactionIndex].type = reactionType;
    } else {
      // Add new reaction
      post.reactions.push({ user: userId, type: reactionType });
    }

    await post.save();

    // Count reactions by type
    const reactionCounts = post.reactions.reduce((acc, reaction) => {
      acc[reaction.type] = (acc[reaction.type] || 0) + 1;
      return acc;
    }, {});

    res.json({ message: "Reaction updated", reactionCounts });
  } catch (err) {
    console.error("Error reacting to post", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get reactions for a post
export const getPostReactions = async (req, res) => {
  const { postId } = req.params;

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Count reactions by type
    const reactionCounts = post.reactions.reduce((acc, reaction) => {
      acc[reaction.type] = (acc[reaction.type] || 0) + 1;
      return acc;
    }, {});

    // Find the user's reaction
    const userReaction = post.reactions.find(
      (r) => r.user.toString() === req.user.id
    )?.type;

    res.json({ reactionCounts, userReaction });
  } catch (err) {
    console.error("Error fetching reactions", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Add a new comment
export const addComment = async (req, res) => {
  try {
    const { user, content, parentComment } = req.body;
    const { postId } = req.params;

    console.log("Received payload:", { user, content, postId, parentComment });

    // Validate user ID
    if (!mongoose.Types.ObjectId.isValid(user)) {
      console.error("Invalid user ID:", user);
      return res.status(400).json({ error: "Invalid user ID" });
    }

    // Validate post ID
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      console.error("Invalid post ID:", postId);
      return res.status(400).json({ error: "Invalid post ID" });
    }

    // Ensure content is not empty
    if (!content || content.trim() === "") {
      console.error("Empty content:", content);
      return res.status(400).json({ error: "Comment content is required" });
    }

    // Create the comment
    const comment = new Comment({
      user: new mongoose.Types.ObjectId(user),
      post: new mongoose.Types.ObjectId(postId),
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
    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ error: "Comment not found" });

    comment.likes = (comment.likes || 0) + 1;
    await comment.save();
    res.json(comment);
  } catch (error) {
    console.error("Error liking comment:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Edit a comment
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

// Delete a comment
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

// Get all comments for a post
export const getPostComments = async (req, res) => {
  try {
    const { postId } = req.params;

    // Validate post ID
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ error: "Invalid post ID" });
    }

    const comments = await Comment.find({ post: postId }).populate(
      "user",
      "name email profilePicture"
    );

    res.json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get parent comment count for a post
export const getParentCommentCount = async (req, res) => {
  try {
    const postId = req.params.postId;
    const count = await Comment.countDocuments({ post: postId, parentComment: null });
    res.json({ count });
  } catch (error) {
    console.error("Error fetching parent comment count:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};