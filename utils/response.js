const sendSuccess = (res, data = {}, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    data
  });
};

const sendError = (res, message, statusCode = 400, code = null) => {
  const errorPayload = { message };
  if (code) errorPayload.code = code;
  return res.status(statusCode).json({
    success: false,
    error: errorPayload
  });
};

module.exports = { sendSuccess, sendError };