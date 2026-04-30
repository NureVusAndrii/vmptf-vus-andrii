const fs = require('fs');
const path = require('path');
const dbPath = path.join(__dirname, '../db.json');

const readDB = () => {
  if (!fs.existsSync(dbPath)) return [];
  return JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
};
const writeDB = (data) => fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));

exports.getAllTasks = (req, res) => {
  const tasks = readDB();
  const filtered = req.user.role === 'admin'
    ? tasks
    : tasks.filter(t => t.userId === req.user.id);
  res.json(filtered);
};

exports.createTask = (req, res) => {
  const { title, dueDate, assignedTo } = req.body;
  const tasks = readDB();

  const newTask = {
    id: Date.now(),
    title,
    completed: false,
    dueDate: dueDate || null,
    reminderSent: false,
    userId: (req.user.role === 'admin' && assignedTo) ? parseInt(assignedTo) : req.user.id
  };

  tasks.push(newTask);
  writeDB(tasks);
  res.status(201).json(newTask);
};

exports.updateTask = (req, res) => {
  let tasks = readDB();
  tasks = tasks.map(t => t.id == req.params.id ? { ...t, ...req.body } : t);
  writeDB(tasks);
  res.json({ message: "Updated Successfully" });
};

exports.deleteTask = (req, res) => {
  let tasks = readDB();
  tasks = tasks.filter(t => t.id != req.params.id);
  writeDB(tasks);
  res.json({ message: "Deleted Successfully" });
};

exports.getAnalytics = (req, res) => {
  const tasks = readDB();
  const userTasks = req.user.role === 'admin'
    ? tasks
    : tasks.filter(t => t.userId === req.user.id);

  const analytics = {
    total: userTasks.length,
    completed: userTasks.filter(t => t.completed).length,
    pending: userTasks.filter(t => !t.completed).length,
    overdue: userTasks.filter(t => !t.completed && t.dueDate && new Date(t.dueDate) < new Date()).length
  };

  res.json(analytics);
};