import express from "express";
import * as DasboardController from "../controllers/dashboard/dashboard-service-controller.js";
import * as DasboardContentController from "../controllers/dashboard/dashboard-content-controller.js";

import checkAuth from "../utils/checkAuth.js";
import checkUserRole from "../utils/checkUserRole.js";

import {
  createDashboardValidation,
  handleValidationErrorsForDashboards,
} from "../validation/dashboard-validation.js";

import {
  createPostValidation,
  handleValidationErrors,
} from "../validation/validation.js";

const router = express.Router();

// Создание
router.post(
  "/dashboards",
  checkAuth,
  createDashboardValidation,
  handleValidationErrorsForDashboards,
  DasboardController.create
);
// Удаление
router.delete(
  "/dashboards/:dashboard_id",
  checkAuth,
  checkUserRole,
  DasboardController.remove
);
// Изменение
router.patch(
  "/dashboards/:dashboard_id",
  checkAuth,
  checkUserRole,
  createDashboardValidation,
  handleValidationErrorsForDashboards,
  DasboardController.update
);

// ПОлучить один борд
router.get("/dashboards/:dashboard_id", DasboardController.getOne);

// ПОлучить Все борды
router.get("/dashboards", DasboardController.getAll);
export default router;

////////////////  ТЕСТ ПОКА

router.post(
  "/dashboards/:dashboard_id/posts",
  checkAuth,
  checkUserRole,
  createPostValidation,
  handleValidationErrors,
  DasboardContentController.createDashboardPost
);

router.delete(
  "/dashboards/:dashboard_id/posts/:post_id",
  checkAuth,
  checkUserRole,
  DasboardContentController.removeDashboardPost
);
