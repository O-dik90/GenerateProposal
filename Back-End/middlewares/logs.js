const logRequest = (req, res, next) => {
  console.log('current action:', req.path);
  next();
}

module.exports = logRequest;