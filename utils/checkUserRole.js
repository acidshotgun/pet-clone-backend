import mongoose from "mongoose";
import DasboardModel from "../models/Dasboard.js";

// ОБНОВИТЬ
// ПУСТЬ ЛУЧШЕ МЫ БУДЕМ ДОСТОВАТЬ РОЛЬ ИЗ НАЙДЕННОГО
export default async (req, res, next) => {
  try {
    const userId = req.userId;
    const dashboardId = req.params.dashboard_id;

    const dashboard = await DasboardModel.findOne({
      _id: dashboardId,
      "admins.user": userId,
    });

    // ТУТ НАДО ЧУТЬ ПЕРЕПИСАТЬ ПОПРИЯТНЕЕ
    // Вшиваем в запрос роль пользователя
    // В контроллере ее достаем и исходя из роли даем доступ к работе с бордом
    if (dashboard) {
      const isAdmin = dashboard.admins.find(
        (item) => item.user.toString() === userId
      );

      if (isAdmin) {
        console.log(isAdmin);

        next();
      } else {
        console.log("Прав нет");
      }
    } else {
      res.status(403).json({
        message: "У вас нет прав на редактировние",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500);
  }
};
