import { Teacher, Course } from "../models/index.js";

export const getTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.findAll({
      include: [Course]
    });

    res.json(teachers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.create(req.body);
    res.status(201).json(teacher);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};