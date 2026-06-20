const express = require('express');

const router = express.Router();

const {leaderBoard} = require('../controllers/leaderBoard');

const {auth} = require('../middleware/authMiddleware');

router.get('/leaderboard', auth, leaderBoard);

module.exports = router;