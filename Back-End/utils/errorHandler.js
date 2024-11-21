const errorHandler = (err, req, res) => {
  console.error(err); // Log error details (don't log in production)

  if (err.name === 'ValidationError') {
    return res.status(400).json({ message: err.message });
  }

  res
    .status(500)
    .json({ message: 'An unexpected error occurred', error: err.message });
};

module.exports = errorHandler;
