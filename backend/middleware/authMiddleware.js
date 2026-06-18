// backend/middleware/authMiddleware.js

import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {

  // Step 1 — Check if Authorization header exists and starts with "Bearer "
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  // Step 2 — Extract the token (remove "Bearer " prefix)
  const token = authHeader.split(' ')[1];

  // Step 3 — Verify the token using your JWT secret
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Step 4 — Attach user info to the request object
    // Now any route using this middleware can access req.user
    req.user = decoded; // contains { id, username, email }

    next(); // move to the actual route handler

  } catch (err) {

    // Token is expired or tampered with
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired. Please log in again.' });
    }

    return res.status(401).json({ error: 'Invalid token.' });
  }
};

export default authMiddleware;