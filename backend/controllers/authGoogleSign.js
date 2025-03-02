import { OAuth2Client } from "google-auth-library";
import User from "../db/model.js";
import jwt from "jsonwebtoken";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateJWTToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, profilePicture: user.profilePicture },
    process.env.JWT_SECRET,
    { expiresIn: "7d" } // Set token expiry to 7 days
  );
};

export const googleLogin = async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({
      success: false,
      message: "Google token is required",
    });
  }

  try {
    // Verify Google token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture, sub: googleId } = payload;

    // Validate required fields
    if (!email || !name || !picture || !googleId) {
      return res.status(400).json({
        success: false,
        message: "Invalid Google token payload",
      });
    }

    // Find or create user
    let user = await User.findOne({ email });

    if (!user) {
      // Create a new user
      user = new User({
        username: email,
        email,
        name,
        profilePicture: picture,
        googleId,
      });
      await user.save();
    } else if (!user.googleId) {
      // Link Google account if user already exists
      user.googleId = googleId;
      await user.save();
    }

    // Generate JWT token
    const jwtToken = generateJWTToken(user);

    // Set cookie with JWT token
    res.cookie("token", jwtToken, {
      httpOnly: true, // Prevent client-side JavaScript from accessing the cookie
      secure: process.env.NODE_ENV === "production", // Ensure cookies are only sent over HTTPS in production
      sameSite: "strict", // Prevent CSRF attacks
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    });

    // Send response
    res.status(200).json({
      success: true,
      message: "Google login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profilePicture: user.profilePicture,
      },
      token: jwtToken, // Send token separately (optional)
    });
  } catch (error) {
    console.error("Google login error:", error.message || error);

    // Handle specific errors
    if (error.message.includes("Invalid token signature")) {
      return res.status(400).json({
        success: false,
        message: "Invalid Google token",
      });
    }

    if (error.name === "MongoError" && error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    // Handle other errors
    res.status(500).json({
      success: false,
      message: "Internal server error. Please try again later.",
    });
  }
};