import express from "express";
import * as CommentsController from "../controllers/comments-controller.js";
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
  CommentsController.create
);
// Редактирование
router.patch(
  "/comments/:comment_id",
  checkAuth,
  createCommentValidation,
  handleValidationErrors,
  CommentsController.update
);
// Удаление
router.delete(
  "/posts/:post_id/comments/:comment_id",
  checkAuth,
  CommentsController.remove
);

export default router;
