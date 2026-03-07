const jwt = require('jsonwebtoken');

const signAccessToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRES || '15m' });
};

const signRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRES || '7d' });
};

const verifyToken = (token, isRefresh = false) => {
  const secret = isRefresh ? (process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET) : process.env.JWT_SECRET;
  return jwt.verify(token, secret);
};

module.exports = { signAccessToken, signRefreshToken, verifyToken };
