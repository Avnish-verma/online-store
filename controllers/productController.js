const Product = require('../models/Product');
const OrderLog = require('../models/OrderLog');
const { sendSuccess, sendError } = require('../utils/response');

exports.getProducts = async (req, res) => {
  try {
    const { category, search, inStock, page = 1, limit = 12 } = req.query;
    const query = {};

    if (category) query.category = category;
    if (inStock) query.inStock = inStock === 'true';
    if (search) query.name = { $regex: search, $options: 'i' };

    const parsedLimit = parseInt(limit);
    const parsedPage = parseInt(page);
    const skip = (parsedPage - 1) * parsedLimit;

    const products = await Product.find(query).skip(skip).limit(parsedLimit).sort({ createdAt: -1 });
    const total = await Product.countDocuments(query);

    return sendSuccess(res, {
      products,
      total,
      page: parsedPage,
      limit: parsedLimit
    });
  } catch (err) {
    return sendError(res, err.message, 500);
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return sendError(res, 'Product metrics not discovered', 404);
    return sendSuccess(res, product);
  } catch (err) {
    return sendError(res, err.message, 500);
  }
};

exports.getCategories = async (req, res) => {
  try {
    const categories = await Product.distinct('category');
    return sendSuccess(res, categories);
  } catch (err) {
    return sendError(res, err.message, 500);
  }
};

exports.createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    return sendSuccess(res, product, 201);
  } catch (err) {
    return sendError(res, err.message, 400);
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) return sendError(res, 'Product missing', 404);
    return sendSuccess(res, product);
  } catch (err) {
    return sendError(res, err.message, 400);
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return sendError(res, 'Product missing', 404);
    return sendSuccess(res, {});
  } catch (err) {
    return sendError(res, err.message, 500);
  }
};

exports.logOrder = async (req, res) => {
  try {
    await OrderLog.create(req.body);
    return sendSuccess(res, {});
  } catch (err) {
    return sendError(res, err.message, 400);
  }
};