import express from "express";
import { createPost, getAllPosts, getPostById, searchPosts } from "../controllers/post.js";
import { auth } from "../middlewares/auth.js";
import { createPostLimiter } from '../middlewares/rateLimiter.js';
// import { protect } from '../middlewares/rateLimiter.js';


const router = express.Router();

// Create a new post
router.use(auth);
router.get("/posts",getAllPosts );
router.post("/posts", createPostLimiter, createPost ); 

// New search route
router.get("/search", searchPosts);
router.get("/search/:id", getPostById); 

export default router;
