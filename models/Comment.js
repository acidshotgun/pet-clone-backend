import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    imageUrl: String,
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Comment", CommentSchema);
