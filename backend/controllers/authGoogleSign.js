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

const handleGoogleAuth = async (token) => {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();
  return {
    email: payload.email,
    name: payload.name,
    picture: payload.picture,
    googleId: payload.sub
  };
};

const setupCookieConfig = () => {
  if (process.env?.NODE_ENV === "production") {
    return {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
      domain: "imsapp-4lhx.onrender.com",
    };
  }
  return {
    httpOnly: true,
    secure: false,
  };
};

export const googleLogin = async (req, res) => {
  const { token } = req.body;

  try {
    const { email, name, picture, googleId } = await handleGoogleAuth(token);
    let user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Account not found. Please sign up first.",
        needsSignup: true
      });
    }

    // Link Google account if user exists but hasn't linked yet
    if (!user.googleId) {
      user.googleId = googleId;
      await user.save();
    }

    const jwtToken = generateJWTToken(user);
    res.cookie("token", token, setupCookieConfig());

    res.status(200).json({
      success: true,
      message: "Google login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profilePicture: user.profilePicture,
      },
      token: jwtToken,
    });

  } catch (error) {
    console.error("Google login error:", error.message || error);
    res.status(400).json({
      success: false,
      message: "Invalid Google Token or authentication failed",
    });
  }
};

export const googleSignup = async (req, res) => {
  const { token } = req.body;

  try {
    const { email, name, picture, googleId } = await handleGoogleAuth(token);
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({
        success: false,
        message: "Account already exists. Please login instead.",
        needsLogin: true
      });
    }

    // Create new user
    user = new User({
      username: email, // Using email as username initially
      email,
      name,
      profilePicture: picture,
      googleId,
    });
    await user.save();

    const jwtToken = generateJWTToken(user);
    res.cookie("token", token, setupCookieConfig());

    res.status(200).json({
      success: true,
      message: "Google signup successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profilePicture: user.profilePicture,
      },
      token: jwtToken,
    });

  } catch (error) {
    console.error("Google signup error:", error.message || error);
    res.status(400).json({
      success: false,
      message: "Invalid Google Token or authentication failed",
    });
  }
};


