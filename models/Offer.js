const mongoose = require('mongoose');
const globalTransform = require('./globalTransform');

const offerSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subtitle: { type: String, required: true },
  imageUrl: { type: String, required: true },
  linkUrl: { type: String, default: "" }
}, { timestamps: true });

offerSchema.plugin(globalTransform);
module.exports = mongoose.model('Offer', offerSchema);