const mongoose = require('mongoose');
const globalTransform = require('./globalTransform');

const orderLogSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  productName: { type: String, required: true },
  size: { type: String, default: "" },
  colour: { type: String, default: "" },
  quantity: { type: Number, required: true }
}, { timestamps: true });

orderLogSchema.plugin(globalTransform);
module.exports = mongoose.model('OrderLog', orderLogSchema);