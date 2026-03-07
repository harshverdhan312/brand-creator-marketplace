const express = require('express');
const router = express.Router();
const escrowController = require('../controllers/escrowController');
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');

router.get('/brand', auth, role(['brand']), escrowController.getEscrowsForBrand);
router.get('/creator', auth, role(['creator']), escrowController.getEscrowsForCreator);
router.post('/:escrowId/submit', auth, role(['creator']), escrowController.submitWork);
router.post('/:escrowId/approve', auth, role(['brand']), escrowController.approveWork);
// working lists
router.get('/working/brands', auth, role(['creator']), escrowController.getWorkingBrandsForCreator);
router.get('/working/creators', auth, role(['brand']), escrowController.getWorkingCreatorsForBrand);

module.exports = router;
