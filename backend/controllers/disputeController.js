const Dispute = require('../models/Dispute');
const DisputeModel = Dispute;
const escrowService = require('../utils/escrowService');
const Notification = require('../models/Notification');

exports.createDispute = async (req, res) => {
  const { escrowId, pitchId, reason } = req.body;
  const escrow = require('../models/Escrow');
  const e = await escrow.findById(escrowId);
  if (!e) return res.status(404).json({ message: 'Escrow not found' });
  // only creator or brand can open dispute
  if (String(e.creatorId) !== String(req.user._id) && String(e.brandId) !== String(req.user._id)) return res.status(403).json({ message: 'Not allowed' });
  const dispute = await Dispute.create({ escrowId, pitchId, creatorId: e.creatorId, brandId: e.brandId, reason });
  await Notification.create({
    userId: e.creatorId,
    type: 'DISPUTE_OPENED',
    payload: {
      disputeId: dispute._id,
      referenceId: dispute._id,
      link: '/dashboard',
      message: 'A dispute was opened'
    }
  });
  await Notification.create({
    userId: e.brandId,
    type: 'DISPUTE_OPENED',
    payload: {
      disputeId: dispute._id,
      referenceId: dispute._id,
      link: '/dashboard',
      message: 'A dispute was opened'
    }
  });
  res.json(dispute);
};

// Admin resolves dispute
exports.resolveDispute = async (req, res) => {
  const { disputeId } = req.params;
  const { resolution } = req.body; // CREATOR or UNRESOLVED
  const dispute = await Dispute.findById(disputeId).populate('escrowId');
  if (!dispute) return res.status(404).json({ message: 'Dispute not found' });
  // only admin allowed (should be enforced by middleware)
  try {
    const { escrow, dispute: resolved } = await escrowService.resolveDispute(disputeId, resolution);
    await Notification.create({
      userId: resolved.creatorId,
      type: 'DISPUTE_RESOLVED',
      payload: {
        disputeId: resolved._id,
        resolution: resolved.resolution,
        referenceId: resolved._id,
        link: '/dashboard',
        message: 'A dispute was resolved'
      }
    });
    await Notification.create({
      userId: resolved.brandId,
      type: 'DISPUTE_RESOLVED',
      payload: {
        disputeId: resolved._id,
        resolution: resolved.resolution,
        referenceId: resolved._id,
        link: '/dashboard',
        message: 'A dispute was resolved'
      }
    });
    res.json({ escrow, dispute: resolved });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
