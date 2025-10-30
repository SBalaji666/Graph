const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

const authMiddleware = async ({ req }) => {
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    return { user: null };
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return { user: decoded };
  } catch (error) {
    logger.warn('Invalid token:', error.message);
    return { user: null };
  }
};

module.exports = authMiddleware;