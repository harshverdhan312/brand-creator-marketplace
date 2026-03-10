const mongoose = require('mongoose');

const disputeSchema = new mongoose.Schema({
  escrowId: { type: mongoose.Schema.Types.ObjectId, ref: 'Escrow', required: true },
  pitchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Pitch' },
  creatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  brandId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  reason: { type: String },
  status: { type: String, enum: ['OPEN','RESOLVED'], default: 'OPEN' },
  resolution: { type: String, enum: ['CREATOR','BRAND','UNRESOLVED','NONE'], default: 'NONE' },
  conversation: [{ sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, message: String, createdAt: { type: Date, default: Date.now } }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Dispute', disputeSchema);
