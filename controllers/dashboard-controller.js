import mongoose from "mongoose";

import DasboardModel from "../models/Dasboard.js";
import UserModel from "../models/User.js";

// Создание борда
// При созздании так же:
//    1) автор = первый подписчик
//    2) автор = имеет созданный борд
const create = async (req, res) => {
  const createDashboardSession = await mongoose.startSession();
  createDashboardSession.startTransaction();

  try {
    const author = req.userId;

    const newDashboard = new DasboardModel({
      dashboardName: req.body.dashboardName,
      author: author,
      description: req.body.description,
      logoUrl: req.body.logoUrl,
      backgroundUrl: req.body.backgroundUrl,
      members: author,
      admins: [{ user: author, role: "admin", description: "Создатель" }],
    });

    const createdDashboard = await newDashboard.save({
      session: createDashboardSession,
    });

    await createdDashboard.populate("author");

    await UserModel.findByIdAndUpdate(
      author,
      {
        $push: {
          createdDashboards: createdDashboard._id,
          subscribedDashboards: createdDashboard._id,
        },
      },
      { new: true }
    );

    await createDashboardSession.commitTransaction();
    createDashboardSession.endSession();

    res.json(createdDashboard);
  } catch (error) {
    await createDashboardSession.abortTransaction();
    createDashboardSession.endSession();

    console.log(error);
    res.status(400).json({
      message: "Не удалось создать доску.",
    });
  }
};

// Удаление борда
//    1) Удаляет так же данные о посте у создателя (подписки / созданныеборды)

//  TODO:
//    1) Сообщество удалено === ststus deleted???
const remove = async (req, res) => {
  const deleteDashboardSession = await mongoose.startSession();
  deleteDashboardSession.startTransaction();

  try {
    const dashboard = req.params.dashboard_id;
    const isAdmin = req.isAdmin;
    const userId = req.userId;

    if (isAdmin !== "admin") {
      return res.status(400).json({
        message: "Нет прав на удаление борда",
      });
    }

    const deletedDashboard = await DasboardModel.findByIdAndDelete(
      dashboard
    ).session(deleteDashboardSession);

    await UserModel.findByIdAndUpdate(userId, {
      $pull: {
        createdDashboards: deletedDashboard._id,
        subscribedDashboards: deletedDashboard._id,
      },
    }).session(deleteDashboardSession);

    await deleteDashboardSession.commitTransaction();
    deleteDashboardSession.endSession();

    res.json({
      message: "Борд удален.",
    });
  } catch (error) {
    await deleteDashboardSession.abortTransaction();
    deleteDashboardSession.endSession();

    console.log(error);
    res.status(400).json({
      message: "Не удалось удалить борд.",
    });
  }
};

const update = async (req, res) => {
  try {
    const result = req.body;

    res.json(result);
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: "Не удалось изменить борд.",
    });
  }
};

export { create, update, remove };
