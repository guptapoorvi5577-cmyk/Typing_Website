const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Helps frontend/backend talk to each other
require('dotenv').config();

const app = express();

// Middleware: Allows server to understand JSON and handle cross-origin requests
app.use(express.json());
app.use(cors());

// Routes
const authRoutes = require('./routes/authRoutes'); // Make sure this filename matches your file
app.use('/api/auth', authRoutes);
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/scores', require('./routes/scoreRoutes'));
// Server setup
const PORT = process.env.PORT || 5000;
// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected successfully!"))
  .catch((err) => console.log("Database connection failed:", err));
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
