const mongoose = require('mongoose');

const escrowSchema = new mongoose.Schema({
  creatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  brandId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true, min: 0 },
  status: { type: String, enum: ['ESCROW_CREATED','ESCROW_FUNDED','ESCROW_LOCKED','WORK_IN_PROGRESS','WORK_SUBMITTED','ESCROW_RELEASED','ESCROW_REFUNDED','DISPUTE_OPENED','DISPUTE_RESOLVED'], default: 'ESCROW_CREATED' },
  workSubmissionLink: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Escrow', escrowSchema);
