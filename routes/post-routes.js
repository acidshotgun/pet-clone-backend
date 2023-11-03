import express from "express";
import * as PostController from "../controllers/post-controller.js";
import {
  createPostValidation,
  handleValidationErrors,
} from "../utils/validation.js";
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

// Получить все посты
router.get("/posts", PostController.getAll);

// Получить один пост
router.get("/posts/:id", PostController.getOne);

export default router;
