const Escrow = require('../models/Escrow');
const Dispute = require('../models/Dispute');

// Simulated escrow service with state transitions
exports.createEscrow = async ({ campaignId, creatorId, brandId, amount }) => {
  const escrow = await Escrow.create({ campaignId, creatorId, brandId, amount, status: 'ESCROW_LOCKED' });
  return escrow;
};

exports.releaseEscrow = async (escrowId) => {
  const escrow = await Escrow.findById(escrowId);
  if (!escrow) throw new Error('Escrow not found');
  if (escrow.status === 'ESCROW_RELEASED') return escrow;
  escrow.status = 'ESCROW_RELEASED';
  await escrow.save();
  // credit creator balance
  const User = require('../models/User');
  const creator = await User.findById(escrow.creatorId);
  if (creator) {
    creator.balance = (creator.balance || 0) + escrow.amount;
    await creator.save();
  }
  return escrow;
};

exports.refundEscrow = async (escrowId) => {
  const escrow = await Escrow.findById(escrowId);
  if (!escrow) throw new Error('Escrow not found');
  if (escrow.status === 'ESCROW_REFUNDED') return escrow;
  escrow.status = 'ESCROW_REFUNDED';
  await escrow.save();
  // credit brand balance (refund)
  const User = require('../models/User');
  const brand = await User.findById(escrow.brandId);
  if (brand) {
    brand.balance = (brand.balance || 0) + escrow.amount;
    await brand.save();
  }
  return escrow;
};

// Resolve dispute: mode = 'CREATOR' | 'UNRESOLVED'
exports.resolveDispute = async (disputeId, mode) => {
  const dispute = await Dispute.findById(disputeId).populate('escrowId');
  if (!dispute) throw new Error('Dispute not found');
  const escrow = dispute.escrowId;
  if (!escrow) throw new Error('Escrow for dispute not found');

  if (mode === 'CREATOR') {
    // release 100% to creator
    escrow.status = 'ESCROW_RELEASED';
    await escrow.save();
    const User = require('../models/User');
    const creator = await User.findById(escrow.creatorId);
    if (creator) { creator.balance = (creator.balance || 0) + escrow.amount; await creator.save(); }
    dispute.status = 'RESOLVED';
    dispute.resolution = 'CREATOR';
    await dispute.save();
    return { escrow, dispute };
  }

  if (mode === 'UNRESOLVED') {
    // split: creator 30%, brand refunded 70%
    const creatorShare = Math.round(escrow.amount * 0.3);
    const brandShare = escrow.amount - creatorShare;
    escrow.status = 'ESCROW_REFUNDED';
    await escrow.save();
    const User = require('../models/User');
    const creator = await User.findById(escrow.creatorId);
    const brand = await User.findById(escrow.brandId);
    if (creator) { creator.balance = (creator.balance || 0) + creatorShare; await creator.save(); }
    if (brand) { brand.balance = (brand.balance || 0) + brandShare; await brand.save(); }
    dispute.status = 'RESOLVED';
    dispute.resolution = 'UNRESOLVED';
    await dispute.save();
    return { escrow, dispute };
  }

  throw new Error('Unknown resolution mode');
};
