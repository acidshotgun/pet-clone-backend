import mongoose from "mongoose";

import CommentsModel from "../models/Comments.js";
import PostModel from "../models/Post.js";
import UserModel from "../models/User.js";

const create = async (req, res) => {
  const createCommentSession = await mongoose.startSession();
  createCommentSession.startTransaction();

  try {
    const postId = req.params.id;

    const newComment = new CommentsModel({
      author: req.userId,
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      postId: postId,
    });

    const createdComment = await newComment.save({
      session: createCommentSession,
    });

    await PostModel.findByIdAndUpdate(
      postId,
      { $push: { comments: createdComment._id } },
      { new: true }
    ).session(createCommentSession);

    // Fake mistake
    // const testMistake = await UserModel.findById(10).session(
    //   createCommentSession
    // );

    await UserModel.findByIdAndUpdate(
      req.userId,
      { $push: { createdComments: createdComment._id } },
      { new: true }
    ).session(createCommentSession);

    await createCommentSession.commitTransaction();
    createCommentSession.endSession();

    res.json(createdComment);
  } catch (error) {
    await createCommentSession.abortTransaction();
    createCommentSession.endSession();

    console.log(error);
    res.status(400).json({
      message: "Не удалось создать комментарий.",
    });
  }
};

export { create };
