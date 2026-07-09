const jwt = require('jsonwebtoken');
const { sendError } = require('../utils/response');

const protectAdmin = async (req, res, next) => {
  try {
    const token = req.cookies.adminSession;
    if (!token) {
      return sendError(res, 'Access Denied: Session Missing', 401);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (error) {
    return sendError(res, 'Session Invalidation Error', 401);
  }
};

module.exports = { protectAdmin };