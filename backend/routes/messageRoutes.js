const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const messageController = require('../controllers/messageController');
const auth = require('../middleware/authMiddleware');

const messageLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 120,
  message: { message: 'Too many message requests, please try again later' }
});

router.post('/send', messageLimiter, auth, messageController.sendMessage);
router.get('/with/:userId', messageLimiter, auth, messageController.getOrCreateWithUser);
router.get('/:conversationId', messageLimiter, auth, messageController.getConversation);
router.get('/', messageLimiter, auth, messageController.listConversations);

module.exports = router;
