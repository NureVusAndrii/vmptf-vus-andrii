import cache from "../utils/cache.js";
import { Grade, Student, Course } from "../models/index.js";

export const getGrades = async (req, res) => {
  try {
    const cachedGrades = cache.get("grades");

    if (cachedGrades) {
      return res.json(cachedGrades);
    }

    const grades = await Grade.findAll({
      include: [Student, Course]
    });

    cache.set("grades", grades);

    res.json(grades);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createGrade = async (req, res) => {
  try {
    const grade = await Grade.create(req.body);

    cache.del("grades");

    res.status(201).json(grade);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateGrade = async (req, res) => {
  try {
    const grade = await Grade.findByPk(req.params.id);

    if (!grade) {
      return res.status(404).json({ message: "Оцінку не знайдено" });
    }

    await grade.update(req.body);

    cache.del("grades");

    res.json(grade);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteGrade = async (req, res) => {
  try {
    const grade = await Grade.findByPk(req.params.id);

    if (!grade) {
      return res.status(404).json({ message: "Оцінку не знайдено" });
    }

    await grade.destroy();

    cache.del("grades");

    res.json({ message: "Оцінку видалено" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};