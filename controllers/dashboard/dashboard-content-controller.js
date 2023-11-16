import PostModel from "../../models/Post.js";
import DasboardModel from "../../models/Dasboard.js";

import {
  createPost,
  removePost,
  updatePost,
  getAllPosts,
  getOnePost,
} from "../../utils/postUtils.js";

const createDashboardPost = async (req, res) => {
  try {
    const authorId = req.params.dashboard_id;
    const data = req.body;

    const post = await createPost(authorId, data, PostModel, DasboardModel);
    res.json(post);
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: "Не удалось создать пост.",
    });
  }
};

const removeDashboardPost = async (req, res) => {
  const postId = req.params.post_id;
  const authorId = req.params.dashboard_id;

  const result = await removePost(postId, authorId, PostModel, DasboardModel);

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

const updateDashboardPost = async (req, res) => {
  const authorId = req.params.dashboard_id;
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

const getAllDashboardPosts = async (req, res) => {
  const authorId = req.params.dashboard_id;

  const result = await getAllPosts(authorId, PostModel);

  if (result.success) {
    res.json(result.data);
  } else {
    res.status(400).json({
      message: result.message,
    });
  }
};

const getOneDashboardPost = async (req, res) => {
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

export {
  createDashboardPost,
  removeDashboardPost,
  updateDashboardPost,
  getAllDashboardPosts,
  getOneDashboardPost,
};
