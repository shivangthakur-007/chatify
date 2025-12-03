import mongoose, { Schema } from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minLength: [6,'password at least 6 characters long'],
    },
    profilePic: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
); // created At & updated

const User = mongoose.model("User", userSchema);

export default User;
