const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { connect } = require('./config/database');

const app = express();

// Middleware
app.use(express.json());
app.use(cors({ 
    origin: 'http://localhost:3000',
    credentials: true 
}));

// Database Connection
connect();

// Routes
// These routes match the files visible in your backend/routes directory
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/leaderboard', require('./routes/leaderboard'));
app.use('/api/scores', require('./routes/scoreRoutes'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
