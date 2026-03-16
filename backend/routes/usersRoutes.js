const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const usersController = require('../controllers/usersController');
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');

const searchLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // 30 requests per minute
  message: { message: 'Too many search requests, please try again later' }
});

router.get('/brands', auth, usersController.listBrands);
router.get('/creators', auth, usersController.listCreators);
router.get('/search', auth, searchLimiter, usersController.searchUsers);

// current user
router.get('/me/profile', auth, usersController.getMe);
router.put('/me/profile', auth, usersController.updateMe);

// public: get user by id (must be after named routes to avoid catching /search, /me, etc.)
router.get('/:id', usersController.getUserById);

module.exports = router;
