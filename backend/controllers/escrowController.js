const Escrow = require('../models/Escrow');
const Pitch = require('../models/Pitch');
const Dispute = require('../models/Dispute');
const Notification = require('../models/Notification');
const escrowService = require('../utils/escrowService');

exports.getEscrowsForBrand = async (req, res) => {
  const escrows = await Escrow.find({ brandId: req.user._id }).populate('creatorId');
  res.json(escrows);
};

exports.getEscrowsForCreator = async (req, res) => {
  const escrows = await Escrow.find({ creatorId: req.user._id }).populate('brandId');
  res.json(escrows);
};

// list distinct brands the creator is working for (active escrows)
exports.getWorkingBrandsForCreator = async (req, res) => {
  const escrows = await Escrow.find({ creatorId: req.user._id, status: { $in: ['ESCROW_LOCKED','ESCROW_RELEASED'] } }).populate('brandId', 'name bio');
  const brands = [];
  const seen = new Set();
  escrows.forEach(e => {
    if (e.brandId && !seen.has(String(e.brandId._id))) {
      seen.add(String(e.brandId._id));
      brands.push(e.brandId);
    }
  });
  res.json(brands);
};

// list distinct creators a brand is working with
exports.getWorkingCreatorsForBrand = async (req, res) => {
  const escrows = await Escrow.find({ brandId: req.user._id, status: { $in: ['ESCROW_LOCKED','ESCROW_RELEASED'] } }).populate('creatorId', 'name bio');
  const creators = [];
  const seen = new Set();
  escrows.forEach(e => {
    if (e.creatorId && !seen.has(String(e.creatorId._id))) {
      seen.add(String(e.creatorId._id));
      creators.push(e.creatorId);
    }
  });
  res.json(creators);
};

exports.submitWork = async (req, res) => {
  const { escrowId } = req.params;
  const { workSubmissionLink } = req.body;
  const escrow = await Escrow.findById(escrowId);
  if (!escrow) return res.status(404).json({ message: 'Escrow not found' });
  if (String(escrow.creatorId) !== String(req.user._id)) return res.status(403).json({ message: 'Not creator' });
  escrow.workSubmissionLink = workSubmissionLink;
  await escrow.save();
  // update related pitch status if any
  const pitch = await Pitch.findOne({ creatorId: escrow.creatorId, brandId: escrow.brandId, priceAmount: escrow.amount, status: { $in: ['PITCH_ACCEPTED','WORK_IN_PROGRESS'] } });
  if (pitch) {
    pitch.status = 'WORK_SUBMITTED';
    await pitch.save();
    // notify brand
    await Notification.create({
      userId: escrow.brandId,
      type: 'WORK_SUBMITTED',
      payload: {
        pitchId: pitch._id,
        escrowId: escrow._id,
        referenceId: pitch._id,
        entityId: pitch._id,
        link: `/dashboard?pitchId=${pitch._id}`,
        message: 'New work has been submitted'
      }
    });
  }
  res.json({ escrow, pitch });
};

exports.approveWork = async (req, res) => {
  const { escrowId } = req.params;
  const escrow = await Escrow.findById(escrowId);
  if (!escrow) return res.status(404).json({ message: 'Escrow not found' });
  if (String(escrow.brandId) !== String(req.user._id)) return res.status(403).json({ message: 'Not brand' });

  // release funds
  const released = await escrowService.releaseEscrow(escrowId);
  // update pitch to approved/completed
  const pitch = await Pitch.findOne({ creatorId: escrow.creatorId, brandId: escrow.brandId, priceAmount: escrow.amount, status: { $in: ['WORK_SUBMITTED','APPROVAL_PENDING'] } });
  if (pitch) {
    pitch.status = 'COMPLETED';
    await pitch.save();
  }
  let campaign = null;
  await Notification.create({
    userId: escrow.creatorId,
    type: 'PAYMENT_RELEASED',
    payload: {
      escrowId: escrow._id,
      referenceId: escrow._id,
      entityId: escrow._id,
      link: '/dashboard',
      message: 'Payment was released'
    }
  });

  res.json({ escrow: released, campaign, pitch });
};

// brand rejects work -> create dispute
exports.rejectWork = async (req, res) => {
  const { escrowId } = req.params;
  const { reason } = req.body;
  const escrow = await Escrow.findById(escrowId);
  if (!escrow) return res.status(404).json({ message: 'Escrow not found' });
  if (String(escrow.brandId) !== String(req.user._id)) return res.status(403).json({ message: 'Not brand' });
  // mark related pitch as disputed
  const pitch = await Pitch.findOne({ creatorId: escrow.creatorId, brandId: escrow.brandId, priceAmount: escrow.amount, status: { $in: ['WORK_SUBMITTED','WORK_IN_PROGRESS','APPROVAL_PENDING'] } });
  if (pitch) {
    pitch.status = 'DISPUTED';
    await pitch.save();
  }
  const dispute = await Dispute.create({ escrowId: escrow._id, pitchId: pitch ? pitch._id : null, creatorId: escrow.creatorId, brandId: escrow.brandId, reason });
  await Notification.create({
    userId: escrow.creatorId,
    type: 'DISPUTE_OPENED',
    payload: {
      disputeId: dispute._id,
      referenceId: dispute._id,
      entityId: dispute._id,
      link: '/dashboard',
      message: 'A dispute was opened'
    }
  });
  res.json({ dispute });
};
