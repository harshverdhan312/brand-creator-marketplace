const mongoose = require('mongoose');

const escrowSchema = new mongoose.Schema({
  // campaignId can be null for direct brand-creator agreements
  campaignId: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign' },
  creatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  brandId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['locked', 'released'], default: 'locked' },
  workSubmissionLink: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Escrow', escrowSchema);
