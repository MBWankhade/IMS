import express from "express";
import {
  addComment,
  likeComment,
  editComment,
  deleteComment,
  getComments,
} from "../controllers/commentscontroller.js";
import { auth } from "../middlewares/auth.js";

const router = express.Router();

// ✅ Middleware: Require authentication for all comment-related routes
router.use(auth);

// ✅ Add a new comment (supports replies)
router.post("/posts/:postId/comments", addComment);

// ✅ Like a comment
router.post("/comments/:commentId/like", likeComment);

// ✅ Edit a comment
router.put("/comments/:commentId", editComment);

// ✅ Delete a comment
router.delete("/comments/:commentId", deleteComment);

// ✅ Get all comments for a post (including replies)
router.get("/posts/:postId/comments", getComments);

export default router;
