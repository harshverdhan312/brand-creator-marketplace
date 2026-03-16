const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const User = require('../models/User');
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');

const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: { message: 'Too many requests, please try again later' }
});

// Admin: list all users
router.get('/users', adminLimiter, auth, role(['admin']), async (req, res) => {
  const users = await User.find().select('name email role balance createdAt').sort({ createdAt: -1 });
  res.json(users);
});

module.exports = router;
