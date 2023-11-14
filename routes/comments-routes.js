import express from "express";
import * as CommentController from "../controllers/comment-controller.js";
import checkAuth from "../utils/checkAuth.js";
import {
  createCommentValidation,
  handleValidationErrors,
} from "../utils/validation.js";

const router = express.Router();

// Создание
router.post(
  "/posts/:id/comments",
  checkAuth,
  createCommentValidation,
  handleValidationErrors,
  CommentController.create
);
// Редактирование
router.patch(
  "/comments/:comment_id",
  checkAuth,
  createCommentValidation,
  handleValidationErrors,
  CommentController.update
);
// Удаление
router.delete(
  "/posts/:post_id/comments/:comment_id",
  checkAuth,
  CommentController.remove
);

export default router;
