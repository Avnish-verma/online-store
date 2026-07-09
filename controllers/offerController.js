const Offer = require('../models/Offer');
const { sendSuccess, sendError } = require('../utils/response');

exports.getOffers = async (req, res) => {
  try {
    const offers = await Offer.find().sort({ createdAt: -1 });
    return sendSuccess(res, offers);
  } catch (err) {
    return sendError(res, err.message, 500);
  }
};

exports.createOffer = async (req, res) => {
  try {
    const offer = await Offer.create(req.body);
    return sendSuccess(res, offer, 201);
  } catch (err) {
    return sendError(res, err.message, 400);
  }
};

exports.updateOffer = async (req, res) => {
  try {
    const offer = await Offer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!offer) return sendError(res, 'Offer timeline configuration missing', 404);
    return sendSuccess(res, offer);
  } catch (err) {
    return sendError(res, err.message, 400);
  }
};

exports.deleteOffer = async (req, res) => {
  try {
    const offer = await Offer.findByIdAndDelete(req.params.id);
    if (!offer) return sendError(res, 'Target instance missing', 404);
    return sendSuccess(res, {});
  } catch (err) {
    return sendError(res, err.message, 500);
  }
};