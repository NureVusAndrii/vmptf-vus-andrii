import { Class } from "../models/index.js";

export const createClass = async (req, res) => {
  try {
    const newClass = await Class.create(req.body);

    res.status(201).json(newClass);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteClass = async (req, res) => {
  try {
    const classItem = await Class.findByPk(req.params.id);

    if (!classItem) {
      return res.status(404).json({ message: "Заняття не знайдено" });
    }

    await classItem.destroy();

    res.json({ message: "Заняття видалено" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};