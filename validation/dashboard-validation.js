import { body, validationResult } from "express-validator";
import DasboardModel from "../models/Dasboard.js";

export const createDashboardValidation = [
  body("dashboardName")
    .isString()
    .withMessage("Необходимо указать имя борда.")
    .isLength({
      min: 1,
      max: 30,
    })
    .withMessage("Имя борда должно быть от 1 до 30 символов.")
    .custom(async (value) => {
      const dashboard = await DasboardModel.findOne({ dashboardName: value });

      if (dashboard) {
        throw new Error("Борд с таким названием уже существует.");
      }
    }),
  body("description")
    .isString()
    .withMessage("Необходимо описание для борда.")
    .isLength({
      min: 1,
      max: 200,
    })
    .withMessage("Описание может быть от 1 до 200 символов."),
  body("logoUrl", "Неверный формат изображения").optional().isURL(),
  body("backgroundUrl", "Неверный формат изображения").optional().isURL(),
];

export const handleValidationErrorsForDashboards = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json(errors.array());
  }

  next();
};
