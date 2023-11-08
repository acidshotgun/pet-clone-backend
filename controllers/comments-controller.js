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

    const postWithNewComment = await PostModel.findByIdAndUpdate(
      postId,
      { $push: { comments: createdComment._id } },
      { new: true }
    ).session(createCommentSession);

    if (!postWithNewComment) {
      return res.status(400).json({
        message: `Пост ${postId} не найден.`,
      });
    }

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

// Удаление комментария
//  Сам коммент, у юзера, у поста
const remove = async (req, res) => {
  const deleteCommentSession = await mongoose.startSession();
  deleteCommentSession.startTransaction();

  try {
    const postId = req.params.post_id;
    const commentId = req.params.comment_id;
    const authorId = req.userId;

    // Сначала проверяется наличие коммента
    //    (без сессии иначе она падает в случае ошибки)
    // Если ОК идем дальше
    const deletedComment = await CommentsModel.findById(commentId);

    // Проверка наличия коммента
    if (!deletedComment) {
      return res.status(400).json({
        message: `Комментарий ${commentId} не найден.`,
      });
    }

    const postWithDeletedComment = await PostModel.findByIdAndUpdate(
      postId,
      { $pull: { comments: commentId } },
      { new: true }
    ).session(deleteCommentSession);

    if (!postWithDeletedComment) {
      return res.status(400).json({
        message: `Пост ${postId} не найден.`,
      });
    }

    const commentAuthor = await UserModel.findByIdAndUpdate(
      authorId,
      { $pull: { createdComments: commentId } },
      { new: true }
    ).session(deleteCommentSession);

    if (!commentAuthor) {
      return res.status(400).json({
        message: `Пользователь ${authorId} не найден.`,
      });
    }

    // Удаление самого коммента
    await CommentsModel.findByIdAndDelete(commentId).session(
      deleteCommentSession
    );

    await deleteCommentSession.commitTransaction();
    deleteCommentSession.endSession();

    res.json({
      message: `Комментарий ${commentId} удален.`,
    });
  } catch (error) {
    await deleteCommentSession.abortTransaction();
    deleteCommentSession.endSession();

    console.log(error);
    res.status(400).json({
      message: "Не удалось удалить комментарий.",
    });
  }
};

const update = async (req, res) => {
  try {
    const commentId = req.params.comment_id;

    const updatedComment = await CommentsModel.findByIdAndUpdate(
      commentId,
      {
        text: req.body.text,
        imageUrl: req.body.imageUrl,
      },
      {
        new: true,
      }
    );

    if (!updatedComment) {
      return res.status(400).json({
        message: `Комментарий ${commentId} не найден.`,
      });
    }

    res.json(updatedComment);
  } catch (error) {
    console.log(error);

    res.status(400).json({
      message: "Не удалось отредактировать комментарий.",
    });
  }
};

export { create, remove, update };
