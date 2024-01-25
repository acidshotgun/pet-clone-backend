import express from "express";
import mongoose from "mongoose";
import "dotenv/config";
import cors from "cors";

import userRouter from "./routes/user-routes.js";
import postRouter from "./routes/post-routes.js";
import commentsRouter from "./routes/comments-routes.js";
import dashboardRouter from "./routes/dashboards-routes.js";

const app = express();

mongoose
  .connect(process.env.MONGO_URL)
  .then((res) => console.log("Connected to DataBase"))
  .catch((error) => console.log(error));

app.use(express.json());
app.use(cors());

// Обработка роутов
app.use(userRouter);
app.use(postRouter);
app.use(commentsRouter);
app.use(dashboardRouter);

app.listen(process.env.PORT, (error) => {
  error
    ? console.log(error)
    : console.log(`Server started at ${process.env.PORT} port`);
});

app.use((err, req, res, next) => {
  res.status(500).json({
    message: "Произошла ошибка",
  });
});
