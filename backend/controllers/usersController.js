const User = require('../models/User');
const mongoose = require('mongoose');

exports.listBrands = async (req, res) => {
  const brands = await User.find({ role: 'brand' }).select('name bio socialLinks createdAt');
  res.json(brands);
};

exports.listCreators = async (req, res) => {
  const creators = await User.find({ role: 'creator' }).select('name bio socialLinks createdAt');
  res.json(creators);
};

exports.getUserById = async (req, res) => {
  const { id } = req.params
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid ID format' })
  }
  const user = await User.findById(id).select('name bio socialLinks role createdAt balance')
  if (!user) return res.status(404).json({ message: 'User not found' })
  res.json(user)
}

exports.getMe = async (req, res) => {
  const user = await User.findById(req.user._id).select('name email bio socialLinks role createdAt balance')
  res.json(user)
}

exports.updateMe = async (req, res) => {
  const { name, bio, socialLinks } = req.body
  const user = await User.findById(req.user._id)
  if (!user) return res.status(404).json({ message: 'User not found' })
  if (name) user.name = name
  if (bio) user.bio = bio
  if (socialLinks && typeof socialLinks === 'object') {
    // replace socialLinks map
    user.socialLinks = socialLinks
  }
  await user.save()
  res.json(user)
}

exports.searchUsers = async (req, res) => {
  const { q } = req.query
  if (!q || !q.trim()) return res.json([])
  const users = await User.find({
    name: { $regex: q.trim(), $options: 'i' }
  }).select('name role bio').limit(20)
  res.json(users)
}
