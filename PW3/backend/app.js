const express = require('express');
const cors = require('cors');
const recipeRoutes = require('./routes/recipeRoutes');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/recipes', recipeRoutes);

app.listen(PORT, () => {
  console.log(`Application started and Listening on port ${PORT}`);
});