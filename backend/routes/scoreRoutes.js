const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware'); // Import the bouncer

// This route is now PROTECTED. Only users with a valid token can reach this.
router.post('/save-score', authMiddleware, async (req, res) => {
    // Only reachable if the token is valid!
    res.json({ message: "Score saved successfully!" });
});

module.exports = router;