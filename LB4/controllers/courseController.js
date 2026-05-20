import sequelize from "../config/database.js";
import cache from "../utils/cache.js";
import { Course, Teacher, Grade, Class } from "../models/index.js";

export const getCourses = async (req, res) => {
  try {
    const cachedCourses = cache.get("courses");

    if (cachedCourses) {
      return res.json(cachedCourses);
    }

    const courses = await Course.findAll({
      include: [Teacher]
    });

    cache.set("courses", courses);

    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCourseById = async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id, {
      include: [Teacher, Class, Grade]
    });

    if (!course) {
      return res.status(404).json({ message: "Курс не знайдено" });
    }

    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createCourse = async (req, res) => {
  try {
    const course = await Course.create(req.body);

    cache.del("courses");

    res.status(201).json(course);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateCourse = async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id);

    if (!course) {
      return res.status(404).json({ message: "Курс не знайдено" });
    }

    await course.update(req.body);

    cache.del("courses");

    res.json(course);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteCourse = async (req, res) => {
  try {
    await sequelize.transaction(async (transaction) => {
      const course = await Course.findByPk(req.params.id, { transaction });

      if (!course) {
        throw new Error("Курс не знайдено");
      }

      await Grade.destroy({
        where: { course_id: req.params.id },
        transaction
      });

      await Class.destroy({
        where: { course_id: req.params.id },
        transaction
      });

      await course.destroy({ transaction });
    });

    cache.del("courses");
    cache.del("grades");

    res.json({
      message: "Курс і пов’язані заняття та оцінки видалено"
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};