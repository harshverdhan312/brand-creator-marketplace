const Pitch = require('../models/Pitch');
const Campaign = require('../models/Campaign');
const Escrow = require('../models/Escrow');
const escrowService = require('../utils/escrowService');

exports.createPitch = async (req, res) => {
  const { campaignId, brandId, message, priceAmount, priceUnit, currency } = req.body;
  // support pitching to a campaign or directly to a brand
  if (campaignId) {
    const campaign = await Campaign.findById(campaignId);
    if (!campaign || campaign.status !== 'open') return res.status(400).json({ message: 'Campaign not open' });
    const pitch = await Pitch.create({ creatorId: req.user._id, campaignId, message, priceAmount, priceUnit, currency: currency || 'INR' });
    return res.status(201).json(pitch);
  }

  if (brandId) {
    // ensure brand exists and is a brand
    const brand = require('../models/User');
    const b = await brand.findById(brandId);
    if (!b || b.role !== 'brand') return res.status(400).json({ message: 'Invalid brand' });
    const pitch = await Pitch.create({ creatorId: req.user._id, brandId, message, priceAmount, priceUnit, currency: currency || 'INR' });
    return res.status(201).json(pitch);
  }

  return res.status(400).json({ message: 'campaignId or brandId required' });
};

exports.listPitchesForCampaign = async (req, res) => {
  const pitches = await Pitch.find({ campaignId: req.params.campaignId }).populate('creatorId', 'name bio');
  res.json(pitches);
};

// list all pitches for a brand (either direct brand pitches or pitches to campaigns owned by brand)
exports.listPitchesForBrand = async (req, res) => {
  // find campaigns owned by brand
  const campaigns = await Campaign.find({ brand: req.user._id }).select('_id');
  const campaignIds = campaigns.map(c => c._id);
  const pitches = await Pitch.find({
    $or: [
      { brandId: req.user._id },
      { campaignId: { $in: campaignIds } }
    ]
  }).populate('creatorId', 'name bio').populate('campaignId', 'title');
  res.json(pitches);
};

exports.rejectPitch = async (req, res) => {
  const pitch = await Pitch.findById(req.params.id);
  if (!pitch) return res.status(404).json({ message: 'Pitch not found' });
  // ensure brand owns the campaign or is targeted brand
  if (pitch.campaignId) {
    const campaign = await Campaign.findById(pitch.campaignId);
    if (String(campaign.brand) !== String(req.user._id)) return res.status(403).json({ message: 'Not campaign owner' });
  } else if (String(pitch.brandId) !== String(req.user._id)) {
    return res.status(403).json({ message: 'Not brand' });
  }
  pitch.status = 'rejected';
  await pitch.save();
  res.json(pitch);
};

// Brand accepts a pitch
exports.acceptPitch = async (req, res) => {
  const pitch = await Pitch.findById(req.params.id);
  if (!pitch) return res.status(404).json({ message: 'Pitch not found' });
  // If this pitch is for a campaign, ensure the requester owns that campaign
  if (pitch.campaignId) {
    const campaign = await Campaign.findById(pitch.campaignId);
    if (!campaign) return res.status(404).json({ message: 'Campaign not found' });
    if (String(campaign.brand) !== String(req.user._id)) return res.status(403).json({ message: 'Not campaign owner' });
    if (campaign.status !== 'open') return res.status(400).json({ message: 'Campaign not open' });

    // update pitch statuses: accepted this, reject others
    await Pitch.updateMany({ campaignId: campaign._id }, { $set: { status: 'rejected' } });
    pitch.status = 'accepted';
    await pitch.save();

    // change campaign status
    campaign.status = 'in-progress';
    await campaign.save();

    // create escrow and simulate moving funds
    const amount = pitch.priceAmount;
    const escrow = await escrowService.createEscrow({
      campaignId: campaign._id,
      creatorId: pitch.creatorId,
      brandId: req.user._id,
      amount
    });

    return res.json({ pitch, campaign, escrow });
  }

  // If this is a direct pitch to a brand (brandId), allow the brand to accept
  if (pitch.brandId) {
    if (String(pitch.brandId) !== String(req.user._id)) return res.status(403).json({ message: 'Not brand' });
    pitch.status = 'accepted';
    await pitch.save();

    const amount = pitch.priceAmount;
    const escrow = await escrowService.createEscrow({
      campaignId: null,
      creatorId: pitch.creatorId,
      brandId: req.user._id,
      amount
    });

    return res.json({ pitch, escrow });
  }

  return res.status(400).json({ message: 'Cannot accept this pitch' });
};

exports.getMyPitches = async (req, res) => {
  // Return creator's pitches with populated brand/campaign info and statuses
  const pitches = await Pitch.find({ creatorId: req.user._id })
    .populate('campaignId', 'title brand')
    .populate('brandId', 'name');

  // populate campaign.brand name if present
  const CampaignModel = require('../models/Campaign');
  const UserModel = require('../models/User');

  const detailed = await Promise.all(pitches.map(async p => {
    let brand = null;
    if (p.brandId) brand = await UserModel.findById(p.brandId).select('name');
    if (p.campaignId && p.campaignId.brand) {
      const b = await UserModel.findById(p.campaignId.brand).select('name');
      brand = brand || b;
    }
    return {
      _id: p._id,
      message: p.message,
      priceAmount: p.priceAmount,
      priceUnit: p.priceUnit,
      currency: p.currency || 'INR',
      status: p.status,
      createdAt: p.createdAt,
      campaign: p.campaignId ? { id: p.campaignId._id, title: p.campaignId.title } : null,
      brand: brand ? { id: brand._id, name: brand.name } : null
    };
  }));

  res.json(detailed);
};
