const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');
const dbPath = path.join(__dirname, '../db.json');
const usersPath = path.join(__dirname, '../users.json');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'andrii.vus@nure.ua',
    pass: 'iqqs qqjh yiyd zxtu'
  }
});

const runTaskScheduler = () => {
  setInterval(async () => {
    try {
      if (!fs.existsSync(dbPath) || !fs.existsSync(usersPath)) return;

      const tasks = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
      const users = JSON.parse(fs.readFileSync(usersPath, 'utf-8'));
      const now = new Date();
      const tomorrow = new Date(now.getTime() + (24 * 60 * 60 * 1000));

      let modified = false;

      for (const task of tasks) {
        if (!task.completed && task.dueDate && !task.reminderSent) {
          const taskDate = new Date(task.dueDate);

          if (taskDate > now && taskDate < tomorrow) {
            const user = users.find(u => u.id === task.userId);

            if (user && user.email) {
              await transporter.sendMail({
                from: '"Task Manager" <andrii.vus@nure.ua>',
                to: user.email,
                subject: "Task Deadline Reminder",
                text: `Hello ${user.username}, the deadline for your task "${task.title}" is ${taskDate.toLocaleString()}.`
              });

              console.log(`Email sent to: ${user.email}`);
              task.reminderSent = true;
              modified = true;
            }
          }
        }
      }

      if (modified) fs.writeFileSync(dbPath, JSON.stringify(tasks, null, 2));
    } catch (error) {
      console.error("Scheduler error:", error.message);
    }
  }, 60000);
};

module.exports = runTaskScheduler;