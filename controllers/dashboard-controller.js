import mongoose from "mongoose";

import DasboardModel from "../models/Dasboard.js";
import UserModel from "../models/User.js";

// Создание борда
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
      { $push: { createdDashboards: createdDashboard._id } },
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

export { create, update };
