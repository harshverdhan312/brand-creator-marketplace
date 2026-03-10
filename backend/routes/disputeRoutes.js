const express = require('express');
const router = express.Router();
const disputeController = require('../controllers/disputeController');
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');

router.post('/create', auth, disputeController.createDispute);
// admin resolves
router.post('/:disputeId/resolve', auth, role(['admin']), disputeController.resolveDispute);
// admin: list disputes
router.get('/', auth, role(['admin']), async (req, res) => {
	const Dispute = require('../models/Dispute');
	const disputes = await Dispute.find().populate('escrowId creatorId brandId');
	res.json(disputes);
});

module.exports = router;
