require('dotenv').config();
require('express-async-errors');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const campaignRoutes = require('./routes/campaignRoutes');
const pitchRoutes = require('./routes/pitchRoutes');
const escrowRoutes = require('./routes/escrowRoutes');
const usersRoutes = require('./routes/usersRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
// Allow requests from frontend dev server
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5137', credentials: true }));
app.use(express.json());
app.use(cookieParser());

// routes
app.use('/api/auth', authRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/pitches', pitchRoutes);
app.use('/api/escrow', escrowRoutes);
app.use('/api/users', usersRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5136;
connectDB(process.env.MONGO_URI).then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
