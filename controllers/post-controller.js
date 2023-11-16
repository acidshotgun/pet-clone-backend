import PostModel from "../models/Post.js";
import UserModel from "../models/User.js";
import CommentModel from "../models/Comment.js";

import {
  createPost,
  removePost,
  updatePost,
  getAllPosts,
  getOnePost,
} from "../utils/postUtils.js";

// Создание поста
const create = async (req, res) => {
  try {
    const authorId = req.userId; // req.params.dashboard_id
    const data = req.body;

    const post = await createPost(authorId, data, PostModel, UserModel);
    res.json(post);
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: "Не удалось создать пост.",
    });
  }
};

// Удаление поста
const remove = async (req, res) => {
  const authorId = req.userId;
  const postId = req.params.post_id;

  const result = await removePost(postId, authorId, PostModel, UserModel);

  if (result.success) {
    res.json({
      message: result.message,
    });
  } else {
    res.status(400).json({
      message: result.message,
    });
  }
};

// Изменение поста
const update = async (req, res) => {
  const authorId = req.userId;
  const postId = req.params.post_id;
  const data = req.body;

  const result = await updatePost(authorId, postId, data, PostModel);

  if (result.success) {
    res.json({
      message: result.message,
    });
  } else {
    res.status(400).json({
      message: result.message,
    });
  }
};

// Получить все
const getAll = async (req, res) => {
  const authorId = req.params.user_id;

  const result = await getAllPosts(authorId, PostModel);

  if (result.success) {
    res.json(result.data);
  } else {
    res.status(400).json({
      message: result.message,
    });
  }
};

// Получить один
const getOne = async (req, res) => {
  const postId = req.params.post_id;

  const result = await getOnePost(postId, PostModel);

  if (result.success) {
    res.json(result.data);
  } else {
    res.status(400).json({
      message: result.message,
    });
  }
};

// Создание поста
// + добавление поста юзеру в его БД
// const create = async (req, res) => {
//   const createPostSession = await mongoose.startSession();
//   createPostSession.startTransaction();

//   try {
//     const newPost = new PostModel({
//       author: req.userId,
//       title: req.body.title,
//       text: req.body.text,
//       imageUrl: req.body.imageUrl,
//       tags: req.body.tags,
//     });

//     const post = await newPost.save({ session: createPostSession });

//     await post.populate("author");

//     await UserModel.findByIdAndUpdate(
//       req.userId,
//       { $push: { createdPosts: post._id } },
//       { new: true }
//     ).session(createPostSession);

//     // fake error
//     // const testUser = await UserModel.findById(10).session(createPostSession);

//     await createPostSession.commitTransaction();
//     createPostSession.endSession();

//     res.json(post);
//   } catch (error) {
//     await createPostSession.abortTransaction();
//     createPostSession.endSession();

//     console.log(error);
//     res.status(400).json({
//       message: "Не удалось создать пост.",
//     });
//   }
// };

// Изменить пост + проверка на авторство
//    1) Запрос к БД, чтобы увидеть его автора и сравнить
//          автор поста === авторизированный юзер => ОК
//    2) Проверить наличие поста - не лишнее
//    3) Изменить пост
// const update = async (req, res) => {
//   try {
//     const postId = req.params.id;
//     const userId = req.userId;

//     // Проверка, что именно автор пытается изменить свой пост
//     // Сравниеваем id из токена и id автора поста
//     const postForUpdate = await PostModel.findById(postId);

//     if (!postForUpdate) {
//       return res.status(400).json({
//         message: `Пост ${postId} не найден.`,
//       });
//     }

//     // toString() иначе там будет new ObjectId("id автора")
//     if (postForUpdate.author.toString() !== userId) {
//       return res.status(400).json({
//         message: "Вы не можете изменить этот пост.",
//       });
//     }

//     await PostModel.findByIdAndUpdate(
//       postId,
//       {
//         author: req.userId,
//         title: req.body.title,
//         text: req.body.text,
//         imageUrl: req.body.imageUrl,
//         tags: req.body.tags,
//       },
//       {
//         new: true,
//       }
//     );

//     res.json({
//       message: `Пост ${postId} изменен`,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(400).json({
//       message: "Не удалось изменить пост",
//     });
//   }
// };

// Удаление поста + проверки
//    1) Существиует ли пост
//    2) Пост удаляет его автор или нет
//    3) Удаление поста
//    4) Обновление юзера (удалить этот пост из массива его постов)
// Это все под транзакциями

// const remove = async (req, res) => {
//   const deletePostSessoin = await mongoose.startSession();
//   deletePostSessoin.startTransaction();

//   try {
//     const postId = req.params.id;
//     const userId = req.userId;

//     const deletedPost = await PostModel.findById(postId);

//     if (!deletedPost) {
//       return res.status(400).json({
//         message: "Пост не найден.",
//       });
//     }

//     // Проверка, что пост удаляет именно его автор
//     if (deletedPost.author.toString() !== userId) {
//       return res.status(400).json({
//         message: "Вы не являетесь автором поста.",
//       });
//     }

//     await PostModel.findByIdAndDelete(postId).session(deletePostSessoin);

//     await UserModel.findByIdAndUpdate(
//       userId,
//       { $pull: { createdPosts: postId } },
//       { new: true }
//     ).session(deletePostSessoin);

//     // Удалить все комменты, у которых postId === postId (id поста)
//     await CommentModel.deleteMany({ postId: postId }).session(
//       deletePostSessoin
//     );

//     // fake error
//     // const testUser = await UserModel.findById(10).session(deletePostSessoin);

//     await deletePostSessoin.commitTransaction();
//     deletePostSessoin.endSession();

//     res.json({
//       message: "Пост удален",
//     });
//   } catch (error) {
//     await deletePostSessoin.abortTransaction();
//     deletePostSessoin.endSession();

//     console.log(error);
//     res.status(400).json({
//       message: "Не удалось удалить пост",
//     });
//   }
// };

// Получение всех постов
// const getAll = async (req, res) => {
//   try {
//     const posts = await PostModel.find()
//       .sort({ createdAt: -1 })
//       .populate("author");

//     res.json(posts);
//   } catch (error) {
//     console.log(error);
//     res.status(400).json({
//       message: "Не удалось получить посты",
//     });
//   }
// };

// Получить один пост
// + обновить счетсчик просмотров
// const getOne = async (req, res) => {
//   try {
//     const postId = req.params.id;

//     const updatedPost = await PostModel.findByIdAndUpdate(
//       { _id: postId },
//       { $inc: { viewCounter: 1 } },
//       { new: true }
//     )
//       .populate("author")
//       .populate({
//         path: "comments",
//         populate: {
//           path: "author",
//           select: "-passwordHash", // Исключить поле с паролем
//         },
//       });

//     if (!updatedPost) {
//       return res.status(404).json({
//         message: "Пост не найден",
//       });
//     }

//     res.json(updatedPost);
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({
//       message: "Не удалось получить посты",
//     });
//   }
// };

export { create, remove, update, getAll, getOne };
