const Escrow = require('../models/Escrow');

// Simulated escrow service: create escrow record and simulate funds locked
exports.createEscrow = async ({ campaignId, creatorId, brandId, amount }) => {
  // In real life, integrate with payment provider
  const escrow = await Escrow.create({ campaignId, creatorId, brandId, amount, status: 'locked' });
  // simulate ledger entry, notifications, etc.
  return escrow;
};

exports.releaseEscrow = async (escrowId) => {
  const escrow = await Escrow.findById(escrowId);
  if (!escrow) throw new Error('Escrow not found');
  if (escrow.status === 'released') return escrow;
  // simulate transfer to creator
  escrow.status = 'released';
  await escrow.save();
  return escrow;
};
