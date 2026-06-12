const express = require('express');
const router = express.Router();
const User = require('../models/User');

// This is the route that will handle login requests
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "User not found" });
        if (user.password !== password) return res.status(400).json({ message: "Invalid credentials" });
        res.json({ message: "Login successful!" });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});
module.exports = router;