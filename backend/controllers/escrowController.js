const Escrow = require('../models/Escrow');
const Campaign = require('../models/Campaign');
const escrowService = require('../utils/escrowService');

exports.getEscrowsForBrand = async (req, res) => {
  const escrows = await Escrow.find({ brandId: req.user._id }).populate('campaignId creatorId');
  res.json(escrows);
};

exports.getEscrowsForCreator = async (req, res) => {
  const escrows = await Escrow.find({ creatorId: req.user._id }).populate('campaignId brandId');
  res.json(escrows);
};

// list distinct brands the creator is working for (active escrows)
exports.getWorkingBrandsForCreator = async (req, res) => {
  const escrows = await Escrow.find({ creatorId: req.user._id, status: { $in: ['locked','released'] } }).populate('brandId', 'name bio');
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
  const escrows = await Escrow.find({ brandId: req.user._id, status: { $in: ['locked','released'] } }).populate('creatorId', 'name bio');
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
  res.json(escrow);
};

exports.approveWork = async (req, res) => {
  const { escrowId } = req.params;
  const escrow = await Escrow.findById(escrowId);
  if (!escrow) return res.status(404).json({ message: 'Escrow not found' });
  if (String(escrow.brandId) !== String(req.user._id)) return res.status(403).json({ message: 'Not brand' });

  // release funds
  const released = await escrowService.releaseEscrow(escrowId);
  // mark campaign completed
  const campaign = await Campaign.findById(escrow.campaignId);
  campaign.status = 'completed';
  await campaign.save();

  res.json({ escrow: released, campaign });
};
