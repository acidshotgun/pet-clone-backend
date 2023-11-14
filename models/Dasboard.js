import mongoose from "mongoose";

const DashboardSchema = new mongoose.Schema(
  {
    dashboardName: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    logoUrl: String,
    backgroundUrl: String,
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    createdPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
    pinnedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
    admins: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        role: {
          type: String,
          enum: ["admin", "moderator", "readOnly"],
        },
        description: String,
      },
    ],
    status: {
      type: String,
      enum: ["active", "blocked", "deleted"],
      default: "active",
    },
    discussions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Discussion" }],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Dashboard", DashboardSchema);
