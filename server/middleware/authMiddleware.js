const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

const protect = asyncHandler(async (req, res, next) => {
  let token;

  try {
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select('-password');
      return next(); // ✅ exit early if token is valid
    }
  } catch (error) {
    console.error("Token verification failed:", error.message);
    return res.status(401).json({ message: 'Not authorized, token failed' });
  }

  // If no token at all
  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
});

module.exports = { protect };
