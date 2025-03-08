// backend/server.js
import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import cors from "cors";
import dotenv from "dotenv";
import connectdb from "./db/connectDb.js";
import cookieParser from "cookie-parser";
import auth from "./routes/auth.js";
import post from "./routes/post.js";
import likeComment from "./routes/likeandcomment.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const port = process.env.PORT || 3000;
const app = express();
const server = createServer(app);

// Allowed Origins
const allowedOrigins = [
  "https://imsapp-palx.onrender.com",
  "https://im-sapp.vercel.app",
  "http://localhost:5173",
];

// Initialize Socket.IO with CORS
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true, // Allow credentials like cookies
  },
});

// Middlewares
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
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
app.use("/api", likeComment);

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

  socket.on("resume-text", async ({ room, text }) => {
    try {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `Generate 5 technical questions based on the following resume:\n\n${text}`;
      const result = await model.generateContent(prompt);
      const questions = result.response.text();

      io.to(room).emit("generated-questions", questions);
    } catch (error) {
      console.error("Error generating questions:", error);
      socket.emit("error-generating-questions", "Failed to generate questions.");
    }
  });

  socket.on("disconnect", () => {
    console.log(`User ${socket.id} disconnected`);
  });
});

// Default route
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Google Generative AI (Move outside of the server start, and make async)
async function runGemini() {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = "Explain how AI works";
    const result = await model.generateContent(prompt);
    console.log(result.response.text());
  } catch (error) {
    console.error("Error running Gemini:", error);
  }
}

// Start the server
server.listen(port, "0.0.0.0", () => {
  console.log(`Server running on port ${port}`);
  runGemini(); // Run Gemini after the server starts
});