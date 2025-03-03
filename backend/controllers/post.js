import { ErrorHandler } from "../middlewares/error.js";
import Post from "../models/post.js";

export const createPost=async (req, res,next) => {
    try {
      const { postTitle, postContent } = req.body;
      if(!postTitle || !postContent){
        return next(new ErrorHandler("Please fill all the fields",400));
      }
      const newPost = new Post({user:req.user._id, title:postTitle, content:postContent });
      await newPost.save();
      res.status(201).json({
        success: true,
        message: "Post created successfully",
      });
    } catch (error) {
      return next(new ErrorHandler("Error creating post",500));
    }
}

export const getAllPosts=async (req, res) => {
    try {
      const posts = await Post.find().populate("user", "name email profilePicture").sort({ createdAt: -1 });
      res.status(200).json({
        success: true,
        posts,
      });
    } catch (error) {
        return next(new ErrorHandler("Error getting posts",500));
    }
}