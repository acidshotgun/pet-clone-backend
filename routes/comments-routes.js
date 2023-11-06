import express from "express";
import * as CommentsController from "../controllers/comments-controller.js";
import checkAuth from "../utils/checkAuth.js";

const router = express.Router();

router.post("/posts/:id/comments", checkAuth, CommentsController.create);

export default router;
