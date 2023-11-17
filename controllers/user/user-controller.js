import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import UserModel from "../../models/User.js";

// Регистрация
const register = async (req, res) => {
  try {
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const passHash = await bcrypt.hash(password, salt);

    const newUser = new UserModel({
      nickName: req.body.nickName,
      passwordHash: passHash,
      email: req.body.email,
      avatarUrl: req.body.avatarUrl,
    });

    const user = await newUser.save();

    const token = jwt.sign(
      {
        _id: user._id,
      },
      "secret123",
      {
        expiresIn: "30d",
      }
    );

    const { passwordHash, ...userData } = user._doc;

    res.json({ ...userData, token });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Не удалось зарегистрироваться",
    });
  }
};

// Логгирование (заходит когда)
const login = async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email }).populate(
      "createdDashboards"
    );

    if (!user) {
      return res.status(400).json({
        message: "Неверный логин или пароль",
      });
    }

    const isValidPass = await bcrypt.compare(
      req.body.password,
      user._doc.passwordHash
    );

    if (!isValidPass) {
      return res.status(400).json({
        message: "Неверный логин или пароль",
      });
    }

    const token = jwt.sign(
      {
        _id: user._id,
      },
      "secret123",
      {
        expiresIn: "30d",
      }
    );

    const { passwordHash, ...userData } = user._doc;

    res.json({ ...userData, token });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Не удалось авторизироваться",
    });
  }
};

// Проверка на авторизацию
// checkAuth вшивает в req = userId с токеном (из local storage), который приходит в запросе
// По этому userId ищем изера в БД
// Если он есть то юзер авторизован в данный момент в приложении
// И в ответе будут возвращены его данные, который будут записываться в стейт
const auth = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId);

    if (!user) {
      res.status(404).json({
        message: "Пользователь не найден",
      });
    }

    console.log(user._doc);

    const { passwordHash, ...userData } = user._doc;

    res.json({ ...userData });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Нет доступа",
    });
  }
};

export { register, login, auth };
