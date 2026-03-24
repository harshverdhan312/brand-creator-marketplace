const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const pitchController = require('../controllers/pitchController');
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');
const validateObjectId = require('../middleware/validateObjectId');

const pitchDecisionLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 60,
  message: { message: 'Too many pitch decision requests, please try again later' }
});

router.post('/', auth, role(['creator']), pitchController.createPitch);
// pitch directly to a brand
router.post('/to-brand', auth, role(['creator']), pitchController.createPitch);
// list all pitches relevant to the logged-in brand
router.get('/for-brand', auth, role(['brand']), pitchController.listPitchesForBrand);
router.post('/:id/accept', pitchDecisionLimiter, auth, role(['brand']), validateObjectId('id'), pitchController.acceptPitch);
router.post('/:id/reject', pitchDecisionLimiter, auth, role(['brand']), validateObjectId('id'), pitchController.rejectPitch);
router.get('/me', auth, pitchController.getMyPitches);

module.exports = router;
