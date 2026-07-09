const mongoose = require('mongoose');
const globalTransform = require('./globalTransform');

const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true }
}, { timestamps: true });

adminSchema.plugin(globalTransform);
module.exports = mongoose.model('Admin', adminSchema);