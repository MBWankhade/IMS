import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
        unique: true,
      },
      username: {
        type: String,
        unique: true, // Not required because Google users may not have usernames
        sparse: true, // Allows unique but optional field
      },
      password: {
        type: String, // Normal login users will have passwords
      },
      googleId: {
        type: String, // Google users will have this
        unique: true,
        sparse: true, // Allows unique but optional field
      },
      profilePicture: {
        type: String, // Stores Google profile picture
      },
});

const User = mongoose.model("User", userSchema);

export default User;