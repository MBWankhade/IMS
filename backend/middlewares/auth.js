import User from "../db/model.js";
import jwt from "jsonwebtoken";

export const auth = async (req, res, next) => {
    try {
        // Extract token from cookies or Authorization header
        const token = req.cookies.token || req.header("Authorization")?.replace("Bearer ", "");

        // Check if token exists
        if (!token) {
            return res.status(401).json({ message: "Please login to access this resource." });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find user by ID from the decoded token
        const user = await User.findById(decoded.id);

        // Check if user exists
        if (!user) {
            return res.status(401).json({ message: "User not found. Please login again." });
        }

        // Attach user to the request object
        req.user = user;

        // Proceed to the next middleware/route handler
        next();
    } catch (error) {
        // Handle specific JWT errors
        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({ message: "Invalid token. Please login again." });
        }
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Token expired. Please login again." });
        }

        // Handle database errors
        if (error.name === "CastError" || error.name === "TypeError") {
            return res.status(400).json({ message: "Invalid user ID. Please login again." });
        }

        // Handle other errors
        console.error("Authentication Error:", error);
        res.status(500).json({ message: "Internal server error. Please try again later." });
    }
};