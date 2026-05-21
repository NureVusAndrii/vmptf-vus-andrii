import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import sequelize from "./config/database.js";

import studentRoutes from "./routes/studentRoutes.js";
import teacherRoutes from "./routes/teacherRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import gradeRoutes from "./routes/gradeRoutes.js";
import classRoutes from "./routes/classRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/students", studentRoutes);
app.use("/api/teachers", teacherRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/grades", gradeRoutes);
app.use("/api/classes", classRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "University Management API працює"
  });
});

const startServer = async () => {
  try {
    await sequelize.authenticate();

    console.log("Підключення до MS SQL Server успішне");

    app.listen(process.env.PORT, () => {
      console.log(`Сервер запущено на порту ${process.env.PORT}`);
    });
  } catch (error) {
    console.error("Помилка підключення до бази даних:", error.message);
  }
};

startServer();