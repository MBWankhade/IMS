import User from "../db/model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// 🔧 Cookie config helper
const setupCookieConfig = () => {
  const isProd = process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    secure: isProd, // Only send cookies over HTTPS in production
    sameSite: isProd ? "none" : "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  };
};

// 🔐 Login
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "Invalid Credentials." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect Password." });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, setupCookieConfig());

    const { password: _, ...safeUser } = user.toObject();

    return res.status(200).json({
      message: "Login success",
      user: safeUser,
      token,
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// 🚪 Logout
export const logout = (req, res) => {
  res.clearCookie("token", setupCookieConfig());
  res.json({ message: "Logout successful" });
};

// 🧍 Signup
export const signup = async (req, res) => {
  try {
    const { name, email, username, password, confirmPassword } = req.body;

    if (!name || !email || !username || !password || !confirmPassword) {
      return res.status(400).send({ message: "All fields are required." });
    }

    if (password !== confirmPassword) {
      return res.status(400).send({ message: "Passwords do not match." });
    }

    if (password.length < 8) {
      return res.status(400).send({ message: "Password must be at least 8 characters." });
    }

    if (await User.findOne({ username })) {
      return res.status(409).send({ message: "Username already exists." });
    }

    if (await User.findOne({ email })) {
      return res.status(409).send({ message: "Email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ name, email, username, password: hashedPassword });
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, setupCookieConfig());

    return res.status(201).send({
      message: "User registered successfully.",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
      },
    });
  } catch (error) {
    console.error("Signup Error:", error);
    return res.status(500).send({ message: "Internal server error." });
  }
};

// 👤 Get Profile
export const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).send({ message: "User not found" });
    return res.status(200).send(user);
  } catch (error) {
    console.error("Error getting user profile:", error);
    return res.status(500).send({ message: "Internal server error" });
  }
};

// 🧩 Complete Profile
export const completeProfile = async (req, res) => {
  try {
    const { college, branch, prn, batch } = req.body;

    const existing = await User.findOne({ prn });
    if (existing) {
      return res.status(409).json({ message: "PRN already exists." });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { college, branch, prn, batch },
      { new: true, runValidators: true }
    ).select("-password");

    res.status(200).json({ message: "Profile updated", user: updatedUser });
  } catch (error) {
    console.error("Error completing profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ✏️ Edit Profile
export const editProfile = async (req, res) => {
  try {
    const { name, username, email, profilePicture } = req.body;

    if (email) {
      const existingEmail = await User.findOne({ email, _id: { $ne: req.user.id } });
      if (existingEmail) {
        return res.status(409).json({ message: "Email already exists" });
      }
    }

    if (username) {
      const existingUsername = await User.findOne({ username, _id: { $ne: req.user.id } });
      if (existingUsername) {
        return res.status(409).json({ message: "Username already exists" });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { name, username, email, profilePicture },
      { new: true, runValidators: true }
    ).select("-password");

    res.status(200).json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Error editing profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
