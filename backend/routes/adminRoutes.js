const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');

// Admin: list all users
router.get('/users', auth, role(['admin']), async (req, res) => {
  const users = await User.find().select('name email role balance createdAt').sort({ createdAt: -1 });
  res.json(users);
});

module.exports = router;
