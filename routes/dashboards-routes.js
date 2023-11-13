import express from "express";
import * as DasboardController from "../controllers/dashboard-controller.js";

import checkAuth from "../utils/checkAuth.js";
import checkUserRole from "../utils/checkUserRole.js";

import {
  createDashboardValidation,
  handleValidationErrorsForDashboards,
} from "../validation/dashboard-validation.js";

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
  DasboardController.update
);

export default router;
