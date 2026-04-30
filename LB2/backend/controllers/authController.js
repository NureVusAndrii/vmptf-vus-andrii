const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const usersPath = path.join(__dirname, '../users.json');
const SECRET_KEY = "xmyLMtQar2yCDvB1jGIOZjkaCgiL9nQKCdFcCzinhhS";

const getUsers = () => JSON.parse(fs.readFileSync(usersPath, 'utf-8'));
const saveUsers = (users) => fs.writeFileSync(usersPath, JSON.stringify(users, null, 2));

exports.register = (req, res) => {
  const { username, password, email } = req.body;
  const users = getUsers();

  if (!username || !password || !email) {
    return res.status(400).json({ message: "All fields (username, password, email) are required" });
  }

  if (users.find(u => u.username === username)) {
    return res.status(400).json({ message: "User already exists" });
  }

  const newUser = {
    id: Date.now(),
    username,
    email,
    password: bcrypt.hashSync(password, 8),
    role: users.length === 0 ? 'admin' : 'user'
  };

  users.push(newUser);
  saveUsers(users);
  res.status(201).json({ message: "Registered successfully" });
};

exports.login = (req, res) => {
  const { username, password } = req.body;
  const user = getUsers().find(u => u.username === username);

  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign({ id: user.id, role: user.role, username: user.username }, SECRET_KEY, { expiresIn: '1h' });
  res.json({ token, role: user.role, username: user.username });
};

exports.getAllUsers = (req, res) => {
  const users = getUsers().map(u => ({ id: u.id, username: u.username }));
  res.json(users);
};