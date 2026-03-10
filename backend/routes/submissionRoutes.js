const express = require('express');
const router = express.Router();
const submissionController = require('../controllers/submissionController');
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');

router.post('/', auth, role(['creator']), submissionController.createSubmission);
router.get('/creator', auth, role(['creator']), submissionController.getSubmissionsForCreator);
router.get('/brand', auth, role(['brand']), submissionController.getSubmissionsForBrand);
router.post('/:id/accept', auth, role(['brand']), submissionController.acceptSubmission);
router.post('/:id/reject', auth, role(['brand']), submissionController.rejectSubmission);

module.exports = router;
