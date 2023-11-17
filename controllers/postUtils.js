import mongoose from "mongoose";

import CommentModel from "../models/Comment.js";

// Создание поста
// + добавление в объект создателя (юзер или борд)
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
    await post.populate({
      path: "author",
      select: ["-passwordHash", "-createdPosts"],
      model: AuthorModel,
    });

    await createPostSession.commitTransaction();
    createPostSession.endSession();

    return {
      success: true,
      data: post,
    };
  } catch (error) {
    await createPostSession.abortTransaction();
    createPostSession.endSession();

    console.log(error);
    return {
      success: false,
      message: "Не удалось создать пост.",
    };
  }
};

// Удаление поста
// + удаление у его создателя (юзер или борд)
const removePost = async (postId, authorId, PostModel, AuthorModel) => {
  const deletePostSessoin = await mongoose.startSession();
  deletePostSessoin.startTransaction();

  try {
    const deletedPost = await PostModel.findById(postId);

    if (!deletedPost) {
      return {
        success: false,
        message: "Пост не найден.",
      };
    }

    // Проверка, что пост удаляет именно его автор / само сообщество
    if (deletedPost.author.toString() !== authorId) {
      return {
        success: false,
        message: "Только автор или сообщество может удалять посты.",
      };
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
    // const testUser = await AuthorModel.findById(10).session(deletePostSessoin);

    await deletePostSessoin.commitTransaction();
    deletePostSessoin.endSession();

    return {
      success: true,
      message: `Пост ${postId} удален.`,
    };
  } catch (error) {
    await deletePostSessoin.abortTransaction();
    deletePostSessoin.endSession();

    console.log(error);

    return {
      success: false,
      message: `Не удалось удалить пост ${postId}.`,
    };
  }
};

// Обновить пост
const updatePost = async (authorId, postId, data, PostModel) => {
  try {
    // Проверка, что именно автор пытается изменить свой пост
    // Сравниеваем id из токена и id автора поста
    const postForUpdate = await PostModel.findById(postId);

    if (!postForUpdate) {
      return {
        success: false,
        message: `Пост ${postId} не найден.`,
      };
    }

    // toString() иначе там будет new ObjectId("id автора")
    if (postForUpdate.author.toString() !== authorId) {
      return {
        success: false,
        message: "Только автор или сообщество может изменять посты.",
      };
    }

    await PostModel.findByIdAndUpdate(
      postId,
      {
        author: authorId,
        title: data.title,
        text: data.text,
        imageUrl: data.imageUrl,
        tags: data.tags,
      },
      {
        new: true,
      }
    );

    return {
      success: true,
      message: `Пост ${postId} изменен`,
    };
  } catch (error) {
    console.log(error);

    return {
      success: false,
      message: `Не удалось изменить пост ${postId}.`,
    };
  }
};

// Получить все посты
const getAllPosts = async (authorId, PostModel) => {
  try {
    const posts = await PostModel.find({
      author: authorId,
    }).sort({ createdAt: -1 });
    // .populate("author");

    if (posts.length < 1) {
      return {
        success: false,
        message: "Посты не найдены.11111",
      };
    }

    return {
      success: true,
      data: posts,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Не удалось получить посты.",
    };
  }
};

// Получить один пост
const getOnePost = async (authorId, postId, PostModel) => {
  try {
    const updatedPost = await PostModel.findOneAndUpdate(
      { _id: postId, author: authorId },
      { $inc: { viewCounter: 1 } },
      { new: true }
    );
    // .populate({
    //   path: "author",
    //   select: ["-passwordHash", "-createdPosts"],
    // })
    // .populate({
    //   path: "comments",
    //   populate: {
    //     path: "author",
    //     select: "-passwordHash", // Исключить поле с паролем
    //   },
    // });

    if (!updatedPost) {
      return {
        success: false,
        message: "Пост не найден",
      };
    }

    return {
      success: true,
      data: updatedPost,
    };
  } catch (error) {
    console.log(error);

    return {
      success: false,
      message: "Не удалось получить пост.",
    };
  }
};

export { createPost, removePost, updatePost, getAllPosts, getOnePost };
