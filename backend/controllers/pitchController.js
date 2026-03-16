const Pitch = require('../models/Pitch');
const Escrow = require('../models/Escrow');
const Notification = require('../models/Notification');
const escrowService = require('../utils/escrowService');

exports.createPitch = async (req, res) => {
  const { brandId, message, priceAmount, priceUnit, currency, contentIdea, timelineDays, platforms, contentCount, frequency, pricePerContent } = req.body;
  if (!brandId) return res.status(400).json({ message: 'brandId required' });
  if (priceAmount != null && priceAmount < 0) return res.status(400).json({ message: 'Price amount cannot be negative' });
  if (pricePerContent != null && pricePerContent < 0) return res.status(400).json({ message: 'Price per content cannot be negative' });
  const brand = require('../models/User');
  const b = await brand.findById(brandId);
  if (!b || b.role !== 'brand') return res.status(400).json({ message: 'Invalid brand' });
  const pitch = await Pitch.create({
    creatorId: req.user._id,
    brandId,
    message,
    priceAmount,
    priceUnit,
    currency: currency || 'INR',
    contentIdea,
    timelineDays,
    platforms: Array.isArray(platforms) ? platforms : (platforms ? platforms.split(',').map(s => s.trim()) : []),
    contentCount: contentCount || 0,
    frequency,
    pricePerContent: pricePerContent || priceAmount,
    conversation: [{ sender: req.user._id, message }]
  });
  await Notification.create({ userId: b._id, type: 'NEW_PITCH', payload: { pitchId: pitch._id } });
  return res.status(201).json(pitch);
};

// campaign-related pitches removed; fetch by campaign is no longer supported
exports.listPitchesForCampaign = async (req, res) => {
  res.status(404).json({ message: 'Campaigns removed' });
};

// list all pitches for a brand (either direct brand pitches or pitches to campaigns owned by brand)
exports.listPitchesForBrand = async (req, res) => {
  const pitches = await Pitch.find({ brandId: req.user._id }).populate('creatorId', 'name bio');
  res.json(pitches);
};

exports.rejectPitch = async (req, res) => {
  const pitch = await Pitch.findById(req.params.id);
  if (!pitch) return res.status(404).json({ message: 'Pitch not found' });
  // ensure the brand owns the pitch target
  if (String(pitch.brandId) !== String(req.user._id)) {
    return res.status(403).json({ message: 'Not brand' });
  }
  const { message } = req.body;
  pitch.status = 'PITCH_REJECTED';
  if (message) pitch.conversation.push({ sender: req.user._id, message });
  await pitch.save();
  // notify creator with brand feedback
  await Notification.create({ userId: pitch.creatorId, type: 'PITCH_REJECTED', payload: { pitchId: pitch._id, brandMessage: message } });
  res.json(pitch);
};

// Brand accepts a pitch
exports.acceptPitch = async (req, res) => {
  const pitch = await Pitch.findById(req.params.id);
  if (!pitch) return res.status(404).json({ message: 'Pitch not found' });
  // Only direct brand pitches supported now
  if (String(pitch.brandId) !== String(req.user._id)) return res.status(403).json({ message: 'Not brand' });
  const { message } = req.body;
  pitch.status = 'PITCH_ACCEPTED';
  if (message) pitch.conversation.push({ sender: req.user._id, message });
  await pitch.save();
  const amount = pitch.priceAmount;
  const escrow = await escrowService.createEscrow({
    creatorId: pitch.creatorId,
    brandId: req.user._id,
    amount
  });
  await Notification.create({ userId: pitch.creatorId, type: 'PITCH_ACCEPTED', payload: { pitchId: pitch._id, escrowId: escrow._id, brandMessage: message } });
  return res.json({ pitch, escrow });
};

exports.getMyPitches = async (req, res) => {
  // Return creator's pitches with brand info and statuses
  const pitches = await Pitch.find({ creatorId: req.user._id }).populate('brandId', 'name');
  const UserModel = require('../models/User');
  const Escrow = require('../models/Escrow');
  const detailed = await Promise.all(pitches.map(async p => {
    const escrow = await Escrow.findOne({ creatorId: p.creatorId, brandId: p.brandId, amount: p.priceAmount });
    return {
      _id: p._id,
      message: p.message,
      priceAmount: p.priceAmount,
      priceUnit: p.priceUnit,
      currency: p.currency || 'INR',
      status: p.status,
      createdAt: p.createdAt,
      campaign: null,
      brand: p.brandId ? { id: p.brandId._id, name: p.brandId.name } : null,
      platforms: p.platforms || [],
      contentCount: p.contentCount || 0,
      frequency: p.frequency || '',
      pricePerContent: p.pricePerContent || p.priceAmount,
      conversation: p.conversation || [],
      escrowId: escrow ? escrow._id : null
    };
  }));

  res.json(detailed);
};
