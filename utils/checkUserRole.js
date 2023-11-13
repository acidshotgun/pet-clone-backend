import mongoose from "mongoose";
import DasboardModel from "../models/Dasboard.js";

// ОБНОВИТЬ
// ПУСТЬ ЛУЧШЕ МЫ БУДЕМ ДОСТОВАТЬ РОЛЬ ИЗ НАЙДЕННОГО
export default async (req, res, next) => {
  const userId = req.userId;
  const dashboardId = req.params.dashboard_id;

  const dashboard = await DasboardModel.findOne({
    _id: dashboardId,
    "admins.user": userId,
  });

  if (dashboard) {
    try {
      const adminInfo = dashboard.admins.find(
        (item) => item.user.toString() === userId
      );

      if (adminInfo) {
        req.isAdmin = adminInfo.role;
        next();
      }
    } catch (error) {
      console.log(error);
      res.status(403).json({
        message: "Нет прав на удаление этого сообщества.",
      });
    }
  } else {
    res.status(403).json({
      message: "Нет прав на удаление этого сообщества.",
    });
  }
};
