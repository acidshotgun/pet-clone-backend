import express from "express";
import mongoose from "mongoose";
import "dotenv/config";

import userRouter from "./routes/user-routes.js";

const app = express();

mongoose
  .connect(process.env.MONGO_URL)
  .then((res) => console.log("Connected to DataBase"))
  .catch((error) => console.log(error));

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Это ответ от сервера",
  });
});

// Обработка роутов
app.use(userRouter);

app.listen(process.env.PORT, (error) => {
  error
    ? console.log(error)
    : console.log(`Server started at ${process.env.PORT} port`);
});
