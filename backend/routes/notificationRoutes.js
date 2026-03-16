const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const Notification = require('../models/Notification');
const auth = require('../middleware/authMiddleware');

const notifLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 60,
  message: { message: 'Too many requests, please try again later' }
});

// Get current user's notifications
router.get('/', notifLimiter, auth, async (req, res) => {
  const notes = await Notification.find({ userId: req.user._id }).sort({ createdAt: -1 }).limit(50);
  res.json(notes);
});

// Mark single notification as read
router.post('/:id/read', notifLimiter, auth, async (req, res) => {
  const note = await Notification.findById(req.params.id);
  if (!note) return res.status(404).json({ message: 'Notification not found' });
  if (String(note.userId) !== String(req.user._id)) return res.status(403).json({ message: 'Not allowed' });
  note.read = true;
  await note.save();
  res.json(note);
});

// Mark all notifications as read
router.post('/read-all', notifLimiter, auth, async (req, res) => {
  await Notification.updateMany({ userId: req.user._id, read: false }, { read: true });
  res.json({ message: 'All notifications marked as read' });
});

module.exports = router;
