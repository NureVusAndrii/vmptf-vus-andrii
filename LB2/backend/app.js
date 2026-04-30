const express = require('express');
const cors = require('cors');
const runTaskScheduler = require('./services/scheduler');
const taskRoutes = require('./routes/taskRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/tasks', taskRoutes);
app.use('/api/auth', authRoutes);

// Scheduler
runTaskScheduler();

app.listen(PORT, () => {
  console.log(`Application started and Listening on port ${PORT}`);
});