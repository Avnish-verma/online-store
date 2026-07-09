const mongoose = require('mongoose');
const globalTransform = require('./globalTransform');

const settingSchema = new mongoose.Schema({
  whatsappNumber: { type: String, required: true },
  storeName: { type: String, required: true },
  address: { type: String, default: "" }
}, { timestamps: true });

settingSchema.plugin(globalTransform);
module.exports = mongoose.model('Setting', settingSchema);