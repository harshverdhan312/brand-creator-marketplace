const mongoose = require('mongoose');

const validateObjectId = (paramName = 'id') => (req, res, next) => {
  const value = req.params[paramName];
  if (!value || !mongoose.Types.ObjectId.isValid(value)) {
    return res.status(400).json({ message: 'Invalid ID format' });
  }
  return next();
};

module.exports = validateObjectId;
