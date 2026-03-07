const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');

router.get('/brands', auth, usersController.listBrands);
router.get('/creators', auth, usersController.listCreators);

// public: get user by id
router.get('/:id', usersController.getUserById);

// current user
router.get('/me/profile', auth, usersController.getMe);
router.put('/me/profile', auth, usersController.updateMe);

module.exports = router;
