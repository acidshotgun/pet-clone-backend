import mongoose from "mongoose";

import CommentModel from "../models/Comment.js";

// Создание
const createPost = async (authorId, data, PostModel, AuthorModel) => {
  const createPostSession = await mongoose.startSession();
  createPostSession.startTransaction();

  try {
    const newPost = new PostModel({
      author: authorId,
      title: data.title,
      text: data.text,
      imageUrl: data.imageUrl,
      tags: data.tags,
    });

    const post = await newPost.save({ session: createPostSession });

    await AuthorModel.findByIdAndUpdate(
      authorId,
      { $push: { createdPosts: post._id } },
      { new: true }
    ).session(createPostSession);

    // без этой строки при создании поста у борда
    // author === null
    await post.populate({ path: "author", model: AuthorModel });

    await createPostSession.commitTransaction();
    createPostSession.endSession();

    return post;
  } catch (error) {
    await createPostSession.abortTransaction();
    createPostSession.endSession();

    console.log(error);
    throw new Error("Не удалось создать пост.");
  }
};

// Удаление
const removePost = async (postId, authorId, PostModel, AuthorModel) => {
  const deletePostSessoin = await mongoose.startSession();
  deletePostSessoin.startTransaction();

  try {
    const deletedPost = await PostModel.findById(postId);

    if (!deletedPost) {
      throw new Error("Пост не найден.");
    }

    // Проверка, что пост удаляет именно его автор / само сообщество
    if (deletedPost.author.toString() !== authorId) {
      throw new Error("Только автор или сообщество может удалить пост.");
    }

    await PostModel.findByIdAndDelete(postId).session(deletePostSessoin);

    await AuthorModel.findByIdAndUpdate(
      authorId,
      { $pull: { createdPosts: postId } },
      { new: true }
    ).session(deletePostSessoin);

    // Удалить все комменты, у которых postId === postId (id поста)
    await CommentModel.deleteMany({ postId: postId }).session(
      deletePostSessoin
    );

    // fake error
    // const testUser = await UserModel.findById(10).session(deletePostSessoin);

    await deletePostSessoin.commitTransaction();
    deletePostSessoin.endSession();
  } catch (error) {
    await deletePostSessoin.abortTransaction();
    deletePostSessoin.endSession();

    console.log(error);
    throw new Error("Не удалось удалить пост.");
  }
};

export { createPost, removePost };
