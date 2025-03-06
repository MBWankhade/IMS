import { OAuth2Client } from "google-auth-library";
import User from "../db/model.js";
import jwt from "jsonwebtoken";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
let configurationForCookies;

const generateJWTToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, profilePicture:user.profilePicture },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
};

export const googleLogin = async (req, res) => {
  const { token } = req.body; 

  try {
    // Verify Google token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload(); 
    const { email, name, picture, sub: googleId } = payload;

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

    if (process.env?.NODE_ENV === "production") {
      configurationForCookies = {
        httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
        secure: true, // Allow cookies to be sent over HTTP (not just HTTPS)
        sameSite: "none", // Allows cookies to be sent with top-level navigations
        path: "/", // Makes the cookie accessible across all routes,
        domain: "imsapp-4lhx.onrender.com",
      };
    } else {
      configurationForCookies = {
        httpOnly: true,
        secure: false,
      }; 
    }

    // Generate JWT token
    const jwtToken = generateJWTToken(user);
    res.cookie("token", token, configurationForCookies);

    res.status(200).json({
      success: true,
      message: "Google login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profilePicture: user.profilePicture, 
      },
      token: jwtToken, // Send token separately
    });

  } catch (error) {
    console.error("Google login error:", error.message || error);
    res.status(400).json({
      success: false,
      message: "Invalid Google Token or authentication failed",
    });
  }
};


