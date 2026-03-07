const User = require('../models/User');

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
  const user = await User.findById(id).select('name bio socialLinks role createdAt')
  if (!user) return res.status(404).json({ message: 'User not found' })
  res.json(user)
}

exports.getMe = async (req, res) => {
  const user = await User.findById(req.user._id).select('name email bio socialLinks role createdAt')
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
