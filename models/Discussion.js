import mongoose from "mongoose";

const DiscussionSchema = mongoose.Schema(
  {
    title: {
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
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    boardId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Dashboard",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Discussion", DiscussionSchema);
