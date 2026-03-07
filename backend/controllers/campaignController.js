const Campaign = require('../models/Campaign');
const Pitch = require('../models/Pitch');

exports.createCampaign = async (req, res) => {
  const { title, description, budget, category, deadline, brandId } = req.body;
  // If a creator is creating a campaign for a brand, mark as 'pending'
  if (brandId && req.user.role === 'creator') {
    const campaign = await Campaign.create({
      title,
      description,
      budget,
      category,
      deadline,
      brand: brandId,
      status: 'pending',
      requestedBy: req.user._id
    });
    return res.status(201).json(campaign);
  }

  // default: brand creates campaign (brand must be owner)
  const campaign = await Campaign.create({
    title,
    description,
    budget,
    category,
    deadline,
    brand: req.user._id,
    status: 'open'
  });
  res.status(201).json(campaign);
};

exports.approveCampaign = async (req, res) => {
  const campaign = await Campaign.findById(req.params.id);
  if (!campaign) return res.status(404).json({ message: 'Campaign not found' });
  if (String(campaign.brand) !== String(req.user._id)) return res.status(403).json({ message: 'Not campaign owner' });
  campaign.status = 'open';
  await campaign.save();

  // If this campaign was requested by a creator, create escrow for the budget
  let escrow = null;
  if (campaign.requestedBy) {
    const escrowService = require('../utils/escrowService');
    escrow = await escrowService.createEscrow({
      campaignId: campaign._id,
      creatorId: campaign.requestedBy,
      brandId: req.user._id,
      amount: campaign.budget
    });
  }

  res.json({ campaign, escrow });
};

exports.rejectCampaign = async (req, res) => {
  const campaign = await Campaign.findById(req.params.id);
  if (!campaign) return res.status(404).json({ message: 'Campaign not found' });
  if (String(campaign.brand) !== String(req.user._id)) return res.status(403).json({ message: 'Not campaign owner' });
  campaign.status = 'rejected';
  await campaign.save();
  res.json(campaign);
};

exports.listPendingForBrand = async (req, res) => {
  const campaigns = await Campaign.find({ brand: req.user._id, status: 'pending' });
  res.json(campaigns);
};

exports.listOpenCampaigns = async (req, res) => {
  const campaigns = await Campaign.find({ status: 'open' }).populate('brand', 'name');
  res.json(campaigns);
};

exports.getCampaign = async (req, res) => {
  const campaign = await Campaign.findById(req.params.id).populate('brand', 'name email');
  if (!campaign) return res.status(404).json({ message: 'Not found' });
  // include pitches if brand
  let pitches = [];
  if (req.user && String(campaign.brand._id) === String(req.user._id)) {
    pitches = await Pitch.find({ campaignId: campaign._id }).populate('creatorId', 'name');
  }
  // include escrow if exists
  const Escrow = require('../models/Escrow');
  const escrow = await Escrow.findOne({ campaignId: campaign._id });
  res.json({ campaign, pitches, escrow });
};

exports.getBrandCampaigns = async (req, res) => {
  const campaigns = await Campaign.find({ brand: req.user._id });
  res.json(campaigns);
};
