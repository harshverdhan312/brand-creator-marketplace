const express = require('express');
const router = express.Router();
const pitchController = require('../controllers/pitchController');
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');

router.post('/', auth, role(['creator']), pitchController.createPitch);
// pitch directly to a brand
router.post('/to-brand', auth, role(['creator']), pitchController.createPitch);
router.get('/campaign/:campaignId', auth, pitchController.listPitchesForCampaign);
// list all pitches relevant to the logged-in brand
router.get('/for-brand', auth, role(['brand']), pitchController.listPitchesForBrand);
router.post('/:id/accept', auth, role(['brand']), pitchController.acceptPitch);
router.post('/:id/reject', auth, role(['brand']), pitchController.rejectPitch);
router.get('/me', auth, pitchController.getMyPitches);

module.exports = router;
