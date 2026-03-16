// Centralized error handler
const errorHandler = (err, req, res, next) => {
  console.error(err);

  // Handle Mongoose CastError (invalid ObjectId)
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    return res.status(400).json({ message: 'Invalid ID format' });
  }

  // Handle Mongoose ValidationError
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({ message: messages.join(', ') });
  }

  const status = err.status || 500;
  res.status(status).json({ message: err.message || 'Server Error' });
};

module.exports = errorHandler;
