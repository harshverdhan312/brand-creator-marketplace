const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  budget: { type: Number, required: true },
  brand: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: String },
  deadline: { type: Date },
  // allow campaigns to be created by creators for brands -> pending
  status: { type: String, enum: ['pending','open', 'in-progress', 'completed','rejected'], default: 'open' },
  // if a creator requested this campaign on behalf of a brand
  requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Campaign', campaignSchema);
