import express from "express";
import * as DasboardController from "../controllers/dashboard-controller.js";
import checkAuth from "../utils/checkAuth.js";
import checkUserRole from "../utils/checkUserRole.js";

const router = express.Router();

// Создание
router.post("/dashboards", checkAuth, DasboardController.create);
router.patch(
  "/dashboards/:dashboard_id",
  checkAuth,
  checkUserRole,
  DasboardController.update
);

export default router;
