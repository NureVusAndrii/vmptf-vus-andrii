import { Student, Grade, Course } from "../models/index.js";

export const getStudents = async (req, res) => {
  try {
    const students = await Student.findAll();
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getStudentById = async (req, res) => {
  try {
    const student = await Student.findByPk(req.params.id, {
      include: [
        {
          model: Grade,
          include: [Course]
        }
      ]
    });

    if (!student) {
      return res.status(404).json({ message: "Студента не знайдено" });
    }

    res.json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createStudent = async (req, res) => {
  try {
    const student = await Student.create(req.body);
    res.status(201).json(student);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateStudent = async (req, res) => {
  try {
    const student = await Student.findByPk(req.params.id);

    if (!student) {
      return res.status(404).json({ message: "Студента не знайдено" });
    }

    await student.update(req.body);
    res.json(student);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByPk(req.params.id);

    if (!student) {
      return res.status(404).json({ message: "Студента не знайдено" });
    }

    await student.destroy();

    res.json({ message: "Студента видалено" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};