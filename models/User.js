import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    nickName: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    avatarUrl: String,
    backgroundImageUrl: String,
    createdPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
    subscriptions: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    subscribers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    subscribedDashboards: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Dashboard" },
    ],
    createdDashboards: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Dashboard" },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", UserSchema);
