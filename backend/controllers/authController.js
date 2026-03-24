const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const User = require('../models/User');
const { signAccessToken, signRefreshToken, verifyToken } = require('../utils/jwt');

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
  const accessToken = signAccessToken({ id: user._id });
  const refreshToken = signRefreshToken({ id: user._id });
  const csrfToken = crypto.randomBytes(24).toString('hex');
  // set refresh token as httpOnly cookie
  res.cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', maxAge: 7 * 24 * 60 * 60 * 1000 });
  res.cookie('csrfToken', csrfToken, { sameSite: 'lax', secure: process.env.NODE_ENV === 'production', maxAge: 7 * 24 * 60 * 60 * 1000 });
  res.status(201).json({ token: accessToken, user: { _id: user._id, name: user.name, email: user.email, role: user.role } });
};

// Login
exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: 'Invalid credentials' });
  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ message: 'Invalid credentials' });
  const accessToken = signAccessToken({ id: user._id });
  const refreshToken = signRefreshToken({ id: user._id });
  const csrfToken = crypto.randomBytes(24).toString('hex');
  res.cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', maxAge: 7 * 24 * 60 * 60 * 1000 });
  res.cookie('csrfToken', csrfToken, { sameSite: 'lax', secure: process.env.NODE_ENV === 'production', maxAge: 7 * 24 * 60 * 60 * 1000 });
  res.json({ token: accessToken, user: { _id: user._id, name: user.name, email: user.email, role: user.role } });
};

// Refresh access token using refresh token cookie
exports.refresh = async (req, res) => {
  const { refreshToken } = req.cookies || {};
  if (!refreshToken) return res.status(401).json({ message: 'No refresh token' });
  try {
    const payload = verifyToken(refreshToken, true);
    const user = await User.findById(payload.id).select('-password');
    if (!user) return res.status(401).json({ message: 'Invalid token user' });
    const accessToken = signAccessToken({ id: user._id });
    const newRefresh = signRefreshToken({ id: user._id });
    const csrfToken = crypto.randomBytes(24).toString('hex');
    res.cookie('refreshToken', newRefresh, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', maxAge: 7 * 24 * 60 * 60 * 1000 });
    res.cookie('csrfToken', csrfToken, { sameSite: 'lax', secure: process.env.NODE_ENV === 'production', maxAge: 7 * 24 * 60 * 60 * 1000 });
    return res.json({ token: accessToken, user });
  } catch (err) {
    return res.status(401).json({ message: 'Invalid refresh token' });
  }
};

// Logout - clear refresh cookie
exports.logout = async (req, res) => {
  res.clearCookie('refreshToken');
  res.clearCookie('csrfToken');
  res.json({ message: 'Logged out' });
};

// Get current user
exports.me = async (req, res) => {
  res.json(req.user);
};
