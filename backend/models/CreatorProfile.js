const mongoose = require('mongoose');

const creatorProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  name: { type: String },
  socialHandles: { type: Map, of: String },
  platforms: [{ type: String }],
  audienceSize: { type: Number },
  niche: { type: String },
  portfolio: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('CreatorProfile', creatorProfileSchema);
