require('dotenv').config();

// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const roles = require('../config/roles');

const JWT_SECRET = process.env.JWT_SECRET;

const authenticateJWT = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(401).json({ message: 'Authentication token missing' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    req.userId = decoded.userId;
    req.userRole = decoded.userRole; // Include user's role in the request object
    next();
  });
};

const authorizeRole = (role) => {
  return (req, res, next) => {
    const userRole = req.userRole;
    if (!roles[userRole] || !roles[userRole].can.includes(role)) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    next();
  };
};

module.exports = {
  authenticateJWT,
  authorizeRole,
};
