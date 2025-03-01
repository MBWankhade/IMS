import Post from "../models/post.js";

export const createPost=async (req, res) => {
    try {
      const { postTitle, postContent } = req.body;
      const newPost = new Post({user:req.user._id, title:postTitle, content:postContent });
      await newPost.save();
      res.status(201).json(newPost);
    } catch (error) {
      res.status(500).json({ message: "Error creating post", error });
    }
}

export const getAllPosts=async (req, res) => {
    try {
      const posts = await Post.find().populate("user", "name email profilePicture").sort({ createdAt: -1 });
      res.status(200).json(posts);
    } catch (error) {
      res.status(500).json({ message: "Error getting posts", error });
    }
}