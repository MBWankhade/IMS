import { OAuth2Client } from "google-auth-library";
import User from "../db/model.js";
import jwt from "jsonwebtoken";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateJWTToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email },
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

    // Generate JWT token
    const jwtToken = generateJWTToken(user);

    res.status(200).json({
      success: true,
      message: "Google login successful",
      user,
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


