const bcrypt = require('bcryptjs');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const signAuthToken = (user) =>
  jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

// Register a new user
exports.register = async (req, res) => {
  const { name, email, password, role, bio, socialLinks } = req.body;
  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: 'Required fields missing' });
  }
  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }
  // Validate password length
  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters' });
  }
  // Validate role
  if (!['brand', 'creator'].includes(role)) {
    return res.status(400).json({ message: 'Role must be brand or creator' });
  }
  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ message: 'Email already registered' });
  const hashed = await bcrypt.hash(password, 10);
  const createPayload = { name, email, password: hashed, role, bio };
  if (socialLinks && typeof socialLinks === 'object') createPayload.socialLinks = socialLinks;
  const user = await User.create(createPayload);
  const token = signAuthToken(user);
  res.status(201).json({ token, user: { _id: user._id, name: user.name, email: user.email, role: user.role } });
};

// Login
exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: 'Invalid credentials' });
  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ message: 'Invalid credentials' });
  const token = signAuthToken(user);
  res.json({ token, user: { _id: user._id, name: user.name, email: user.email, role: user.role } });
};

// Logout (JWT handled client-side)
exports.logout = async (req, res) => {
  res.json({ message: 'Logged out' });
};

// Get current user
exports.me = async (req, res) => {
  const user = await User.findById(req.user.id).select('_id name email role');
  if (!user) return res.status(401).json({ message: 'User not found' });
  res.json({ user });
};
