import jwt from "jsonwebtoken";

// Middleware - проверка авторизации
// Достает токен из req (передается с фронта)
// Если он есть в req.headers.authorization - расшифровываем
// Вшиваем в req userId и запрос идет дальше
export default (req, res, next) => {
  const token = (req.headers.authorization || "").replace(/Bearer\s?/, "");

  if (token) {
    try {
      const decoded = jwt.verify(token, "secret123");

      req.userId = decoded._id;

      next();
    } catch (error) {
      console.log(error);
      res.status(403).json({
        message: "Нет доступа. Необходима авторизация.",
      });
    }
  } else {
    res.status(403).json({
      message: "Нет доступа. Необходима авторизация.",
    });
  }
};
