const mongoose = require('mongoose');

const pitchSchema = new mongoose.Schema({
  creatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  // either a campaign pitch or a direct brand pitch
  campaignId: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign' },
  brandId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  message: { type: String },
  // amount per content piece
  priceAmount: { type: Number, required: true },
  priceUnit: { type: String, default: 'piece' },
  currency: { type: String, default: 'INR' },
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Pitch', pitchSchema);
