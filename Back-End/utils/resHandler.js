const sendResponse = (res, statusCode, message, data = null) => {
  const response = {
    message,
    data,
  };

  return res.status(statusCode).json(response);
};

module.exports = { sendResponse };
