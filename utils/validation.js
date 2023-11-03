import { body, validationResult } from "express-validator";
import UserModel from "../models/User.js";

// Регистрация
// В случае с паролем и email
// Делается запрос на поиск объекта в базе данных по ключу и значению
// Если есть совпадения значит такие данные уже есть === ошибка

// Пароль проверяется на длину + наличие буквы
export const registerValidation = [
  body("email")
    .isEmail()
    .withMessage("Неверный формат почты")
    .custom(async (value) => {
      const user = await UserModel.findOne({ email: value });

      if (user) {
        throw new Error("Email уже используется");
      }
    }),
  body("nickName")
    .isLength({ min: 4 })
    .withMessage("Nickname должен быть не менее 4 символов")
    .custom(async (value) => {
      const user = await UserModel.findOne({ nickName: value });

      if (user) {
        throw new Error("Nickname уже используется");
      }
    }),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Пароль должен содержать минимум 6 символов")
    .custom((value, { req }) => {
      if (!/[a-zA-Z]/.test(value)) {
        throw new Error("Пароль должен содержать букву");
      }

      return true;
    }),
  body("avatarUrl", "Неверная ссылка на аватарку").optional().isURL(),
];

// Валидация авторизации
export const loginValidation = [
  body("email", "Неверный формат почты").isEmail(),
  body("password", "Пароль должен быть от 6 символо").isLength({ min: 6 }),
];

// Валидация создания поста
export const createPostValidation = [
  body("title", "Необходим заголовок").isString(),
  body("text", "Необходим текст").isString(),
  body("imageUrl", "Неверная ссылка на изображение").optional().isURL(),
  body("tags", "Неверный формат тэгов").optional().isArray(),
];

export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json(errors.array());
  }

  next();
};
