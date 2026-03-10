const mongoose = require('mongoose');

const deliverableSchema = new mongoose.Schema({
  type: { type: String },
  url: { type: String }
});

const submissionSchema = new mongoose.Schema({
  escrowId: { type: mongoose.Schema.Types.ObjectId, ref: 'Escrow', required: true },
  pitchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Pitch' },
  creatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  brandId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  deliverables: [deliverableSchema],
  notes: { type: String },
  rejectionReason: { type: String },
  status: { type: String, enum: ['SUBMITTED','ACCEPTED','REJECTED'], default: 'SUBMITTED' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Submission', submissionSchema);
