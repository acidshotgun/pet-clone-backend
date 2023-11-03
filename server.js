import express from "express";
import mongoose from "mongoose";
import "dotenv/config";

import userRouter from "./routes/user-routes.js";
import postRouter from "./routes/post-routes.js";

const app = express();

mongoose
  .connect(process.env.MONGO_URL)
  .then((res) => console.log("Connected to DataBase"))
  .catch((error) => console.log(error));

app.use(express.json());

// Обработка роутов
app.use(userRouter);
app.use(postRouter);

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
