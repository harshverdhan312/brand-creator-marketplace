require('dotenv').config();
require('express-async-errors');
const express = require('express');
const crypto = require('crypto');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const pitchRoutes = require('./routes/pitchRoutes');
const escrowRoutes = require('./routes/escrowRoutes');
const usersRoutes = require('./routes/usersRoutes');
const disputeRoutes = require('./routes/disputeRoutes');
const submissionRoutes = require('./routes/submissionRoutes');
const messageRoutes = require('./routes/messageRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const adminRoutes = require('./routes/adminRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
// Allow requests from frontend dev server and production
const allowedOrigins = [
  'http://localhost:5137',
  'http://localhost:5173',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (mobile apps, curl, etc.)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  },
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

const csrfSafeMethods = new Set(['GET', 'HEAD', 'OPTIONS']);
app.use((req, res, next) => {
  const isSafe = csrfSafeMethods.has(req.method);
  if (isSafe) {
    if (!req.cookies.csrfToken) {
      const csrfToken = crypto.randomBytes(24).toString('hex');
      res.cookie('csrfToken', csrfToken, {
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production'
      });
    }
    return next();
  }

  const hasBearer = Boolean(req.headers.authorization && req.headers.authorization.startsWith('Bearer '));
  if (hasBearer) return next();

  const csrfCookie = req.cookies.csrfToken;
  const csrfHeader = req.headers['x-csrf-token'];
  if (!csrfCookie || !csrfHeader || csrfCookie !== csrfHeader) {
    return res.status(403).json({ message: 'CSRF token invalid or missing' });
  }
  return next();
});

// routes
app.use('/api/auth', authRoutes);
app.use('/api/pitches', pitchRoutes);
app.use('/api/escrow', escrowRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/disputes', disputeRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5136;
connectDB(process.env.MONGO_URI).then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
