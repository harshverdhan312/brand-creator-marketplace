const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');

router.get('/brands', auth, usersController.listBrands);
router.get('/creators', auth, usersController.listCreators);
router.get('/search', auth, usersController.searchUsers);

// current user
router.get('/me/profile', auth, usersController.getMe);
router.put('/me/profile', auth, usersController.updateMe);

// public: get user by id (must be after named routes to avoid catching /search, /me, etc.)
router.get('/:id', usersController.getUserById);

module.exports = router;
