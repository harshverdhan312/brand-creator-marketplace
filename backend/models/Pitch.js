const mongoose = require('mongoose');

const pitchSchema = new mongoose.Schema({
  creatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  // direct brand pitch
  brandId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  message: { type: String, required: true },
  // amount per content piece
  priceAmount: { type: Number, required: true, min: 0 },
  priceUnit: { type: String, default: 'piece' },
  currency: { type: String, default: 'INR' },
  status: { 
    type: String, 
    enum: [
      'PITCH_SUBMITTED',
      'PITCH_ACCEPTED',
      'PITCH_REJECTED',
      'WORK_IN_PROGRESS',
      'WORK_SUBMITTED',
      'APPROVAL_PENDING',
      'APPROVED',
      'DISPUTED',
      'COMPLETED'
    ],
    default: 'PITCH_SUBMITTED'
  },
  timelineDays: { type: Number, min: 0 },
  contentIdea: { type: String },
  // structured pitch details
  platforms: [{ type: String }],
  contentCount: { type: Number, min: 0 },
  frequency: { type: String },
  pricePerContent: { type: Number, min: 0 },
  // conversation between creator and brand
  conversation: [{ sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, message: String, createdAt: { type: Date, default: Date.now } }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Pitch', pitchSchema);
