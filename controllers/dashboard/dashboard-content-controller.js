import PostModel from "../../models/Post.js";
import DasboardModel from "../../models/Dasboard.js";

import { createPost, removePost } from "../../utils/postUtils.js";

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
  try {
    const postId = req.params.post_id;
    const authorId = req.params.dashboard_id;

    const deletedPost = await removePost(
      postId,
      authorId,
      PostModel,
      DasboardModel
    );
    res.json({ message: `Пост ${postId} удален.` });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: "Не удалось удалить пост.",
    });
  }
};

export { createDashboardPost, removeDashboardPost };
