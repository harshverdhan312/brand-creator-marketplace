const mongoose = require('mongoose');

const escrowSchema = new mongoose.Schema({
  creatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  brandId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['ESCROW_CREATED','ESCROW_LOCKED','ESCROW_RELEASED','ESCROW_REFUNDED'], default: 'ESCROW_CREATED' },
  workSubmissionLink: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Escrow', escrowSchema);
