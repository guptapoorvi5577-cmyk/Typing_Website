const express = require('express');
const router = express.Router();

const { test } = require('../controllers/test');
const { getLatestScore } = require('../controllers/getTestScore');
const { leaderBoard } = require('../controllers/leaderBoard');
const { auth } = require('../middleware/authMiddleware');
const { getProfileStats } = require('../controllers/getProfileStats');

router.post('/saveTest', auth, test);
router.get('/latest', auth, getLatestScore);
router.get('/leaderboard', auth, leaderBoard);
router.get('/stats', auth, getProfileStats);

module.exports = router;
