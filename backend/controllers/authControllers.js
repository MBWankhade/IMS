import User from "../db/model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const login = async (req, res) => {
    try {
      const { username, password } = req.body;
  
      // Check if user exists
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(401).json({ message: "Invalid Credentials" });
      }
  
      // Validate password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid Credentials" });
      }
  
      // Generate token
      const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: "7d" } // Token expires in 7 days
      );
  
      // Return user data along with token
      return res.status(200).json({
        message: "Login successful",
        user: {
          id: user._id,
          username: user.username,
          name: user.name,
          email: user.email,
        },
        token, // Send token in the response body
      });
    } catch (error) {
      console.error("Login Error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  export const logout = (req, res) => {
    res.status(200).json({ message: "Logout successful" });
  };

  export const signup = async (req, res) => {
    try {
      const { name, email, username, password, confirmPassword } = req.body;
  
      // Check if required fields are provided
      if (!name || !email || !username || !password || !confirmPassword) {
        return res.status(400).json({ message: "All fields are required" });
      }
  
      // Check if password and confirmPassword match
      if (password !== confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match" });
      }
  
      // Check if password is at least 8 characters long
      if (password.length < 8) {
        return res.status(400).json({ message: "Password must be at least 8 characters long" });
      }
  
      // Check if username already exists
      const existingUsername = await User.findOne({ username });
      if (existingUsername) {
        return res.status(409).json({ message: "Username already exists" });
      }
  
      // Check if email already exists
      const existingEmail = await User.findOne({ email });
      if (existingEmail) {
        return res.status(409).json({ message: "Email already exists" });
      }
  
      // Hash the password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
  
      // Create a new user
      const user = new User({
        name,
        email,
        username,
        password: hashedPassword,
      });
  
      // Save the user to the database
      await user.save();
  
      // Generate a JWT token
      const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: "7d" } // Token expires in 7 days
      );
  
      // Return success response with token
      return res.status(201).json({
        message: "User registered successfully",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          username: user.username,
        },
        token, // Send token in the response body
      });
    } catch (error) {
      console.error("Signup Error:", error);
  
      // Handle duplicate key errors
      if (error.code === 11000) {
        return res.status(409).json({ message: "Username or email already exists" });
      }
  
      // Handle other errors
      return res.status(500).json({ message: "Internal server error" });
    }
  };
  export const getMyProfile = async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select("-password");
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      return res.status(200).json(user);
    } catch (error) {
      console.error("Error getting user profile:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };