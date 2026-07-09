const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendSuccess, sendError } = require('../utils/response');

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ username });
    if (!admin) return sendError(res, 'Invalid Credentials', 401);

    const match = await bcrypt.compare(password, admin.passwordHash);
    if (!match) return sendError(res, 'Invalid Credentials', 401);

    const token = jwt.sign({ id: admin._id, username: admin.username }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.cookie('adminSession', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000 // 1 Day
    });

    return sendSuccess(res, {});
  } catch (err) {
    return sendError(res, err.message, 500);
  }
};

exports.verifySession = async (req, res) => {
  return sendSuccess(res, { verified: true });
};

exports.logout = async (req, res) => {
  res.clearCookie('adminSession');
  return sendSuccess(res, {});
};