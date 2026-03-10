const mongoose = require('mongoose');

const brandProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  brandName: { type: String },
  industry: { type: String },
  website: { type: String },
  contactInfo: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('BrandProfile', brandProfileSchema);
