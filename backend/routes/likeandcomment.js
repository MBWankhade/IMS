import express from "express";
import {
  reactToPost,
  getPostReactions,
  addComment,
  likeComment,
  editComment,
  deleteComment,
  getPostComments,
  getParentCommentCount,
} from "../controllers/likeandcomment.js";
import { auth } from "../middlewares/auth.js";

const router = express.Router();

// Reactions
router.post("/posts/:postId/react", auth, reactToPost);
router.get("/posts/:postId/reactions", auth, getPostReactions);

// Comments
router.post("/posts/:postId/comments", auth, addComment);
router.post("/comments/:commentId/like", auth, likeComment);
router.put("/comments/:commentId", auth, editComment);
router.delete("/comments/:commentId", auth, deleteComment);
router.get("/posts/:postId/comments", auth, getPostComments);
router.get("/posts/:postId/parent-comments-count", auth, getParentCommentCount);

export default router;