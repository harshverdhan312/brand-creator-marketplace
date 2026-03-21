const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const auth = require('../middleware/authMiddleware');

router.post('/send', auth, messageController.sendMessage);
router.get('/with/:userId', auth, messageController.getOrCreateWithUser);
router.get('/:conversationId', auth, messageController.getConversation);
router.get('/', auth, messageController.listConversations);

module.exports = router;
