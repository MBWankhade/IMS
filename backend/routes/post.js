import express from "express";
import { createPost, getAllPosts } from "../controllers/post.js";
import { auth } from "../middlewares/auth.js";


const router = express.Router();

// Create a new post
router.use(auth);
router.get("/posts",getAllPosts );
router.post("/posts",createPost );

export default router;
