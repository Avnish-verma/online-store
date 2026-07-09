const mongoose = require('mongoose');
const globalTransform = require('./globalTransform');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true, index: true },
  inStock: { type: Boolean, default: true },
  images: [{ type: String, required: true }],
  sizes: [{ type: String }],
  colours: [{ type: String }] // Retained custom contract naming conventions
}, { timestamps: true });

productSchema.plugin(globalTransform);
module.exports = mongoose.model('Product', productSchema);