// models/post.js
import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    content: { type: String, required: true }, // Store Quill HTML content
    reactions: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        type: {
          type: String,
          enum: ["like", "funny", "love", "insightful", "celebrate"],
          required: true,
        },
      },
    ],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment", default: [] }],
    reposts: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Indexing for faster queries
postSchema.index({ user: 1, createdAt: -1 });
postSchema.index({ "reactions.user": 1 });
postSchema.index({ comments: 1 });

const Post = mongoose.models.Post || mongoose.model("Post", postSchema);
export default Post;