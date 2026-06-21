const express = require('express');

const router = express.Router();

const {addParagraph, getRandomParagraph} = require('../controllers/addParagraph');

router.post('/addPara', addParagraph);

router.get('/randomPara', getRandomParagraph);

module.exports = router;