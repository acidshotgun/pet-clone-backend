import express from "express";
import * as UserController from "../controllers/user-controller.js";

const router = express.Router();

router.post("/register", UserController.register);

export default router;
