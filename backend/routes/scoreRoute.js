const express = require('express');

const router = express.Router();

const {test} = require('../controllers/test');
const {leaderBoard} = require('../controllers/leaderBoard');

const {auth} = require('../middleware/authMiddleware');

router.post('/saveTest', auth, test);

router.get('/leaderboard', auth, leaderBoard);

module.exports = router;