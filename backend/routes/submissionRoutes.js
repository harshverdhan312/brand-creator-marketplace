const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const submissionController = require('../controllers/submissionController');
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');
const validateObjectId = require('../middleware/validateObjectId');

const submissionDecisionLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 60,
  message: { message: 'Too many submission decision requests, please try again later' }
});

router.post('/', auth, role(['creator']), submissionController.createSubmission);
router.get('/creator', auth, role(['creator']), submissionController.getSubmissionsForCreator);
router.get('/brand', auth, role(['brand']), submissionController.getSubmissionsForBrand);
router.post('/:id/accept', submissionDecisionLimiter, auth, role(['brand']), validateObjectId('id'), submissionController.acceptSubmission);
router.post('/:id/reject', submissionDecisionLimiter, auth, role(['brand']), validateObjectId('id'), submissionController.rejectSubmission);

module.exports = router;
