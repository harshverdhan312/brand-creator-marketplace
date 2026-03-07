const express = require('express');
const router = express.Router();
const campaignController = require('../controllers/campaignController');
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');

router.post('/', auth, role(['brand']), campaignController.createCampaign);
router.get('/open', campaignController.listOpenCampaigns);
router.get('/brand', auth, role(['brand']), campaignController.getBrandCampaigns);
router.get('/:id', auth, campaignController.getCampaign);
// creator creates campaign for a brand
router.post('/for-brand', auth, role(['creator']), campaignController.createCampaign);
// brand reviews pending campaigns
router.get('/pending', auth, role(['brand']), campaignController.listPendingForBrand);
router.post('/:id/approve', auth, role(['brand']), campaignController.approveCampaign);
router.post('/:id/reject', auth, role(['brand']), campaignController.rejectCampaign);

module.exports = router;
