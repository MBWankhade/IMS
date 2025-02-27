import { OAuth2Client } from "google-auth-library";
import User from "../db/model.js";
import jwt from "jsonwebtoken";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

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

    // Generate JWT token
    const jwtToken = generateJWTToken(user);
    res.cookie("token", jwtToken, {
      httpOnly: true, // Prevent client-side JavaScript from accessing the cookie
      // secure: process.env.NODE_ENV === "production", // Ensure cookies are only sent over HTTPS in production
      maxAge: 3600000, // 1 hour in milliseconds
    });

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


