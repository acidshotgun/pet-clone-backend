import express from "express";
import * as UserController from "../controllers/user-controller.js";
import {
  registerValidation,
  loginValidation,
  handleValidationErrors,
} from "../validation/validation.js";
import checkAuth from "../utils/checkAuth.js";

const router = express.Router();

router.post(
  "/auth/register",
  registerValidation,
  handleValidationErrors,
  UserController.register
);

router.post(
  "/auth/login",
  loginValidation,
  handleValidationErrors,
  UserController.login
);

router.get("/auth/me", checkAuth, UserController.auth);

export default router;
