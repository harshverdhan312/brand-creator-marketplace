const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const Notification = require('../models/Notification');
const auth = require('../middleware/authMiddleware');
const validateObjectId = require('../middleware/validateObjectId');

const fallbackLinkByType = (note) => {
  const payload = note.payload || {};
  if (payload.link) return payload.link;
  if (note.type === 'NEW_MESSAGE' && payload.from) return `/messages?userId=${payload.from}`;
  if (note.type === 'PITCH_REJECTED') return '/pitches';
  if ((note.type === 'NEW_PITCH' || note.type === 'PITCH_ACCEPTED') && payload.pitchId) return `/pitches/${payload.pitchId}`;
  if (note.type === 'WORK_SUBMITTED') {
    if (payload.submissionId || payload.pitchId) return `/dashboard?submissionId=${payload.submissionId || ''}&pitchId=${payload.pitchId || ''}`;
    return '/dashboard';
  }
  return '/dashboard';
};

const toNotificationDTO = (note) => {
  const payload = note.payload || {};
  return {
    ...note.toObject(),
    type: note.type,
    entityId: payload.entityId || payload.referenceId || payload.pitchId || payload.submissionId || payload.conversationId || null,
    link: fallbackLinkByType(note),
    payload
  };
};

const notifLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 60,
  message: { message: 'Too many requests, please try again later' }
});

// Get current user's notifications
router.get('/', notifLimiter, auth, async (req, res) => {
  const notes = await Notification.find({ userId: req.user._id }).sort({ createdAt: -1 }).limit(50);
  res.json(notes.map(toNotificationDTO));
});

// Mark single notification as read
router.post('/:id/read', notifLimiter, auth, validateObjectId('id'), async (req, res) => {
  const note = await Notification.findById(req.params.id);
  if (!note) return res.status(404).json({ message: 'Notification not found' });
  if (String(note.userId) !== String(req.user._id)) return res.status(403).json({ message: 'Not allowed' });
  note.read = true;
  await note.save();
  res.json(toNotificationDTO(note));
});

// Mark all notifications as read
router.post('/read-all', notifLimiter, auth, async (req, res) => {
  await Notification.updateMany({ userId: req.user._id, read: false }, { read: true });
  res.json({ message: 'All notifications marked as read' });
});

module.exports = router;
