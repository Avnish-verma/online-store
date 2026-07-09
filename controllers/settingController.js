const Setting = require('../models/Setting');
const { sendSuccess, sendError } = require('../utils/response');

exports.getSettings = async (req, res) => {
  try {
    let settings = await Setting.findOne();
    if (!settings) {
      // Default fallback parameters initialization
      settings = await Setting.create({
        storeName: "Fashion Point Store",
        whatsappNumber: "919999999999",
        address: "Default Store Infrastructure Complex"
      });
    }
    return sendSuccess(res, settings);
  } catch (err) {
    return sendError(res, err.message, 500);
  }
};

exports.updateSettings = async (req, res) => {
  try {
    let settings = await Setting.findOne();
    if (!settings) {
      settings = await Setting.create(req.body);
    } else {
      settings = await Setting.findByIdAndUpdate(settings._id, req.body, { new: true });
    }
    return sendSuccess(res, settings);
  } catch (err) {
    return sendError(res, err.message, 400);
  }
};