import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import cors from "cors";
import dotenv from "dotenv";
import connectdb from "./db/connectDb.js";
import cookieParser from "cookie-parser";
import auth from "./routes/auth.js";
import post from "./routes/post.js";
// import Post from "./models/post.js";
import Post from "./models/post.js";
import Comment from "./models/comment.js";
import mongoose from "mongoose";


dotenv.config();

const port = 3000;
const app = express();
const server = createServer(app);


// Allowed Origins
const allowedOrigins = [
  "https://imsapp-palx.onrender.com", 
  "https://im-sapp.vercel.app",
  "http://localhost:5173"
];

// Initialize Socket.IO with CORS
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,  // Allow credentials like cookies 
  },
});

// Middlewares
app.use(express.json({limit: "10mb"}));
app.use(express.urlencoded({limit: "10mb", extended: true }));
app.use(cookieParser());

// Database connection
connectdb();

// CORS middleware for Express
app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

// Handle preflight requests explicitly
app.options("*", cors());

// Routes
app.use("/api", auth);
app.use("/api", post);

//****************************************** */

// Backend route for handling reactions
app.post('/api/posts/:postId/react', auth, async (req, res) => {
  const { postId } = req.params;
  const { reactionType } = req.body;
  const userId = req.user.id; // Assuming auth middleware adds `user` to `req`

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
      // If the user already has a reaction, update it
      post.reactions[existingReactionIndex].type = reactionType;
    } else {
      // If the user doesn't have a reaction, add a new one
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
});

app.get('/api/posts/:postId/reactions', auth, async (req, res) => {
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
});




// Add a new comment
app.post('/api/posts/:postId/comments', async (req, res) => {
  try {
    const { user, content, parentComment } = req.body;
    const { postId } = req.params;

    console.log("Received payload:", { user, content, postId, parentComment }); // Debugging: Log the received payload

    // Validate user ID
    if (!mongoose.Types.ObjectId.isValid(user)) {
      console.error("Invalid user ID:", user); // Debugging: Log invalid user ID
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    // Validate post ID
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      console.error("Invalid post ID:", postId); // Debugging: Log invalid post ID
      return res.status(400).json({ error: 'Invalid post ID' });
    }

    // Ensure content is not empty
    if (!content || content.trim() === '') {
      console.error("Empty content:", content); // Debugging: Log empty content
      return res.status(400).json({ error: 'Comment content is required' });
    }

    const comment = new Comment({
      user: new mongoose.Types.ObjectId(user),
      post: new mongoose.Types.ObjectId(postId),
      content,
      parentComment: parentComment ? new mongoose.Types.ObjectId(parentComment) : null,
    });

    await comment.save();
    res.status(201).json(comment);
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Like a comment
app.post('/api/comments/:commentId/like', auth, async (req, res) => {
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
});

// Edit a comment
app.put('/api/comments/:commentId', auth, async (req, res) => {
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
});

// Delete a comment
// Your routes
app.delete("/api/comments/:commentId", async (req, res) => {
  try {
    const { commentId } = req.params;
    await Comment.findByIdAndDelete(commentId);
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get all comments for a post
app.get('/api/posts/:postId/comments', auth, async (req, res) => {
  try {
    const { postId } = req.params;

    // Validate post ID
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ error: 'Invalid post ID' });
    }

    const comments = await Comment.find({ post: postId })
      .populate('user', 'name email profilePicture'); // Only fetch necessary fields

    res.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Backend route to get parent comment count
app.get("/api/posts/:postId/parent-comments-count", async (req, res) => {
  try {
    const postId = req.params.postId;
    const count = await Comment.countDocuments({ post: postId, parentComment: null });
    res.json({ count });
  } catch (error) {
    console.error("Error fetching parent comment count:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


//********************************************************************** */

// Socket.io connection
io.on("connection", (socket) => {
  console.log(`User ${socket.id} connected`);

  socket.on("joinRoom", (room) => {
    socket.join(room);
    console.log(`User ${socket.id} joined room ${room}`);
  });

  socket.on("leaveRoom", (room) => {
    socket.leave(room);
    console.log(`User ${socket.id} left room ${room}`);
  });

  socket.on("message", ({ room, data }) => {
    io.to(room).emit("recieve-message", data);
  });

  socket.on("display-code", ({ room, data }) => {
    io.to(room).emit("recieve-code", data);
  });

  socket.on("input-change", ({ room, data }) => {
    io.to(room).emit("recieve-input", data);
  });

  socket.on("output-change", ({ room, data }) => {
    io.to(room).emit("recieve-output", data);
  });

  socket.on("change-language", ({ room, data }) => {
    io.to(room).emit("recieve-language", data);
  });

  socket.on("text-change", ({ room, data }) => {
    io.to(room).emit("recieve-text", data);
  });
});

// Default route
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Start the server
server.listen(port, "0.0.0.0", () => {
  console.log(`Server running on port ${port}`);
});
