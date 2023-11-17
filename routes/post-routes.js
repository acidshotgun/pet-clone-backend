import express from "express";
import * as PostController from "../controllers/user/user-post-controller.js";
import {
  createPostValidation,
  handleValidationErrors,
} from "../validation/validation.js";
import checkAuth from "../utils/checkAuth.js";

const router = express.Router();

// Создать пост
router.post(
  "/posts",
  checkAuth,
  createPostValidation,
  handleValidationErrors,
  PostController.create
);

// Удалить пост
router.delete("/posts/:post_id", checkAuth, PostController.remove);

// Обновить пост
router.patch(
  "/posts/:post_id",
  checkAuth,
  createPostValidation,
  handleValidationErrors,
  PostController.update
);

// Получить все посты одного юзера
router.get("/posts/:user_id", PostController.getAll);

// Получить один пост
router.get("/user/:user_id/posts/:post_id", PostController.getOne);

export default router;
