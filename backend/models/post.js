import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId,ref:"User", required: true },
  title: { type: String, required: true },
  content: { type: String, required: true }, // Store Quill HTML content
  likes: { type: Number, default: 0 },
  comments: [{ type: String}],
  reposts: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

const Post= mongoose.model("Post", postSchema);
export default Post;

