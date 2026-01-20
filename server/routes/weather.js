const express = require('express');
const router = express.Router();
const weatherController = require('../controllers/weatherController');
const auth = require('../middleware/auth');

// Optional auth for weather search (save history if logged in)
// We need a middleware that checks token but doesn't error if missing?
// For now, let's make search public but only save history if we handle the optional auth manually or helper.
// Actually, 'auth' middleware errors if no token. Let's make a middleware 'optionalAuth'.

const optionalAuth = (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) return next();

  try {
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    req.user = decoded.user;
    next();
  } catch (err) {
    // Invalid token? Just ignore user and proceed as guest
    next();
  }
};

router.get('/weather', optionalAuth, weatherController.getWeather);

// Strict auth for history
router.get('/history', auth, weatherController.getHistory);

module.exports = router;
