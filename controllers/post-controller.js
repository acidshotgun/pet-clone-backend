import mongoose from "mongoose";
import PostModel from "../models/Post.js";
import UserModel from "../models/User.js";

// Создание поста
// + добавление поста юзеру в его БД
const create = async (req, res) => {
  const createPostSession = await mongoose.startSession();
  createPostSession.startTransaction();

  try {
    const newPost = new PostModel({
      author: req.userId,
      title: req.body.title,
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      tags: req.body.tags,
    });

    const post = await newPost.save({ session: createPostSession });

    await post.populate("author");

    await UserModel.findByIdAndUpdate(
      req.userId,
      { $push: { createdPosts: post._id } },
      { new: true }
    ).session(createPostSession);

    // fake error
    // const testUser = await UserModel.findById(10).session(createPostSession);

    await createPostSession.commitTransaction();
    createPostSession.endSession();

    res.json(post);
  } catch (error) {
    await createPostSession.abortTransaction();
    createPostSession.endSession();

    console.log(error);
    res.status(400).json({
      message: "Не удалось создать пост.",
    });
  }
};

// Получение всех постов
const getAll = async (req, res) => {
  try {
    const posts = await PostModel.find()
      .sort({ createdAt: -1 })
      .populate("author");

    res.json(posts);
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: "Не удалось получить посты",
    });
  }
};

// Получить один пост
// + обновить счетсчик просмотров
const getOne = async (req, res) => {
  try {
    const postId = req.params.id;

    const updatedPost = await PostModel.findByIdAndUpdate(
      { _id: postId },
      { $inc: { viewCounter: 1 } },
      { new: true }
    ).populate("author");

    if (!updatedPost) {
      return res.status(404).json({
        message: "Пост не найден",
      });
    }

    res.json(updatedPost);
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: "Не удалось получить посты",
    });
  }
};

export { create, getAll, getOne };
